
import { showRetailerPanel } from "./retailer-panel.js";

// Create the map
const map = new maplibregl.Map({
    container: "map",

    // OpenFreeMap base map
    style: "https://tiles.openfreemap.org/styles/liberty",

    // Starting position: [longitude, latitude]
    center: [-74.361819, 40.541954], // Where Skelly would be

    // Starting zoom level
    zoom: 17
});

// Wait for the map to load
map.on("load", async () => {
    const layersToRemove = [
    'poi_r1', // Highest-priority regional/major POIs; appears earliest at lower zoom levels
    'poi_r7', // Mid-tier/standard POIs
    'poi_r20', // Lower-priority local POIs; requires zooming in closer to appear
    'poi_transit' // Other bus stops
    ];

    layersToRemove.forEach((layerId) => {
        if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
        }
    });

    // Load our retailer data
    const response = await fetch("data/retailers.geojson");
    const retailers = await response.json();


    // Add retailer data to the map
    map.addSource("retailers", {
        type: "geojson",
        data: retailers
    });


    // Draw retailer locations
    map.addLayer({
        id: 'retailers',
        type: 'symbol',
        source: 'retailers',
        layout: {
            'text-anchor': 'top',
            'text-field': ['get', 'name'],
            'text-font': ["Roboto Condensed Italic"],
            'text-max-width': 9,
            'text-offset': [0, 0.6],
            'text-size': 12,
            'icon-image': ['get', 'my-icon'],
            'icon-size': 1,
            'icon-allow-overlap': true
        },
        "paint": {
            "text-color": "#666",
            "text-halo-blur": 0.5,
            "text-halo-color": "#ffffff",
            "text-halo-width": 1
        }
    });


    // Change cursor when hovering over a retailer
    map.on("mouseenter", "retailers", () => {
        map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "retailers", () => {
        map.getCanvas().style.cursor = "";
    });


    // Show retailer information when clicked
    map.on("click", "retailers", (event) => {
        const properties = event.features[0].properties;

        showRetailerPanel(properties);
    });

});
