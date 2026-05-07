
const updatedEl = document.getElementById('updated');
const editorEl = document.getElementById('editor');
const pageNameEl = document.getElementById('page-name');

window.MessageTypes = {
  CENTER_READY: "CENTER_READY",
  SHOW: "show",
  SAVE: "save",
  PING: "ping"
};

let text = ""
let currentId = null;


const editor = new EasyMDE({
  element: editorEl,
  spellChecker: false,
  toolbar: false,
  status: false,
  minHeight: "100%",
  maxHeight: "100%",
  autoDownloadFontAwesome: false
});
  let saveTimer = null;

  editor.codemirror.on("change", function() {
    clearTimeout(saveTimer);

    // debounce so it doesn't save every keystroke
    saveTimer = setTimeout(() => {
      text = editor.value();
      saveCurrent();
    }, 500);
  });

/* Save text to server */
async function SaveEncyclopediaEntryText(id, text) {
  const res = await fetch(`/encyclopedia/${id}/text`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  if (!res.ok) throw new Error("Failed to save");
  return res.json();
}

/* Load full entry from server */
async function getEncyclopediaEntry(id) {
  const res = await fetch(`/encyclopedia/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) throw new Error(`Failed to load entry ${id}`);
  return await res.json();   // full entry object
}

/* Show page (editor IS the text) */
async function show(id) {
  console.log("Showing page: ", id)
  currentId = null;

  // Load full entry object
  const entry = await getEncyclopediaEntry(id);

  // Obsidian-style title
  pageNameEl.textContent = entry.name || "(Untitled)";
  // Editor text
  editor.value(entry.text || "");
  text = text;
  currentId = id;
  // Timestamp
  updatedEl.textContent = entry.updated || new Date().toLocaleString();

  parent.postMessage({ type: MessageTypes.CENTER_READY, id }, '*');
}

/* Save */
async function saveCurrent() {
  if (!currentId) return;

  text = editor.value();
  await SaveEncyclopediaEntryText(currentId, text);

  // Update local cache
  contents[currentId].text = text;

  // Refresh UI
  show(currentId);
}
function lower(str) {
  return (str || "").toLowerCase();
}

/* Message handling */
window.addEventListener('message', (ev) => {
  const m = ev.data || {};

  console.log("Event: ", m.type, " : ", m.id)
  let type = lower(m.type);

  switch (type) {
    case 'show':
      saveCurrent();
      show(m.id);
      break;

    case 'save':
      saveCurrent();
      break;

    case 'ping':
      parent.postMessage({ type: 'CENTER_READY', id: currentId }, '*');
      break;
  }
});

show(1);