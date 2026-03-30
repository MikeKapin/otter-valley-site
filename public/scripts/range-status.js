document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('range-list');
  const updated = document.getElementById('range-updated');
  if (!list) return;

  fetch('/data/range-status.json')
    .then((res) => res.json())
    .then((data) => {
      // Clear loading state
      list.textContent = '';

      data.ranges.forEach((r) => {
        const row = document.createElement('div');
        row.className = 'range-row';

        const dot = document.createElement('span');
        const dotClass = r.status === 'open' ? 'open' : r.status === 'closed' ? 'closed' : 'reserved';
        dot.className = `status-dot ${dotClass}`;
        row.appendChild(dot);

        const name = document.createElement('span');
        name.className = 'range-name';
        name.textContent = r.name;
        row.appendChild(name);

        const badge = document.createElement('span');
        badge.className = `range-badge ${dotClass}`;
        badge.textContent = r.status;
        row.appendChild(badge);

        if (r.note) {
          const note = document.createElement('span');
          note.className = 'range-note';
          note.textContent = r.note;
          row.appendChild(note);
        }

        list.appendChild(row);
      });

      if (updated && data.lastUpdated) {
        const d = new Date(data.lastUpdated);
        updated.textContent = `Last updated: ${d.toLocaleDateString('en-CA')} ${d.toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })}`;
      }
    })
    .catch(() => {
      list.textContent = '';
      const msg = document.createElement('p');
      msg.className = 'range-loading';
      msg.textContent = 'Unable to load range status.';
      list.appendChild(msg);
    });
});
