// utils
function loc2str(loc) {
  return parseFloat(loc).toFixed(2);
}

function layerParser(layer) {
  // layer is array of markers
  return layer.map((marker) => {
    const obj = { ...marker._latlng };
    //obj.latlng = marker._latlng;
    obj.popup = marker.getPopup() ? marker.getPopup()._content : null;
    obj.color = getColorFromMarker(marker);
    console.log("layerParser", obj);
    return obj;
  });
}

function getColorFromMarker(marker) {
  try {
    const colorRE = marker._icon.innerHTML.match(/background-color:.*?;/);
    if (colorRE[0].length > 18) {
      const color = colorRE[0].slice(18, 25);
      console.log("color:", color);
      for (let c in COLORS) {
        if (COLORS[c] === color) {
          return c;
        }
      }
      return 0;
    }
  } catch {
    return 0; // default value
  }
}

function isJSONObject(string) {
  try {
    const o = JSON.parse(string);
    if (o && typeof o === "object") {
      return o;
    }
  } catch (e) {}
  return false;
}

export { isJSONObject, getColorFromMarker, layerParser, loc2str };
