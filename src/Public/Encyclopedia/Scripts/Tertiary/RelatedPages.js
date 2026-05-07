const store = {
  einstein: 'Albert Einstein',
  relativity: 'Relativity',
  quantum: 'Quantum mechanics',
  photoelectric: 'Photoelectric effect',
  'general-relativity': 'General Relativity'
};

const listEl = document.getElementById('list');

function renderRelatedFromHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html || '';

  const anchors = Array.from(tmp.querySelectorAll('a[href]'));
  const seen = new Set();
  const related = [];

  anchors.forEach(a => {
    let href = a.getAttribute('href');
    if (!href) return;

    if (href.startsWith('#')) href = href.slice(1);
    href = href.replace(/\.html$/, '').split('#')[0];

    if (store[href] && !seen.has(href)) {
      seen.add(href);
      related.push({ id: href, title: store[href] });
    }
  });

  listEl.innerHTML = '';

  if (related.length === 0) {
    listEl.innerHTML = '<li>No related links</li>';
    return;
  }

  related.forEach(r => {
    const li = document.createElement('li');
    const a = document.createElement('a');

    a.href = '#' + r.id;
    a.textContent = r.title;

    a.addEventListener('click', ev => {
      ev.preventDefault();
      parent.postMessage({ type: 'navigate', id: r.id }, '*');
    });

    li.appendChild(a);
    listEl.appendChild(li);
  });
}

window.addEventListener('message', ev => {
  const m = ev.data || {};

  if (m.type === 'show') {
    parent.postMessage({ type: 'request-center-html', id: m.id }, '*');
  } else if (m.type === 'center-html') {
    renderRelatedFromHtml(m.html);
  }
});
