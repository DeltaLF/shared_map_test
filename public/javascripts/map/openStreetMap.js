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

function layerParser(layer) {
  // layer is array of markers
  return layer.map((marker) => {
    const obj = {};
    console.log(marker);
    obj.latlng = marker._latlng;
    obj.popup = marker.getPopup() ? marker.getPopup()._content : null;
    return obj;
  });
}

// customized layer:
const customizedLayer = L.layerGroup([]).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(customizedLayer);

function iconMarker(colorIndex = 0) {
  const colors = ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"];

  const markerHtmlStyles = `
  background-color: ${colors[colorIndex]};
  width: 2rem;
  height: 2rem;
  display: block;
  left: -1.5rem;
  top: -1.5rem;
  position: relative;
  border-radius: 5rem 5rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

  const icon = L.divIcon({
    className: "my-custom-pin",
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`,
  });
  return icon;
}

function createMarkerWithPopup(lat, lng, content) {
  const randomColor = Math.floor(Math.random() * 5);
  const customizedIcon = iconMarker(randomColor);
  const marker = L.marker([lat, lng], { icon: customizedIcon }).addTo(
    customizedLayer
  );
  marker.bindPopup(content).openPopup();
  return marker;
}

function onMapClick(e) {
  console.log(e, e.latlng);
  const { lat, lng } = e.latlng;
  L.popup()
    .setLatLng([lat, lng])
    .setContent(`Clicked position: [${loc2str(lat)}},${loc2str(lng)}]`)
    .openOn(map);
}

function onMapRightClick(e) {
  // create new tag when right click
  const { lat, lng } = e.latlng;
  const input = prompt();
  const marker = createMarkerWithPopup(lat, lng, input);
}

function updatePanel() {
  // clean up then append markers info to marker-list panel
  const markerListDiv = $(".marker-list");
  markerListDiv.children().remove();
  const parsedLayer = layerParser(customizedLayer.getLayers());
  parsedLayer.forEach((parsedMarker) => {
    const { lat, lng } = parsedMarker.latlng;
    const popContent = parsedMarker.popup;
    markerListDiv.append(
      `<p>lat:${loc2str(lat)} lng:${loc2str(lng)} content: ${popContent}</p>`
    );
  });
}

function updateLayerByData(parsedLayer) {
  // replace current layer by input data
  if (parsedLayer.markers) {
    // update only when markers exist
    customizedLayer.clearLayers();
    console.log("updateLayerByData,", parsedLayer);
    parsedLayer.markers.forEach(({ latlng, popup }) => {
      createMarkerWithPopup(latlng.lat, latlng.lng, popup);
    });
  }
}

map.on("click", onMapClick);
map.on("contextmenu", onMapRightClick);

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
  const parsedLayer = {
    markers: layerParser(customizedLayer.getLayers()),
    type: "markers",
  };
  ws.send(JSON.stringify(parsedLayer));
});
