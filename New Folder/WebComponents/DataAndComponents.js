
<script>
class TableRow extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  set data(itemData) {
    this._data = itemData;
    this.render();
  }

  get data() {
    return this._data;
  }

  render() {
    if (!this._data) return;

    const { icon = '■', name, weight, value } = this._data;

    this.shadowRoot.innerHTML = `
      <style>
        td { border: 1px solid rgba(168, 214, 94, 0.2); padding: 2px 4px; font-size: 9px; background: #2a2015; }
        .icon { color: #c4a747; font-weight: bold; width: 20px; text-align: center; }
        .name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .stat { color: #c4a747; text-align: right; width: 60px; }
      </style>
      <td class="icon">${icon}</td>
      <td class="name">${name}</td>
      <td class="stat">${weight}</td>
      <td class="stat">${value}</td>
    `;
  }
}
customElements.define('table-row', TableRow);


function populateTable(containerId, itemsArray, WebComponentName) {
  const tbody = document.querySelector(`#${containerId}`);
  tbody.innerHTML = '';
  
  itemsArray.forEach(item => {
    const row = document.createElement('tr');
    const component = document.createElement(WebComponentName);
    component.data = item;
    row.appendChild(component);
    tbody.appendChild(row);
  });
}


const tableItems = [
  {
    id: 'laser-rifle',
    name: 'Laser Rifle',
    weight: 8.5,
    value: 750,
    icon: '⚔'
  },
  {
    id: 'combat-suit',
    name: 'Combat Suit',
    weight: 12.0,
    value: 500,
    icon: '■'
  }
];

populateTable('table-body', tableItems, 'table-row');
</script>