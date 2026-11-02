/* Fills the front-page menu card and bar card from menu-data.js */
(() => {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = n => ELC.currency + ' ' + n.toLocaleString('en-IN');
  const courses = document.getElementById('carte-courses');
  const index = document.getElementById('carte-index');
  if (courses) {
    courses.innerHTML = ELC_MENU.map(c => `
      <div class="ca__course" id="carte-${c.id}">
        <h3 class="m-text-3">${esc(c.title)}</h3>
        <ul class="ca__list">${c.items.map(i => `
          <li class="ca__item"><p class="m-text-5">${esc(i.name)}</p><p class="m-text-4">${esc(i.desc)}</p><p class="m-text-5 ca__price"><data value="${i.price}">${money(i.price)}</data></p></li>`).join('')}
        </ul>
      </div>`).join('');
  }
  if (index) index.innerHTML = ELC_MENU.map(c => `<a class="m-link-2" href="#carte-${c.id}">${esc(c.title)}</a>`).join('');
  const bar = document.getElementById('bar-list');
  if (bar) bar.innerHTML = ELC_BAR.map(d => `
    <li class="br__item br__item--plain"><p class="m-text-5">${esc(d.name)}${d.tag ? `<span class="br__tag">${esc(d.tag)}</span>` : ''}</p><p class="m-text-4">${esc(d.desc)}</p></li>`).join('');
})();
