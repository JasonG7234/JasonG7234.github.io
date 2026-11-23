export function showRetailerPanel(properties, coordinates) {
    const panelContent = document.getElementById("panel-content");

    // MapLibre serializes nested GeoJSON properties, so `products` arrives as a
    // JSON string instead of an array. Normalize it so .map()/.length are always safe.
    let products = properties.products;
    if (typeof products === "string") {
        try {
            products = JSON.parse(products);
        } catch {
            products = [];
        }
    }
    if (!Array.isArray(products)) {
        products = [];
    }

    // coordinates arrive as [longitude, latitude]
    const [lng, lat] = coordinates || [];
    const directionsUrl =
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}`;

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
            <a class="action-btn" href="${directionsUrl}" target="_blank" rel="noopener">Directions</a>
            <a class="action-btn" href="tel:${properties.phone}">Call</a>
            <a class="action-btn" href="${properties.website}" target="_blank" rel="noopener">Website</a>
            ${properties.instagram ? `<a class="action-btn" href="${properties.instagram}" target="_blank" rel="noopener">Instagram</a>` : ""}
        </div>

        <section class="section">
            <h2>About</h2>
            <p class="description">
                ${properties.description}
            </p>
        </section>

        ${(products.length ? `
        <section class="section">
            <div class="section-header">
                <h2>Products</h2>
            </div>
            <div class="items">
                ${products.map(product => `
                    ${product.url ? `<a class="item" href="${product.url}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">` : `<div class="item">`}
                        ${product.image ? `<img src="${product.image}" alt="${product.name}">` : ""}
                        <div class="item-info">
                            <strong>${product.name || ""}</strong>
                            ${product.description ? `<i>${product.description}</i>` : ""}
                            ${product.price ? `<span>${product.price}</span>` : ""}
                        </div>
                    ${product.url ? `</a>` : `</div>`}
                `).join("")}
            </div>
        </section>
        ` : "")}

        <footer class="panel-links">
            <p>Interested in other events around Metuchen? Check our <a href="https://www.downtownmetuchen.org/calendar/" target="_blank" rel="noopener">Events</a>.</p>
            <p>Want to see the full breakdown of all of Metuchen's holiday shopping items? Check out the <a href="https://www.downtownmetuchen.org/gift-guide-2026/" target="_blank" rel="noopener">Holiday Gift Guide</a>.</p>
            <p>Want to directly support Metuchen businesses? Consider getting a <a href="https://www.downtownmetuchen.org/giftcard" target="_blank" rel="noopener">Downtown Metuchen gift card</a>.</p>
        </footer>
    `;
    
    // Show the panel
    document.getElementById("side-panel").classList.add("open");
}

// Close button wiring (runs once when the module loads)
document.getElementById("close-btn").addEventListener("click", () => {
    document.getElementById("side-panel").classList.remove("open");
});