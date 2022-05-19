import { ws } from "./mapSocket.js";
import {
  isJSONObject,
  getColorFromMarker,
  layerParser,
  loc2str,
} from "./mapUtils.js";

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

// customized layer:
const customizedLayer = L.layerGroup([]).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(customizedLayer);

function iconMarker(colorIndex = 0) {
  const markerHtmlStyles = `
  background-color: ${COLORS[colorIndex]};
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

function createMarkerWithPopup(lat, lng, content, color = null) {
  let selectColorIndex;
  if (!color) {
    selectColorIndex = $(".marker-color option:selected").val();
  } else {
    selectColorIndex = color;
  }

  const customizedIcon = iconMarker(selectColorIndex);
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
    const { lat, lng } = parsedMarker;
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
    parsedLayer.markers.forEach(({ lat, lng, popup, color }) => {
      createMarkerWithPopup(lat, lng, popup, color);
    });
  }
}

map.on("click", onMapClick);
map.on("contextmenu", onMapRightClick);

$(".button-clear").on("click", function (e) {
  console.log(e);
  customizedLayer.clearLayers();
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

ws.onmessage = ({ data }) => {
  const jsonData = isJSONObject(data);
  if (jsonData && jsonData.type === "markers") {
    console.log("markers");
    console.log(jsonData);
    updateLayerByData(jsonData);
    updatePanel();
  }
};
