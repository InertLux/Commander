class InventorySystem {
    constructor() {
        this.inventory = [
            { id: 1, name: "Daedric Sword", category: "Weapons", weight: 18.5, value: 850, quantity: 1, icon: "⚔" },
            { id: 2, name: "Daedric Shield", category: "Armor", weight: 16.0, value: 720, quantity: 1, icon: "🛡" },
            { id: 3, name: "Health Potion", category: "Consumables", weight: 0.5, value: 25, quantity: 12, icon: "💊" },
            { id: 4, name: "Magicka Potion", category: "Consumables", weight: 0.5, value: 25, quantity: 8, icon: "💚" },
            { id: 5, name: "Scroll of Fireball", category: "Consumables", weight: 1.0, value: 50, quantity: 3, icon: "⭐" },
            { id: 6, name: "Gold Coin", category: "Miscellaneous", weight: 0.01, value: 1, quantity: 450, icon: "💰" },
            { id: 7, name: "Ancient Tome", category: "Key Items", weight: 2.5, value: 200, quantity: 1, icon: "📜" },
            { id: 8, name: "Dwemer Key", category: "Key Items", weight: 0.1, value: 10, quantity: 1, icon: "🗝" },
            { id: 9, name: "Stamina Potion", category: "Consumables", weight: 0.5, value: 25, quantity: 5, icon: "🧴" },
            { id: 10, name: "Iron Dagger", category: "Weapons", weight: 5.0, value: 15, quantity: 2, icon: "🗡" },
            { id: 11, name: "Leather Armor", category: "Armor", weight: 12.0, value: 40, quantity: 1, icon: "👔" },
            { id: 12, name: "Restore Magicka Potion", category: "Consumables", weight: 0.5, value: 30, quantity: 6, icon: "🔵" },
        ];

        this.maxCarryWeight = 120;
        this.currentFilter = "All Items";
        this.currentSort = "name";
        this.favorites = new Set();
        this.equipped = new Set([1, 2]);
    }

    init() {
        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.textContent.trim();
                this.render();
            });
        });

        // Sort buttons
        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentSort = btn.textContent.toLowerCase().trim();
                this.render();
            });
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.id === 'addItemBtn') {
                    this.addItem("New Item", "Miscellaneous", 1.0, 100, 1, "🎁");
                    return;
                }
                document.querySelectorAll('.filter-btn:not(#addItemBtn)').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.render();
            });
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.render());
        }
    }

    getFilteredItems() {
        let filtered = [...this.inventory];

        // Category filter
        if (this.currentFilter !== "All Items") {
            filtered = filtered.filter(item => item.category === this.currentFilter);
        }

        // Search filter
        const searchInput = document.getElementById('searchInput');
        if (searchInput && searchInput.value.trim()) {
            const query = searchInput.value.toLowerCase();
            filtered = filtered.filter(item => item.name.toLowerCase().includes(query));
        }

        // Quick filters
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter && activeFilter.id !== 'addItemBtn') {
            const filterText = activeFilter.textContent.trim();
            if (filterText === "Favorites ⭐") {
                filtered = filtered.filter(item => this.favorites.has(item.id));
            } else if (filterText === "New Items") {
                filtered = filtered.filter(item => item.new);
            }
        }

        // Sort
        this.sortItems(filtered);
        return filtered;
    }

    sortItems(items) {
        if (this.currentSort === "name") {
            items.sort((a, b) => a.name.localeCompare(b.name));
        } else if (this.currentSort === "weight") {
            items.sort((a, b) => b.weight - a.weight);
        } else if (this.currentSort === "value") {
            items.sort((a, b) => b.value - a.value);
        }
    }

    calculateStats() {
        const totalWeight = this.inventory.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
        const totalItems = this.inventory.reduce((sum, item) => sum + item.quantity, 0);
        const totalValue = this.inventory.reduce((sum, item) => sum + (item.value * item.quantity), 0);
        const equippedCount = this.equipped.size;

        return {
            totalWeight: totalWeight.toFixed(1),
            totalItems,
            totalValue,
            equippedCount,
            weightPercent: Math.min((totalWeight / this.maxCarryWeight) * 100, 100)
        };
    }

    toggleFavorite(itemId) {
        if (this.favorites.has(itemId)) {
            this.favorites.delete(itemId);
        } else {
            this.favorites.add(itemId);
        }
        this.render();
    }

    toggleEquipped(itemId) {
        if (this.equipped.has(itemId)) {
            this.equipped.delete(itemId);
        } else {
            this.equipped.add(itemId);
        }
        this.render();
    }

    addItem(name, category, weight, value, quantity = 1, icon = "📦") {
        const newId = Math.max(...this.inventory.map(i => i.id), 0) + 1;
        this.inventory.push({
            id: newId,
            name,
            category,
            weight,
            value,
            quantity,
            icon,
            new: true
        });
        this.render();
    }

    removeItem(itemId) {
        this.inventory = this.inventory.filter(item => item.id !== itemId);
        this.favorites.delete(itemId);
        this.equipped.delete(itemId);
        this.render();
    }

    updateQuantity(itemId, newQuantity) {
        const item = this.inventory.find(i => i.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = newQuantity;
                this.render();
            }
        }
    }

    render() {
        const stats = this.calculateStats();
        const filtered = this.getFilteredItems();

        // Update stats
        document.getElementById('carryWeight').textContent = `${stats.totalWeight} / ${this.maxCarryWeight} lbs`;
        document.getElementById('totalItems').textContent = stats.totalItems;
        document.getElementById('totalValue').textContent = stats.totalValue.toLocaleString();
        document.getElementById('equippedCount').textContent = stats.equippedCount;

        // Update weight bar color
        const weightBar = document.querySelector('.weight-bar-fill');
        if (weightBar) {
            weightBar.style.width = stats.weightPercent + '%';
            if (stats.weightPercent > 100) {
                weightBar.style.background = 'linear-gradient(90deg, #ff4400, #ff6600)';
            } else if (stats.weightPercent > 75) {
                weightBar.style.background = 'linear-gradient(90deg, #ffaa00, #ffcc00)';
            } else {
                weightBar.style.background = 'linear-gradient(90deg, #00ff41, #00cc33)';
            }
        }

        // Render items
        const inventoryList = document.querySelector('.inventory-list');
        inventoryList.innerHTML = '';

        if (filtered.length === 0) {
            inventoryList.innerHTML = '<div class="empty-state">No items found</div>';
            return;
        }

        filtered.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'inventory-item';
            if (this.equipped.has(item.id)) itemEl.classList.add('equipped');

            itemEl.innerHTML = `
                <div class="item-name">
                    <div class="item-icon">${item.icon}</div>
                    <span>${item.name}</span>
                </div>
                <div class="item-weight">${(item.weight * item.quantity).toFixed(1)} lbs</div>
                <div class="item-quantity">
                    <input type="number" class="qty-input" value="${item.quantity}" min="1" data-item-id="${item.id}">
                </div>
                <div class="item-actions">
                    <button class="action-btn fav-btn ${this.favorites.has(item.id) ? 'active' : ''}" data-item-id="${item.id}" title="Favorite">⭐</button>
                    <button class="action-btn equip-btn ${this.equipped.has(item.id) ? 'active' : ''}" data-item-id="${item.id}" title="Equip">${this.equipped.has(item.id) ? '✓' : '◯'}</button>
                    <button class="action-btn remove-btn" data-item-id="${item.id}" title="Remove">✕</button>
                </div>
            `;

            // Quantity change
            const qtyInput = itemEl.querySelector('.qty-input');
            qtyInput.addEventListener('change', () => {
                this.updateQuantity(item.id, parseInt(qtyInput.value));
            });

            // Favorite button
            itemEl.querySelector('.fav-btn').addEventListener('click', () => {
                this.toggleFavorite(item.id);
            });

            // Equip button
            itemEl.querySelector('.equip-btn').addEventListener('click', () => {
                this.toggleEquipped(item.id);
            });

            // Remove button
            itemEl.querySelector('.remove-btn').addEventListener('click', () => {
                this.removeItem(item.id);
            });

            inventoryList.appendChild(itemEl);
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    window.inventory = new InventorySystem();
    window.inventory.init();
});
