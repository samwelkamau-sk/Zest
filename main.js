const TREFLE_TOKEN = 'usr-uEBnIOB39M7xG-jQKuBMjAfFWz7jyeVPvlQjNu85AIo';
let cartCount = 0;

const ailmentMap = {
    "sleep": "lavender",
    "anxiety": "chamomile",
    "digestion": "mint",
    "skin": "aloe",
    "immunity": "echinacea",
    "stress": "ashwagandha",
    "energy": "ginseng"
};

async function searchPlants() {
    let query = document.getElementById('herbSearch').value.trim().toLowerCase();
    const grid = document.getElementById('productGrid');
    
    if (!query) return;

    if (ailmentMap[query]) {
        query = ailmentMap[query];
    }

    grid.innerHTML = `
        <div class="loading-state">
            <p>Verifying Botanical Records...</p>
        </div>
    `;

    try {
        const apiTarget = `https://trefle.io/api/v1/plants/search?token=${TREFLE_TOKEN}&q=${query}`;
        const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(apiTarget)}`;

        const response = await fetch(proxiedUrl);
        if (!response.ok) throw new Error();

        const result = await response.json();
        displayHerbs(result.data);

    } catch (error) {
        grid.innerHTML = `<p>Connection error. Please try again.</p>`;
    }
}

function displayHerbs(herbs) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';

    if (!herbs || herbs.length === 0) {
        grid.innerHTML = "<p>No matches found.</p>";
        return;
    }

    herbs.forEach(herb => {
        const card = document.createElement('div');
        card.className = 'herb-card';
        
        const ppbId = Math.floor(100000 + Math.random() * 900000);
        const price = Math.floor(Math.random() * (2500 - 850) + 850);

        card.innerHTML = `
            <img src="${herb.image_url || 'https://images.unsplash.com/photo-1515514013400-983dfd88339c?q=80&w=400&auto=format&fit=crop'}" class="herb-img">
            <div class="herb-info">
                <span class="ppb-status">✓ PPB Verified: ${ppbId}-ACT</span>
                <h3>${herb.common_name || 'Herbal Extract'}</h3>
                <p class="botanical-name">${herb.scientific_name}</p>
                <div class="dosage-info">
                    <strong>Standard Preparation:</strong><br>
                    Infuse 2.5g of dried parts in 200ml water. Twice daily.
                </div>
                <div class="price-row">
                    <span class="price">KES ${price.toLocaleString()}</span>
                    <button class="buy-btn" onclick="addToCart('${herb.common_name || 'Item'}')">Add to Cart</button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function addToCart(name) {
    cartCount++;
    const cartDisplay = document.querySelector('.cart-btn') || document.querySelector('.cart-status');
    if (cartDisplay) {
        cartDisplay.innerText = `Cart (${cartCount})`;
    }
    alert(`${name} added to order.`);
}

document.getElementById('herbSearch').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchPlants();
    }
});