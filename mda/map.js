
import { showRetailerPanel } from "./retailer-panel.js";

// --- Keep every retailer icon visible, no matter how much they overlap ---
//
// MapLibre's symbol placement normally *culls* (hides) symbols that
// collide with other symbols - see the layout flags on the `retailers`
// layer below. Even with those flags set, two retailers at *exactly*
// the same coordinates (e.g. Yestercades / Chamber43 Records in
// retailers.geojson) would be drawn perfectly on top of each other, so
// the lower one would be 100% hidden. This helper deterministically
// nudges near-coincident points apart (in memory only - the GeoJSON
// file is untouched) so each icon gets a visible sliver at the
// starting zoom. The original coordinates are stashed on each feature
// so the panel's "Directions" link still points at the real shop.
const MIN_ICON_SEPARATION_METERS = 18;

function spreadOverlappingFeatures(featureCollection, minSeparationMeters = MIN_ICON_SEPARATION_METERS) {
    const features = featureCollection?.features;
    if (!Array.isArray(features) || features.length < 2) return featureCollection;

    const points = features.map((feature) =>
        feature?.geometry?.type === "Point" && Array.isArray(feature.geometry.coordinates)
            ? [...feature.geometry.coordinates]
            : null
    );
    if (points.filter(Boolean).length < 2) return featureCollection;

    // Approximate local scale (Metuchen, NJ) to work in metres, not degrees.
    const pointLatitudes = points.filter(Boolean).map(([, lat]) => lat);
    const meanLat = pointLatitudes.reduce((sum, lat) => sum + lat, 0) / pointLatitudes.length;
    const metersPerDegreeLat = 111132.92;
    const metersPerDegreeLng = 111412.84 * Math.cos((meanLat * Math.PI) / 180);

    // Deterministic repulsion: repeat until no pair is closer than the
    // minimum, or we hit the iteration cap. Same input -> same output.
    for (let iteration = 0; iteration < 50; iteration++) {
        let moved = false;
        for (let i = 0; i < points.length; i++) {
            if (!points[i]) continue;
            for (let j = i + 1; j < points.length; j++) {
                if (!points[j]) continue;
                const dxMeters = (points[j][0] - points[i][0]) * metersPerDegreeLng;
                const dyMeters = (points[j][1] - points[i][1]) * metersPerDegreeLat;
                const distance = Math.hypot(dxMeters, dyMeters);
                if (distance >= minSeparationMeters) continue;

                moved = true;
                let unitX;
                let unitY;
                let pushMeters;
                if (distance < 1e-9) {
                    // Exactly coincident: pick a stable, pair-specific angle
                    // (golden-angle-ish) so the two split in opposite directions.
                    const angle = (((i * 137.508 + j * 78.233) % 360) * Math.PI) / 180;
                    unitX = Math.cos(angle);
                    unitY = Math.sin(angle);
                    pushMeters = minSeparationMeters / 2;
                } else {
                    unitX = dxMeters / distance;
                    unitY = dyMeters / distance;
                    pushMeters = (minSeparationMeters - distance) / 2;
                }

                points[i][0] -= (unitX * pushMeters) / metersPerDegreeLng;
                points[i][1] -= (unitY * pushMeters) / metersPerDegreeLat;
                points[j][0] += (unitX * pushMeters) / metersPerDegreeLng;
                points[j][1] += (unitY * pushMeters) / metersPerDegreeLat;
            }
        }
        if (!moved) break;
    }

    features.forEach((feature, index) => {
        if (!points[index]) return;
        feature.properties = feature.properties || {};
        // Remember where the shop really is for the Directions link.
        if (feature.properties._originalLng === undefined) {
            feature.properties._originalLng = feature.geometry.coordinates[0];
            feature.properties._originalLat = feature.geometry.coordinates[1];
        }
        feature.geometry.coordinates = points[index];
    });

    return featureCollection;
}

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

    // Nudge exactly/nearly stacked shops apart so no icon is drawn
    // perfectly on top of another (the GeoJSON file is not modified).
    spreadOverlappingFeatures(retailers);

    // Add retailer data to the map
    map.addSource("retailers", {
        type: "geojson",
        data: retailers
    });


    // Draw retailer locations
    //
    // Every icon AND label must be visible no matter how much they
    // overlap. MapLibre's default symbol placement hides/culls any
    // symbol that collides with another, so all of these flags are
    // required together:
    //   - `*-allow-overlap`: THIS layer's symbols may overlap each other
    //     (without the icon flag, overlapping icons would still be culled).
    //   - `*-ignore-placement`: ignore symbols from ALL layers (the
    //     basemap labels) during placement, so basemap labels can't
    //     push retailer icons/labels off screen.
    //   - `*-padding: 0`: no invisible collision box around a symbol
    //     (the default is 2px) that could otherwise exclude a neighbour.
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
            'icon-allow-overlap': true,
            'icon-ignore-placement': true,
            'icon-padding': 0,
            'text-allow-overlap': true,
            'text-ignore-placement': true,
            'text-padding': 0
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
        const feature = event.features[0];

        showRetailerPanel(feature.properties, feature.geometry.coordinates);
    });

});
