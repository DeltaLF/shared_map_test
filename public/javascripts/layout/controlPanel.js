const colorSelector = $(".marker-color").on("change", (e) => {
  // sync selector background color with selected value
  colorSelector.css("background-color", COLORS[e.target.value]);
});
