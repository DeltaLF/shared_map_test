$("#gpx-file").on("change", (input) => {
  var file = input.target.files[0];
  console.log("file", file);
  var reader = new FileReader();
  reader.readAsText(file);
  reader.onloadend = function () {
    var xmlData = $(reader.result);
    console.log(xmlData);
    console.log(xmlData[2]);
    console.log(xmlData[2].innerHtml);
  };
});

// const GPX = "./../gpx/喀拉業北稜.gpx";
// console.log($("#gpx-xml"));

// fetch(GPX)
//   .then(function (response) {
//     console.log(response);
//     return response.text();
//   })
//   .then(function (data) {
//     console.log(data);
//     // convert your csv to an array
//   });

// console.log(GPX);

// new L.GPX(GPX, { async: true })
//   .on("loaded", function (e) {
//     map.fitBounds(e.target.getBounds());
//   })
//   .addTo(map);
