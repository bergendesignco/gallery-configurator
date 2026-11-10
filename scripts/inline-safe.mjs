// Keep JavaScript strings intact when the surrounding HTML parser reads them.
export function inlineSafe(code) {
  return code.replace(/<\/script/gi, '<\\/script')
    .replace(/<script/gi, '<\\x73cript')
    .replace(/<!--/g, '\\x3c!--');
}
