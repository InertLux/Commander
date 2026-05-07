// model.js

export const MessageTypes = {
  SEARCH: 'search',
  NAVIGATE: 'navigate',
  SELECT: 'select',
  SHOW: 'show',
  REQUEST_SEARCH_VALUE: 'request-search-value',
  CENTER_READY: 'center-ready',
  ANCHOR_CLICK: 'anchor-click',
  PING: 'ping'
};

export const AppState = {
  currentSearch: "",
  currentId: null
};
