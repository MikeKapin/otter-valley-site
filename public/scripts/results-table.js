document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.results-wrapper').forEach((wrapper) => {
    const file = wrapper.dataset.file;
    if (!file) return;

    fetch(file)
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data) || !data.length) {
          wrapper.textContent = 'No results available.';
          return;
        }

        let sortCol = null;
        let sortDir = 'asc';

        const columns = Object.keys(data[0]);

        function renderTable(rows) {
          wrapper.textContent = '';

          const table = document.createElement('table');
          const thead = document.createElement('thead');
          const headerRow = document.createElement('tr');

          columns.forEach((col) => {
            const th = document.createElement('th');
            th.textContent = col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1');

            const indicator = document.createElement('span');
            indicator.className = 'sort-indicator';
            if (sortCol === col) {
              indicator.className += ' active';
              indicator.textContent = sortDir === 'asc' ? ' \u25B2' : ' \u25BC';
            } else {
              indicator.textContent = ' \u25B2';
            }
            th.appendChild(indicator);

            th.addEventListener('click', () => {
              if (sortCol === col) {
                sortDir = sortDir === 'asc' ? 'desc' : 'asc';
              } else {
                sortCol = col;
                sortDir = 'asc';
              }
              const sorted = [...data].sort((a, b) => {
                const va = a[col];
                const vb = b[col];
                const numA = Number(va);
                const numB = Number(vb);
                if (!isNaN(numA) && !isNaN(numB)) {
                  return sortDir === 'asc' ? numA - numB : numB - numA;
                }
                return sortDir === 'asc'
                  ? String(va).localeCompare(String(vb))
                  : String(vb).localeCompare(String(va));
              });
              renderTable(sorted);
            });

            headerRow.appendChild(th);
          });

          thead.appendChild(headerRow);
          table.appendChild(thead);

          const tbody = document.createElement('tbody');
          rows.forEach((row) => {
            const tr = document.createElement('tr');
            columns.forEach((col) => {
              const td = document.createElement('td');
              td.textContent = row[col] != null ? String(row[col]) : '';
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });

          table.appendChild(tbody);
          wrapper.appendChild(table);
        }

        renderTable(data);
      })
      .catch(() => {
        wrapper.textContent = 'Unable to load results.';
      });
  });
});
