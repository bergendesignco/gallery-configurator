import * as esbuild from 'esbuild';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {inlineSafe} from './inline-safe.mjs';
const cdn={three:'https://cdn.jsdelivr.net/npm/three@0.186.1/build/three.module.js',gsap:'https://cdn.jsdelivr.net/npm/gsap@3.15.0/index.js','gsap/CustomEase':'https://cdn.jsdelivr.net/npm/gsap@3.15.0/CustomEase.js'};
const plugins=[{name:'pinned-browser-dependencies',setup(build){build.onResolve({filter:/^(three|gsap)(\/.*)?$/},args=>{if(!cdn[args.path])throw Error('Unmapped dependency '+args.path);return {path:cdn[args.path],external:true};});}}];
const common={bundle:true,format:'esm',target:['es2022'],loader:{'.css':'text'},minify:true,write:false,plugins,logLevel:'warning',logOverride:{'ignored-bare-import':'silent'}};
await mkdir('dist',{recursive:true});
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
let standaloneSummary='';
if (!process.argv.includes('--cdn-only')) {
const runtime=await esbuild.build({...common,entryPoints:['src/runtime.js']});
const runtimeCode=runtime.outputFiles[0].text;
await writeFile('dist/runtime.js',runtimeCode);
const studio=await esbuild.build({...common,entryPoints:['src/studio.js'],define:{__RUNTIME_SOURCE__:JSON.stringify(runtimeCode)}});
const studioCode=studio.outputFiles[0].text;
await writeFile('dist/gallery-studio.js',studioCode);
const tag='<script type="module">\n'+inlineSafe(studioCode)+'\n</script>';
await writeFile('dist/install-studio.txt','<!-- Gallery Studio: private test-site configurator -->\n'+tag);
const html='<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Gallery studio</title><style>body{margin:0;background:#f3f5f8}</style></head><body>'+tag+'</body></html>';
await writeFile('dist/gallery-configurator.html',html);
await writeFile('dist/installer.html','<!doctype html><meta charset="UTF-8"><title>Gallery Studio installer</title><h1>Gallery Studio installer</h1><p>Paste into the test site Footer Code Injection.</p><textarea id="installer" style="width:95vw;height:70vh">'+escape(tag)+'</textarea>');

standaloneSummary = `runtime ${Math.round(runtimeCode.length/1024)} KB, studio ${Math.round(studioCode.length/1024)} KB, and `;
}

// Keep external imports inside the page guard and keep their native ESM
// semantics. In particular, GSAP's default export is the animation API.
// These are the named Three.js bindings used by the preserved spiral files.
const remoteBindings = {
  three: [
    'BufferGeometry', 'Float32BufferAttribute', 'LineBasicMaterial', 'LineLoop',
    'DoubleSide', 'Mesh', 'NoToneMapping', 'PerspectiveCamera', 'PlaneGeometry',
    'Raycaster', 'Scene', 'ShaderMaterial', 'SRGBColorSpace', 'TextureLoader',
    'Vector2', 'WebGLRenderer',
  ],
  gsap: ['default'],
  'gsap/CustomEase': ['CustomEase'],
};
const lazyDependencies = {
  name: 'page-scoped-es-modules',
  setup(build) {
    build.onResolve({filter: /^(three|gsap)(\/.*)?$/}, ({path}) => {
      if (!Object.hasOwn(remoteBindings, path)) throw Error(`Unmapped dependency ${path}`);
      return {path, namespace: 'gallery-cdn'};
    });
    build.onLoad({filter: /.*/, namespace: 'gallery-cdn'}, ({path}) => {
      const declarations = remoteBindings[path].map(name => name === 'default'
        ? 'export default namespace.default;'
        : `export const ${name} = namespace.${name};`);
      return {contents: [`const namespace = await import(${JSON.stringify(cdn[path])});`, ...declarations].join('\n')};
    });
  },
};
const pageMarkers = ['data-gallery-configure', 'data-gallery-layout']
  .map(attribute => `head script[type="application/json"][${attribute}]`).join(', ');
const inlineBuild = await esbuild.build({
  ...common,
  stdin: {
    resolveDir: process.cwd(),
    sourcefile: 'gallery-inline-entry.mjs',
    contents: `export let startInline;
      if (document.querySelector(${JSON.stringify(pageMarkers)})) {
        const entry = await import('./src/inline.js');
        startInline = entry.startInline;
      }`,
  },
  plugins: [lazyDependencies],
});
const inlineModule = inlineBuild.outputFiles[0].text;
const inlineInstaller = '<!-- Gallery Studio: inline galleries -->\n<script type="module">\n'
  + inlineSafe(inlineModule) + '\n</script>';
const {version} = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const cdnInstaller = `<script type="module" src="https://cdn.jsdelivr.net/gh/bergendesignco/gallery-configurator@v${version}/dist/gallery-inline.js"></script>\n`;
const configureMarker = '<script type="application/json" data-gallery-configure>{}</script>';
const transferPage = '<!doctype html><html lang="en"><head><meta charset="UTF-8">'
  + '<title>Gallery Studio installer transfer</title></head><body>'
  + '<p>Inline installer ready for transfer.</p>'
  + '<textarea id="installer" hidden readonly tabindex="-1" aria-hidden="true">'
  + escape(inlineInstaller) + '</textarea></body></html>';
await Promise.all([
  writeFile('dist/gallery-inline.js', inlineModule),
  writeFile('dist/install-cdn.txt', cdnInstaller),
  writeFile('dist/install-inline.txt', inlineInstaller),
  writeFile('dist/configure-page.txt', configureMarker + '\n'),
  writeFile('dist/inline-transfer.html', transferPage),
]);
console.log(`Built ${standaloneSummary}inline gallery ${Math.round(inlineModule.length/1024)} KB.`);
