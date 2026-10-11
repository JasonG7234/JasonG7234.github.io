// Temporary dummy product data (swap for real per-retailer data later).
// Only the first 3 are shown in the panel.
const dummyProducts = [
    {
        name: "Ceramic Vase",
        price: "$42",
        image: "https://picsum.photos/seed/vase/250/170"
    },
    {
        name: "Soy Candle",
        price: "$28",
        image: "https://picsum.photos/seed/candle/250/170"
    },
    {
        name: "Wool Throw",
        price: "$95",
        image: "https://picsum.photos/seed/throw/250/170"
    },
    {
        name: "Brass Bookends",
        price: "$38",
        image: "https://picsum.photos/seed/brass/250/170"
    }
];

export function showRetailerPanel(properties) {
    const panelContent = document.getElementById("panel-content");
    panelContent.innerHTML = `
        <div class="business-header">
            <img
                class="business-image"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.fkliving.com%2Fwp-content%2Fuploads%2F2023%2F10%2F2-CO3A1908-1024x683.jpg&f=1&nofb=1&ipt=d2836bc41e6550c2fad772b4765a8fa93d5b089098e4a9f3fabf3cce49d20b8c&ipo=images"
                alt="${properties.name}"
            >

            <div class="business-info">
                <h1>${properties.name}</h1>

                <div class="rating">
                    ★ ${properties.name}
                </div>

                <p class="tags">
                    Tags: ${properties.tags || ""}
                </p>
            </div>
        </div>

        <div class="actions">
            <button>Directions</button>
            <button>Call</button>
            <button>Website</button>
        </div>

        <section class="section">
            <h2>About</h2>
            <p class="description">
                ${properties.description}
            </p>
        </section>

        <section class="section">
            <div class="section-header">
                <h2>Products</h2>
                <button class="see-all">See all</button>
            </div>
            <div class="items">
                ${dummyProducts.slice(0, 3).map(product => `
                    <div class="item">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="item-info">
                            <strong>${product.name}</strong>
                            <span>${product.price}</span>
                        </div>
                    </div>
                `).join("")}
            </div>
        </section>
    `;
    
    // Show the panel
    document.getElementById("side-panel").classList.add("open");
}

// Close button wiring (runs once when the module loads)
document.getElementById("close-btn").addEventListener("click", () => {
    document.getElementById("side-panel").classList.remove("open");
});