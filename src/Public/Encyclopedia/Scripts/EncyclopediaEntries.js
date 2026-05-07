
/* Store loaded from API */
let store = [];
let visible = [];
let selectedId = null;

const listEl = document.getElementById('list');
const countEl = document.getElementById('count');
const addEntryBtn = document.getElementById('addEntryBtn');


 async function addEncyclopediaEntry (EntryName, description, tags, text)
{
    const res = await fetch("/encyclopedia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        name: EntryName,
        description: description,
        tags: tags,
        text: text
        })
    });
      const json = await res.json();
      return json.id;
}


/* Load entries from API */
async function loadEntries() {
  try {
    const res = await fetch("/encyclopedia");
    const data = await res.json();

    // Map DB fields → UI fields
    store = data.map(e => ({
      id: String(e.id),
      title: e.name,
      desc: e.description,
      updated: e.updated || ""
    }));

    visible = [...store];
    selectedId = visible[0]?.id;

    render();

    if (selectedId) {
      parent.postMessage({ type: 'navigate', id: selectedId }, '*');
    }
  } catch (err) {
    console.error("Failed to load encyclopedia entries:", err);
  }
}

/* POST new entry */
async function addNewEntry(entry) {
  console.log("hellos we runnins");
  try {
    const res = await fetch("/encyclopedia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });

    const result = await res.json();
    return result.id;
  } catch (err) {
    console.error("Failed to add encyclopedia entry:", err);
  }
}

/* Render list */
function render() {
  console.log("Hello from encyclopedia entries menu!")
  listEl.innerHTML = '';
  visible.forEach(e => {
    const div = document.createElement('div');
    div.className = 'item' + (e.id === selectedId ? ' active' : '');
    div.tabIndex = 0;
    div.dataset.id = e.id;
    div.innerHTML = `
      <div>
        <strong>${escape(e.title)}</strong>
        <div class="meta">${escape(e.desc)}</div>
      </div>
      <div class="meta">${e.updated || ''}</div>
    `;
    div.addEventListener('click', () => navigate(e.id));
    div.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') navigate(e.id); });
    listEl.appendChild(div);
  });

  countEl.textContent = visible.length ? `${visible.length}` : '';
}

/* Navigation */
function navigate(id) {
  selectedId = id;
  render();
  parent.postMessage({ type: 'navigate', id }, '*');
}

/* Search filter */
function filter(q) {
  const n = (q || '').trim().toLowerCase();
  visible = n
    ? store.filter(s => s.title.toLowerCase().includes(n) || s.desc.toLowerCase().includes(n))
    : [...store];

  if (!visible.find(v => v.id === selectedId)) {
    selectedId = visible[0]?.id;
  }

  render();
}

/* Scroll to selected */
function scrollToSelected() {
  const el = listEl.querySelector('.item.active');
  if (el) el.scrollIntoView({ block: 'nearest' });
}

/* Escape HTML */
function escape(s) {
  return (s || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

/* Handle messages from parent */
window.addEventListener('message', async (ev) => {
  const m = ev.data || {};

  if (m.type === 'search') {
    filter(m.q || '');

  } else if (m.type === 'select') {
    selectedId = m.id;
    render();
    scrollToSelected();

  } else if (m.type === 'ping') {
    parent.postMessage({ type: 'request-search-value' }, '*');

  } else if (m.type === 'entry-added') {
      console.log("add new button clicked")
    await loadEntries();
    selectedId = String(newId);
    render();
    scrollToSelected();
  }
});



/* Add Entry button */
addEntryBtn.addEventListener("click", async () => {
  console.log("Hello and happy nightmare!")
      console.log("add new button clicked")

    NewId = await addEncyclopediaEntry("Untitled Entry", "", "", "");
    await loadEntries();
    selectedId = String(newId);
    render();
    scrollToSelected();
});

/* Init */
loadEntries();
