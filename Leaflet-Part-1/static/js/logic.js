// My selected earthquake dataset
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

// My map
const myMap = L.map('map').setView([0, 0], 2);

// Using D3.js to change the marker color according to the depth
const colorScale = d3.scaleSequential()
    .domain([0, 100]) 
    .interpolator(t => d3.interpolateRdYlGn(1 - t));

function getColor(depth) {
    return colorScale(depth);
}

// Fetching the URL
fetch(url)
    .then(response => response.json())
    .then(data => {

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(myMap);

        // Map options, and popup details
        data.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;
            const magnitude = feature.properties.mag;
            const depth = coordinates[2];
            const place = feature.properties.place;
            const time = new Date(feature.properties.time);
            const url = feature.properties.url;

            const markerOptions = {
                radius: Math.max(magnitude * 2, 5),
                fillColor: getColor(depth),
                color: '#000',
                weight: .5,
                opacity: 3,
                fillOpacity: 0.4
            };

            // Marker options, setting coordinates and adding popupinfo
            const marker = L.circleMarker([coordinates[1], coordinates[0]], markerOptions)
                 .addTo(myMap)
                 .bindPopup(`<b>Location:</b> ${feature.properties.place}<br><b>Date & Time:</b> ${new Date(feature.properties.time)}<br><b>More Information:</b> <a href="${feature.properties.url}" target="_blank">USGS Event Page</a>`);
        })

    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

// Code for the legend
function addLegend() {
    const legend = L.control({ position: 'bottomleft' });
    legend.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'legend');
        const depths = [10, 20, 30, 40, 50, 60, 70, 80, 90];
        const labels = ['<strong>Depth(km)</strong>'];
        depths.forEach((depth, index) => {
            labels.push(
                `<div><span style="background: ${getColor(depth)}; width: 15px; height: 10px; display: inline-block;"></span> ${
                    depths[index]
                }${depths[index + 1] ? '&ndash;' + depths[index + 1] + '<br>' : '+'}</div>`
            );
        });
        div.innerHTML = labels.join('');
        div.style.backgroundColor = 'white'; 
        div.style.padding = '10px'; 
        div.style.border = '1px solid black'; 
        return div;
    };
    legend.addTo(myMap);
};
addLegend();