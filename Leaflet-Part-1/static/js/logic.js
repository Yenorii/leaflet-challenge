// My selected earthquake dataset
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// Fetching the URL
fetch(url)
    .then(response => response.json())

    // Plotting the data on the map
    .then(data => {
        const myMap = L.map('map').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(myMap);

        // Map options
        data.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;
            const magnitude = feature.properties.mag;
            const depth = coordinates[2];

            const markerOptions = {
                radius: Math.max(magnitude * 2, 5),
                fillColor: getColor(depth),
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            // Marker options
            L.circleMarker([coordinates[1], coordinates[0]], markerOptions)
                .addTo(myMap)
                .bindPopup(`<b>Magnitude:</b> ${magnitude}<br><b>Depth:</b> ${depth}`);
        });

        // Color options
        function getColor(depth) {
            if (depth < 50) {
                return 'green';
            } else if (depth < 100) {
                return 'yellow';
            } else {
                return 'red';
            }
        }
    })
    
  // Catch any errors
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
});