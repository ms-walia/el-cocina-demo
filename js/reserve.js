/* Reservation page */
(() => {
  const U = ELC_UTIL;
  const form = document.getElementById('reserve-form');
  const dateEl = form.elements.date, timeEl = form.elements.time, guestsEl = form.elements.guests;
  const msg = document.getElementById('time-msg');
  const done = document.getElementById('reserve-done');
  const link = document.getElementById('reserve-wa');

  dateEl.min = U.isoDate(new Date());
  guestsEl.innerHTML = Array.from({ length: ELC.maxOnlineGuests }, (_, i) => `<option value="${i + 1}"${i === 1 ? ' selected' : ''}>${i + 1}</option>`).join('');
  document.getElementById('big-group').textContent = `For more than ${ELC.maxOnlineGuests} guests, please call ${ELC.phoneDisplay}.`;

  function refreshTimes() {
    msg.textContent = '';
    if (!dateEl.value) { timeEl.innerHTML = '<option value="">Choose a date first</option>'; return; }
    const d = U.parseISO(dateEl.value);
    if (U.isClosed(d)) { timeEl.innerHTML = '<option value="">Closed on Mondays</option>'; msg.textContent = 'We are closed on Mondays — please pick another day.'; return; }
    const groups = U.slots(d, { lastOffset: ELC.lastSeatingBeforeClose });
    if (!groups.length) { timeEl.innerHTML = '<option value="">No tables left today</option>'; msg.textContent = 'No more tables today — please pick another day.'; return; }
    timeEl.innerHTML = U.optionsHTML(groups);
  }
  dateEl.addEventListener('change', refreshTimes);
  refreshTimes();

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity() || !timeEl.value) { form.reportValidity(); if (!timeEl.value) msg.textContent = msg.textContent || 'Please choose a date and time.'; return; }
    const d = U.parseISO(dateEl.value);
    const f = {
      name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(),
      date: U.prettyDate(d), time: U.fmt(Number(timeEl.value)), guests: guestsEl.value, note: form.elements.note.value.trim()
    };
    const text = `Table request — ${ELC.name}\nName: ${f.name}\nPhone: ${f.phone}\nDate: ${f.date}\nTime: ${f.time}\nGuests: ${f.guests}` + (f.note ? `\nNote: ${f.note}` : '');
    link.href = await U.send('reservation', f, text);
    document.getElementById('reserve-summary').textContent = `${f.guests} guest${f.guests === '1' ? '' : 's'} · ${f.date} · ${f.time}`;
    form.hidden = true; done.hidden = false; done.focus();
  });
})();
