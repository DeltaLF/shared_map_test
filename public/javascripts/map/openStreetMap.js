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

var marker = L.marker([51.5, -0.09]).addTo(map);

marker.bindPopup(" <h1>this is popup</h1> ").openPopup();

var popup = L.popup()
  .setLatLng([51.513, -0.09])
  .setContent("I am a standalone popup.")
  .openOn(map);

function onMapClick(e) {
  console.log(e, e.latlng);
  const { lat, lng } = e.latlng;
  L.popup()
    .setLatLng([lat, lng])
    .setContent(
      `Clicked position: [${parseFloat(lat).toFixed(2)},${parseFloat(
        lng
      ).toFixed(2)}]`
    )
    .openOn(map);
}

map.on("click", onMapClick);

function onMapRightClick(e) {
  alert(e);
}

map.on("contextmenu", onMapRightClick);
