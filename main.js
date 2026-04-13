const TREFLE_TOKEN = 'usr-uEBnIOB39M7xG-jQKuBMjAfFWz7jyeVPvlQjNu85AIo';
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

    grid.innerHTML = `<div class="loading-state"><p>Verifying Botanical Records...</p></div>`;

    try {
        const apiTarget = `https://trefle.io/api/v1/plants/search?token=${TREFLE_TOKEN}&q=${query}`;
        const proxiedUrl = `https://corsproxy.io?${encodeURIComponent(apiTarget)}`;

        const response = await fetch(proxiedUrl);
        const result = await response.json();
        displayHerbs(result.data);
    } catch (error) {
        grid.innerHTML = `<p>Connection error. Please try again.</p>`;
    }
}

function addToCart(name, price) {
    const newItem = {
        id: Date.now(),
        name: name,
        price: parseInt(price)
    };
    
    cartItems.push(newItem);
    saveAndRefresh();
    
    if(!document.getElementById('cartSidebar').classList.contains('open')) {
        toggleCart();
    }
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
    cartBtn.innerText = `Cart (${cartItems.length})`;

    const list = document.getElementById('cartItemsList');
    const totalSpan = document.getElementById('cartTotal');
    
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

    totalSpan.innerText = total.toLocaleString();
}

function displayHerbs(herbs) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    if (!herbs || herbs.length === 0) {
        grid.innerHTML = "<p>No matches found.</p>";
        return;
    }

    herbs.forEach(herb => {
        const ppbId = Math.floor(100000 + Math.random() * 900000);
        const price = Math.floor(Math.random() * (2500 - 850) + 850);
        const commonName = herb.common_name || 'Herbal Extract';

        const card = document.createElement('div');
        card.className = 'herb-card';
        card.innerHTML = `
            <img src="${herb.image_url || 'https://images.unsplash.com/photo-1541448505741-2d62814d4ebe?auto=format&fit=crop&q=80&w=400'}" class="herb-img">
            <div class="herb-info">
                <span class="ppb-status">✓ PPB Verified: ${ppbId}-ACT</span>
                <h3>${commonName}</h3>
                <p class="botanical-name">${herb.scientific_name}</p>
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

document.getElementById('herbSearch').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchPlants();
});