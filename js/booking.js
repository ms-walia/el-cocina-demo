/* Shared helpers for the reserve and takeaway pages: opening hours, time slots, sending a request. */
window.ELC_UTIL = (() => {
  const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const fmt = m => {
    const h24 = Math.floor(m / 60) % 24, mm = String(m % 60).padStart(2, '0');
    const h = h24 % 12 || 12;
    return `${h}:${mm}${h24 < 12 ? 'am' : 'pm'}`;
  };
  const pad = n => String(n).padStart(2, '0');
  const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parseISO = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const isClosed = date => date.getDay() === ELC.closedWeekday;
  const prettyDate = date => date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const sameDay = (a, b) => isoDate(a) === isoDate(b);

  /* Slots for a day. lastOffset = minutes before closing that the last slot may start. */
  function slots(date, { lastOffset, earliestFromNow = 0 }) {
    if (isClosed(date)) return [];
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes() + earliestFromNow;
    const today = sameDay(date, now);
    return ELC.services.map(s => {
      const out = [];
      for (let t = toMin(s.open); t <= toMin(s.close) - lastOffset; t += ELC.slotMinutes) {
        if (!today || t >= nowMin) out.push({ value: String(t), label: fmt(t) });
      }
      return { name: s.name, times: out };
    }).filter(g => g.times.length);
  }

  function optionsHTML(groups) {
    return groups.map(g => `<optgroup label="${g.name}">${g.times.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}</optgroup>`).join('');
  }

  /* Opens a pre-filled WhatsApp chat; optionally also POSTs to ELC.endpoint. */
  async function send(kind, fields, text) {
    if (ELC.endpoint) {
      try { await fetch(ELC.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ kind, ...fields, message: text }) }); }
      catch (e) { /* the WhatsApp link below still works */ }
    }
    return `https://wa.me/${ELC.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  return { toMin, fmt, isoDate, parseISO, isClosed, prettyDate, slots, optionsHTML, send, store };
})();
