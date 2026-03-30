document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('calendar');
  if (!container) return;

  let currentDate = new Date(2026, 3, 1); // April 2026
  let events = [];
  let activeFilter = 'all';
  let viewMode = 'grid';

  const categories = {
    all: { label: 'All', color: '#c9a84c' },
    competition: { label: 'Competition', color: '#c9a84c' },
    league: { label: 'League', color: '#6d9dc5' },
    social: { label: 'Social', color: '#7cb342' },
    maintenance: { label: 'Maintenance', color: '#ff8a65' },
    meeting: { label: 'Meeting', color: '#ab47bc' },
  };

  fetch('/data/events.json')
    .then((r) => r.json())
    .then((data) => {
      events = data;
      render();
    })
    .catch(() => {
      container.textContent = 'Unable to load events.';
    });

  function render() {
    container.textContent = '';

    // Controls
    const controls = document.createElement('div');
    controls.className = 'cal-controls';

    const navLeft = document.createElement('button');
    navLeft.className = 'cal-nav-btn';
    navLeft.textContent = '\u2039';
    navLeft.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() - 1); render(); });

    const monthLabel = document.createElement('span');
    monthLabel.className = 'cal-month-label';
    monthLabel.textContent = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const navRight = document.createElement('button');
    navRight.className = 'cal-nav-btn';
    navRight.textContent = '\u203A';
    navRight.addEventListener('click', () => { currentDate.setMonth(currentDate.getMonth() + 1); render(); });

    const viewToggle = document.createElement('button');
    viewToggle.className = 'cal-view-btn';
    viewToggle.textContent = viewMode === 'grid' ? 'List View' : 'Grid View';
    viewToggle.addEventListener('click', () => { viewMode = viewMode === 'grid' ? 'list' : 'grid'; render(); });

    controls.appendChild(navLeft);
    controls.appendChild(monthLabel);
    controls.appendChild(navRight);
    controls.appendChild(viewToggle);
    container.appendChild(controls);

    // Filters
    const filters = document.createElement('div');
    filters.className = 'cal-filters';
    Object.entries(categories).forEach(([key, val]) => {
      const btn = document.createElement('button');
      btn.className = `cal-filter-btn ${activeFilter === key ? 'active' : ''}`;
      btn.style.setProperty('--filter-color', val.color);
      btn.textContent = val.label;
      btn.addEventListener('click', () => { activeFilter = key; render(); });
      filters.appendChild(btn);
    });
    container.appendChild(filters);

    const filtered = events.filter((e) => activeFilter === 'all' || e.category === activeFilter);

    if (viewMode === 'grid') {
      renderGrid(filtered);
    } else {
      renderList(filtered);
    }
  }

  function renderGrid(filtered) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = document.createElement('div');
    grid.className = 'cal-grid';

    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((d) => {
      const h = document.createElement('div');
      h.className = 'cal-day-header';
      h.textContent = d;
      grid.appendChild(h);
    });

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = filtered.filter((e) => e.date === dateStr);

      const cell = document.createElement('div');
      cell.className = `cal-day ${dayEvents.length ? 'has-events' : ''}`;

      const num = document.createElement('span');
      num.className = 'cal-day-num';
      num.textContent = day;
      cell.appendChild(num);

      dayEvents.forEach((e) => {
        const dot = document.createElement('div');
        dot.className = 'cal-event-dot';
        dot.style.background = categories[e.category]?.color || '#c9a84c';
        dot.title = e.title;
        dot.textContent = e.title.length > 12 ? e.title.slice(0, 12) + '...' : e.title;
        dot.addEventListener('click', () => showEventDetail(e));
        cell.appendChild(dot);
      });

      grid.appendChild(cell);
    }

    container.appendChild(grid);
  }

  function renderList(filtered) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthEvents = filtered
      .filter((e) => {
        const d = new Date(e.date + 'T12:00:00');
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    const list = document.createElement('div');
    list.className = 'cal-list';

    if (!monthEvents.length) {
      const empty = document.createElement('p');
      empty.className = 'cal-empty';
      empty.textContent = 'No events this month.';
      list.appendChild(empty);
    }

    monthEvents.forEach((e) => {
      const row = document.createElement('div');
      row.className = 'cal-list-item';
      row.addEventListener('click', () => showEventDetail(e));

      const dateDiv = document.createElement('div');
      dateDiv.className = 'cal-list-date';
      const d = new Date(e.date + 'T12:00:00');
      dateDiv.textContent = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const cat = document.createElement('span');
      cat.className = 'cal-list-cat';
      cat.style.background = categories[e.category]?.color || '#c9a84c';
      cat.textContent = e.category;

      const title = document.createElement('span');
      title.className = 'cal-list-title';
      title.textContent = e.title;

      row.appendChild(dateDiv);
      row.appendChild(cat);
      row.appendChild(title);
      list.appendChild(row);
    });

    container.appendChild(list);
  }

  function showEventDetail(e) {
    // Remove existing detail
    const existing = document.querySelector('.cal-detail');
    if (existing) existing.remove();

    const detail = document.createElement('div');
    detail.className = 'cal-detail';

    const close = document.createElement('button');
    close.className = 'cal-detail-close';
    close.textContent = '\u00D7';
    close.addEventListener('click', () => detail.remove());

    const title = document.createElement('h3');
    title.textContent = e.title;

    const date = document.createElement('p');
    const d = new Date(e.date + 'T12:00:00');
    date.textContent = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    date.className = 'cal-detail-date';

    const desc = document.createElement('p');
    desc.textContent = e.description;

    const loc = document.createElement('p');
    loc.className = 'cal-detail-loc';
    loc.textContent = e.location || 'Otter Valley Rod & Gun Club';

    // Google Calendar link
    const gcalStart = e.date.replace(/-/g, '') + 'T090000';
    const gcalEnd = (e.endDate || e.date).replace(/-/g, '') + 'T170000';
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${gcalStart}/${gcalEnd}&details=${encodeURIComponent(e.description)}&location=${encodeURIComponent(e.location || 'Otter Valley Rod & Gun Club, 9908 Plank Road, Straffordville, ON')}`;

    const gcalLink = document.createElement('a');
    gcalLink.href = gcalUrl;
    gcalLink.target = '_blank';
    gcalLink.rel = 'noopener noreferrer';
    gcalLink.className = 'cal-gcal-btn';
    gcalLink.textContent = 'Add to Google Calendar';

    detail.appendChild(close);
    detail.appendChild(title);
    detail.appendChild(date);
    detail.appendChild(desc);
    detail.appendChild(loc);
    detail.appendChild(gcalLink);

    container.appendChild(detail);
  }
});
