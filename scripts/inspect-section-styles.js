// DevTools console only. Select an element in the section in the Elements panel.
// This reads that element's document; it does not modify the page.
(() => {
  const selected = typeof $0 !== 'undefined' && $0?.closest ? $0 : null;
  const doc = selected?.ownerDocument || document;
  const section = selected?.closest('section[data-section-id]') ||
    doc.querySelector('section.user-items-list-section') ||
    doc.querySelector('.sqs-block-gallery')?.closest('section[data-section-id]');
  if (!section) return 'Select an element inside the Squarespace section, then run again.';
  const list = section.querySelector('ul.user-items-list-simple');
  const style = el => el.ownerDocument.defaultView.getComputedStyle(el);
  const sectionStyle = style(section);
  const localStyle = list ? style(list) : sectionStyle;
  const names = [...localStyle].filter(key => key.startsWith('--') && !key.startsWith('--gc-')).sort();
  const values = Object.fromEntries(names.map(key => [key, localStyle.getPropertyValue(key).trim()]));
  const roles = names.filter(key => /^--(?:list-section-simple-|list-section-carousel-arrow-|(?:heading|body)-font-|(?:title|body|button)-font-size-value$|siteBackgroundColor$|primaryButton(?:Text|Background)Color$)/.test(key));
  const text = {};
  for (const selector of ['.list-item-content__title', '.list-item-content__description p', '.list-item-content__button']) {
    const element = section.querySelector(selector);
    if (!element) continue;
    const css = style(element);
    text[selector] = {size:css.fontSize, family:css.fontFamily, weight:css.fontWeight,
      lineHeight:css.lineHeight, tracking:css.letterSpacing, color:css.color};
  }
  console.table(roles.map(name => ({name, section:sectionStyle.getPropertyValue(name).trim(),
    list:localStyle.getPropertyValue(name).trim()})));
  console.table(text);
  return {sectionId:section.dataset.sectionId, theme:section.dataset.sectionTheme,
    width:doc.documentElement.clientWidth, text, values};
})();
