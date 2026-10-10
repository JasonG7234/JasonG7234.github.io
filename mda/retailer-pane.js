export function showRetailerPanel(properties) {
    const panelContent = document.getElementById("panel-content");
    panelContent.innerHTML = `
        <div class="business-header">
            <img
                class="business-image"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpub-ba1a74be17d7442a9f2541946eb9510e.r2.dev%2Fshops%2Ff5832fa2-89ee-4486-a06f-1796f8649c7d%2F2.jpg&f=1&nofb=1&ipt=f2f5cb1256163073183bee41f7ab8847c984ebe2c2a4170fdc3178420651ac5b&ipo=images"
                alt="${properties.name}"
            >

            <div class="business-info">
                <h1>${properties.name}</h1>

                <div class="rating">
                    ★ ${properties.name}
                </div>

                <p class="address">
                    ${properties.name}
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
                ${properties.name}
            </p>
        </section>
    `;
    
    // Show the panel
    document.getElementById("side-panel").classList.add("open");
}

// Close button wiring (runs once when the module loads)
document.getElementById("close-btn").addEventListener("click", () => {
    document.getElementById("side-panel").classList.remove("open");
});