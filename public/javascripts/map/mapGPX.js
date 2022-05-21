$("#gpx-file").on("change", (input) => {
  var file = input.target.files[0];
  console.log("file", file);

  var reader = new FileReader();
  reader.readAsText(file);
  reader.onloadend = function () {
    var GPX = $(reader.result);
    console.log(GPX);
    console.log(GPX[2]);
    //console.log(GPX[2].innerText);
    console.log(typeof GPX[2].innerHtml, GPX[2].innerHtml);
  };
});
