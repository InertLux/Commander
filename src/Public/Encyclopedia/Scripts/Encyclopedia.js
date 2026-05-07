import { MessageTypes, AppState } from './model.js';

const entriesFrame = document.getElementById('entriesFrame').contentWindow;
const pageFrame = document.getElementById('pageFrame').contentWindow;
const relatedFrame = document.getElementById('relatedFrame').contentWindow;
const searchInput = document.getElementById('globalSearch');

// --- Search forwarding ---
searchInput.addEventListener('input', () => {
  AppState.currentSearch = searchInput.value;
  entriesFrame.postMessage({ type: MessageTypes.SEARCH, q: AppState.currentSearch }, '*');
});

// --- Message routing ---
window.addEventListener('message', (ev) => {
  const m = ev.data || {};

  switch (m.type) {

    case MessageTypes.NAVIGATE:
      console.log("NAVIGATE", m.id)
      AppState.currentId = m.id;
      pageFrame.postMessage({ type: MessageTypes.SHOW, id: m.id }, '*');
      relatedFrame.postMessage({ type: MessageTypes.SHOW, id: m.id }, '*');
      entriesFrame.postMessage({ type: MessageTypes.SELECT, id: m.id }, '*');
      break;

    case MessageTypes.REQUEST_SEARCH_VALUE:
      console.log("REQUEST_SEARCH_VALUE", m.id)
      entriesFrame.postMessage({ type: MessageTypes.SEARCH, q: AppState.currentSearch }, '*');
      break;

    case MessageTypes.CENTER_READY:
      console.log("CENTER_READY", m.id)
      if (m.id) {
        relatedFrame.postMessage({ type: MessageTypes.SHOW, id: m.id }, '*');
      }
      break;

    case MessageTypes.ANCHOR_CLICK:
      console.log("ANCHOR_CLICK", m.id)
      window.postMessage({ type: MessageTypes.NAVIGATE, id: m.id }, '*');
      break;
  }
});

// --- Initial ping ---
function pingFrames() {
  entriesFrame.postMessage({ type: MessageTypes.PING }, '*');
  pageFrame.postMessage({ type: MessageTypes.PING }, '*');
  relatedFrame.postMessage({ type: MessageTypes.PING }, '*');
}

window.addEventListener('load', pingFrames);
