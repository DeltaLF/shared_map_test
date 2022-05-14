var map = L.map("map", {
  // center: center,
  zoom: 17, // 0 - 18
  attributionControl: true, // leaflet attribution
  zoomControl: true, // - + button
}).setView([51.505, -0.09], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStretMap</a> contributors',
}).addTo(map);

// utils
function loc2str(loc) {
  return parseFloat(loc).toFixed(2);
}

// customized layer:
const customizedLayer = L.layerGroup([]).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(customizedLayer);

function onMapClick(e) {
  console.log(e, e.latlng);
  const { lat, lng } = e.latlng;
  L.popup()
    .setLatLng([lat, lng])
    .setContent(`Clicked position: [${loc2str(lat)}},${loc2str(lng)}]`)
    .openOn(map);
}

map.on("click", onMapClick);

function onMapRightClick(e) {
  // create new tag when right click
  const { lat, lng } = e.latlng;
  const input = prompt();
  var marker = L.marker([lat, lng]).addTo(customizedLayer);
  marker.bindPopup(input).openPopup();
}

map.on("contextmenu", onMapRightClick);

function updatePanel() {
  // clean up then append markers info to marker-list panel
  const markerListDiv = $(".marker-list");
  markerListDiv.children().remove();
  const markerInLayer = customizedLayer.getLayers();
  markerInLayer.forEach((marker) => {
    console.log(marker);
    const { lat, lng } = marker._latlng;
    const popContent = marker.getPopup()
      ? marker.getPopup()._content
      : "No popup";

    markerListDiv.append(
      `<p>lat:${loc2str(lat)} lng:${loc2str(lng)} content: ${popContent}</p>`
    );
  });
}

$(".button-clear").on("click", function (e) {
  console.log(e);
  customizedLayer.clearLayers();
});

$(".button-show").on("click", function (e) {
  // show layer in conosle
  const layers = customizedLayer.getLayers();
  console.log(layers);
});

$(".button-sync").on("click", function (e) {
  // sync marker data in panel
  // use onClick to update marker because there seems no onMarkerChange event
  updatePanel();
});
