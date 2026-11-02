/* Takeaway ordering page */
(() => {
  const U = ELC_UTIL;
  const money = n => ELC.currency + ' ' + n.toLocaleString('en-IN');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const items = ELC_MENU.flatMap(c => c.items);
  const byId = Object.fromEntries(items.map(i => [i.id, i]));
  let cart = U.store.get('elc-cart', {});
  Object.keys(cart).forEach(id => { if (!byId[id] || !(cart[id] > 0)) delete cart[id]; });

  const menuEl = document.getElementById('order-menu');
  const linesEl = document.getElementById('cart-lines');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');
  const form = document.getElementById('order-form');
  const dayEl = form.elements.day, timeEl = form.elements.time;
  const closedMsg = document.getElementById('pickup-msg');
  const done = document.getElementById('order-done');
  const link = document.getElementById('order-wa');

  menuEl.innerHTML = ELC_MENU.map(c => `
    <section class="o-course" aria-labelledby="oc-${c.id}">
      <h2 id="oc-${c.id}" class="p-eyebrow">${esc(c.title)}</h2>
      ${c.items.map(i => `
      <article class="o-item">
        <div><h3>${esc(i.name)}</h3><p>${esc(i.desc)}</p></div>
        <div class="o-buy"><span class="o-price">${money(i.price)}</span>
          <div class="o-qty" data-id="${i.id}"><button type="button" data-d="-1" aria-label="Remove one ${esc(i.name)}">−</button><output aria-live="polite" data-q="${i.id}">0</output><button type="button" data-d="1" aria-label="Add one ${esc(i.name)}">+</button></div>
        </div>
      </article>`).join('')}
    </section>`).join('');

  function save() { U.store.set('elc-cart', cart); }
  function render() {
    const ids = Object.keys(cart);
    items.forEach(i => { const o = menuEl.querySelector(`[data-q="${i.id}"]`); if (o) o.textContent = cart[i.id] || 0; });
    let total = 0, count = 0;
    linesEl.innerHTML = ids.length ? ids.map(id => {
      const it = byId[id], q = cart[id]; total += it.price * q; count += q;
      return `<li><span>${q} × ${esc(it.name)}</span><span>${money(it.price * q)}</span></li>`;
    }).join('') : '<li class="o-empty">Your order is empty. Add a dish to begin.</li>';
    totalEl.textContent = money(total);
    countEl.textContent = count;
    form.elements.place.disabled = !ids.length || !timeEl.value;
  }
  menuEl.addEventListener('click', e => {
    const b = e.target.closest('button[data-d]'); if (!b) return;
    const id = b.parentElement.dataset.id;
    const q = Math.max(0, (cart[id] || 0) + Number(b.dataset.d));
    if (q) cart[id] = q; else delete cart[id];
    save(); render();
  });

  /* Pickup: the next few open days that still have slots. */
  const days = [];
  for (let n = 0; n < 8 && days.length < 4; n++) {
    const d = new Date(); d.setDate(d.getDate() + n);
    if (!U.slots(d, { lastOffset: ELC.slotMinutes, earliestFromNow: ELC.prepMinutes }).length) continue;
    days.push({ iso: U.isoDate(d), label: (n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : U.prettyDate(d)) });
  }
  dayEl.innerHTML = days.map(d => `<option value="${d.iso}">${d.label}</option>`).join('');
  function refreshPickup() {
    if (!dayEl.value) { timeEl.innerHTML = '<option value="">No pickup slots</option>'; return; }
    const d = U.parseISO(dayEl.value);
    timeEl.innerHTML = U.optionsHTML(U.slots(d, { lastOffset: ELC.slotMinutes, earliestFromNow: ELC.prepMinutes }));
    render();
  }
  dayEl.addEventListener('change', refreshPickup);
  closedMsg.textContent = `Takeaway needs about ${ELC.prepMinutes} minutes' notice. Closed on Mondays.`;
  refreshPickup();

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    const ids = Object.keys(cart); if (!ids.length) return;
    const d = U.parseISO(dayEl.value);
    const lines = ids.map(id => `${cart[id]} × ${byId[id].name} — ${money(byId[id].price * cart[id])}`);
    const total = ids.reduce((s, id) => s + byId[id].price * cart[id], 0);
    const f = { name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(), pickup: `${U.prettyDate(d)}, ${U.fmt(Number(timeEl.value))}`, note: form.elements.note.value.trim(), total };
    const text = `Takeaway order — ${ELC.name}\nName: ${f.name}\nPhone: ${f.phone}\nPickup: ${f.pickup}\n\n${lines.join('\n')}\n\nTotal: ${money(total)}` + (f.note ? `\nNote: ${f.note}` : '');
    link.href = await U.send('takeaway', { ...f, items: ids.map(id => ({ id, name: byId[id].name, qty: cart[id] })) }, text);
    document.getElementById('order-summary').textContent = `${lines.length} dish${lines.length === 1 ? '' : 'es'} · ${money(total)} · pickup ${f.pickup}`;
    form.hidden = true; document.getElementById('cart-box').hidden = true; done.hidden = false; done.focus();
    cart = {}; save();
  });
  render();
})();
