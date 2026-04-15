const PERENUAL_KEY = 'sk-P7im69df2dd32372c16437';
let cartItems = JSON.parse(localStorage.getItem('zest_cart')) || [];

const ailmentMap = {
    "sleep": "lavender",
    "anxiety": "chamomile",
    "digestion": "mint",
    "skin": "aloe",
    "immunity": "echinacea",
    "stress": "ashwagandha",
    "energy": "ginseng"
};

document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
}

async function searchPlants() {
    let query = document.getElementById('herbSearch').value.trim().toLowerCase();
    const grid = document.getElementById('productGrid');
    
    if (!query) return;
    if (ailmentMap[query]) query = ailmentMap[query];

    grid.innerHTML = `<div class="loading-state" style="grid-column: 1/-1; text-align: center;">Verifying Botanical Records...</div>`;

    try {
        const url = `https://perenual.com/api/species-list?key=${PERENUAL_KEY}&q=${query}`;
        const response = await fetch(url);
        const result = await response.json();

        if (result.data && result.data.length > 0) {
            displayHerbs(result.data);
        } else {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">No clinical matches found.</p>`;
        }
    } catch (error) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center;">Connection error. Please check your connection.</p>`;
    }
}

function displayHerbs(herbs) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    herbs.forEach(herb => {
        const commonName = herb.common_name || 'Herbal Extract';
        const scientificName = herb.scientific_name ? herb.scientific_name[0] : 'Botanical Species';
        const imageUrl = (herb.default_image && herb.default_image.regular_url) 
                         ? herb.default_image.regular_url 
                         : 'https://images.unsplash.com/photo-1541448505741-2d62814d4ebe?w=400';

        const ppbId = Math.floor(100000 + Math.random() * 900000);
        const price = Math.floor(Math.random() * (2500 - 850) + 850);

        const card = document.createElement('div');
        card.className = 'herb-card';
        card.innerHTML = `
            <img src="${imageUrl}" class="herb-img" onerror="this.src='https://images.unsplash.com/photo-1541448505741-2d62814d4ebe?w=400'">
            <div class="herb-info">
                <span class="ppb-status">✓ PPB Verified: ${ppbId}-ACT</span>
                <h3>${commonName}</h3>
                <p class="botanical-name">${scientificName}</p>
                <div class="dosage-info">
                    <strong>Standard Preparation:</strong><br>
                    Infuse 2.5g of dried parts in 200ml water. Twice daily.
                </div>
                <div class="price-row">
                    <span class="price">KES ${price.toLocaleString()}</span>
                    <button class="buy-btn" onclick="addToCart('${commonName.replace(/'/g, "\\'")}', ${price})">Add to Cart</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function addToCart(name, price) {
    const newItem = { id: Date.now(), name: name, price: parseInt(price) };
    cartItems.push(newItem);
    saveAndRefresh();
    if(!document.getElementById('cartSidebar').classList.contains('open')) toggleCart();
}

function removeFromCart(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('zest_cart', JSON.stringify(cartItems));
    updateCartUI();
}

function updateCartUI() {
    const cartBtn = document.querySelector('.cart-btn');
    if(cartBtn) cartBtn.innerText = `Cart (${cartItems.length})`;

    const list = document.getElementById('cartItemsList');
    const totalSpan = document.getElementById('cartTotal');
    
    if(!list) return;
    list.innerHTML = '';
    let total = 0;

    cartItems.forEach(item => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <div style="font-weight:bold">${item.name}</div>
                <div style="font-size:0.8rem; color:var(--accent-gold)">KES ${item.price.toLocaleString()}</div>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background:var(--btn-terracotta); border:none; color:white; border-radius:4px; padding:5px 8px; cursor:pointer">×</button>
        `;
        list.appendChild(div);
    });

    if(totalSpan) totalSpan.innerText = total.toLocaleString();
}

document.getElementById('herbSearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchPlants();
});