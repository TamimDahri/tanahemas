// Create map
var map = L.map("map").setView([3.05, 101.6], 11);

// Add base layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
}).addTo(map);

let currentLayer = null;

// Function: load GeoJSON
function loadGeoJson(filePath) {
    // Remove previous layer
    if (currentLayer) {
        map.removeLayer(currentLayer);
    }

    fetch(filePath)
        .then(response => response.json())
        .then(data => {
            currentLayer = L.geoJSON(data, {
                style: {
                    color: randomColor(),
                    weight: 2,
                    fillOpacity: 0.3
                },
                onEachFeature: function (feature, layer) {
                    let p = feature.properties;
                    layer.bindPopup(
                        `
                        <b>Negeri:</b> ${p.Negeri || "-"}<br>
                        <b>Daerah:</b> ${p.Daerah || "-"}<br>
                        <b>Mukim:</b> ${p.Mukim || "-"}<br>
                        <b>Nama Rezab:</b> ${p.Nama_Rezab || "-"}<br>
                        <b>No Warta:</b> ${p.No_Warta || "-"}
                        `
                    );
                }
            }).addTo(map);

            // Auto zoom to GeoJSON
            map.fitBounds(currentLayer.getBounds());
        })
        .catch(err => console.log("Error loading GeoJSON:", err));
}

// Random color function
function randomColor() {
    return "#" + Math.floor(Math.random()*16777215).toString(16);
}

// Load default file
loadGeoJson("petaling.json");

// Dropdown change event
document.getElementById("geoSelect").addEventListener("change", function() {
    loadGeoJson(this.value);
});
