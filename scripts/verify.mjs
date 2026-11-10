import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { inlineSafe } from './inline-safe.mjs';

function extractModule(source, name) {
  const openings = [...source.matchAll(/<script\b/gi)];
  const closings = [...source.matchAll(/<\/script\b/gi)];
  assert.equal(openings.length, 1, `${name}: expected exactly one script opening`);
  assert.equal(closings.length, 1, `${name}: expected exactly one script closing`);
  const matches = [...source.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  assert.equal(matches.length, 1, `${name}: script must be safely terminated`);
  const [, attributes, code] = matches[0];
  assert.match(attributes, /^\s*type\s*=\s*(["'])module\1\s*$/i,
    `${name}: expected one inline module script without extra attributes`);
  assert.ok(code.trim(), `${name}: module body must not be empty`);
  assert.doesNotMatch(code, /<script|<\/script|<!--/i,
    `${name}: inline module contains an HTML parser entry point`);
  return code;
}

function checkSyntax(name, code) {
  const result = spawnSync(process.execPath, ['--check', '--input-type=module'], {
    input: code,
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${name}: JavaScript syntax check failed\n${result.stderr}`);
}

function runPageProbe(probe, message) {
  // Node rejects HTTP module imports, so an eager CDN dependency fails here.
  const result = spawnSync(process.execPath, ['--input-type=module'], {
    input: probe, encoding: 'utf8', maxBuffer: 1024 * 1024,
  });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${message}\n${result.stderr}`);
}

function checkUnmarkedPage(code) {
  const probe = `let checkedGalleryMarker = false; globalThis.document = {querySelector(selector) {
    if (!selector.includes('data-gallery-configure') || !selector.includes('data-gallery-layout')) {
      throw Error('Both supported page markers must be checked');
    }
    checkedGalleryMarker = true;
    return null;
  }};\n${code}\nif (!checkedGalleryMarker) throw Error('The footer must query page markers');\n`;
  runPageProbe(probe, 'Inline footer must skip an unmarked page');
}

function checkAuthorPage(code) {
  const probe = `globalThis.window = globalThis;
    globalThis.document = {
      readyState: 'complete',
      querySelector(selector) { return selector.includes('data-gallery-configure') ? {} : null; },
      querySelectorAll() { return []; }
    };\n${code}\n
    if (!window.GalleryStudioInline || window.SpiralCarousel) {
      throw Error('Author discovery must initialize independently of the spiral');
    }`;
  runPageProbe(probe, 'Author discovery must run without Spiral CDN imports');
}

function checkTransfer(page, installer) {
  assert.doesNotMatch(page, /<script\b/i, 'Transfer page must contain inert text only');
  const fields = [...page.matchAll(/<textarea\b([^>]*)>([\s\S]*?)<\/textarea>/gi)];
  assert.equal(fields.length, 1, 'Transfer page must contain one textarea');
  const [, attributes, escaped] = fields[0];
  assert.match(attributes, /\bid="installer"/);
  assert.match(attributes, /\shidden(?:\s|$)/);
  assert.match(attributes, /\baria-hidden="true"/);
  const value = escaped.replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
  assert.equal(value, installer, 'Transfer field must reproduce the exact footer snippet');
}

try {
  const [inlineModule, inlineInstaller, marker, transfer] = await Promise.all([
    'gallery-inline.js', 'install-inline.txt', 'configure-page.txt', 'inline-transfer.html',
  ].map(name => readFile(resolve('dist', name), 'utf8')));
  if (!process.argv.includes('--cdn-only')) {
    const [html, installer, studio, runtime] = await Promise.all([
      'gallery-configurator.html', 'install-studio.txt', 'gallery-studio.js', 'runtime.js',
    ].map(name => readFile(resolve('dist', name), 'utf8')));
    const inline = extractModule(html, 'gallery-configurator.html');
    const injection = extractModule(installer, 'install-studio.txt');
    assert.equal(inline, injection, 'Standalone HTML and installer must contain the same module');
    assert.match(html, /<\/script\s*>\s*<\/body>\s*<\/html>\s*$/i);
    for (const [name, code] of [['studio module', inline], ['gallery-studio.js', studio], ['runtime.js', runtime]]) {
      checkSyntax(name, code);
    }
  }
  const footerCode = extractModule(inlineInstaller, 'install-inline.txt');
  assert.equal(footerCode.trim(), inlineSafe(inlineModule).trim(),
    'Footer installer must embed the built inline gallery module');
  assert.equal(marker.trim(), '<script type="application/json" data-gallery-configure>{}</script>',
    'Authoring marker must be directly usable in page Header Code Injection');
  checkTransfer(transfer, inlineInstaller);
  for (const [name, code] of [
    ['gallery-inline.js', inlineModule], ['inline gallery footer', footerCode],
  ]) checkSyntax(name, code);
  checkUnmarkedPage(footerCode);
  checkAuthorPage(footerCode);
  console.log('Verified inline module, marker-free and author pages without CDN imports, authoring marker, and exact hidden transfer payload.');
} catch (error) {
  console.error(`Verification failed: ${error.message}`);
  process.exitCode = 1;
}
