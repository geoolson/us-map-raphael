class USheatMap {
  constructor({
    targetElementId = "container",
    colorMin = {red: 230, green: 230, blue: 230},
    colorMax = {red: 0, blue: 255, green: 0},
    applyData = "value",
    thresholdMax = null,
    thresholdMin = null,
    data = {}
  }){
    this.element = targetElementId;
    this.colorMin= colorMin;
    this.colorMax = colorMax;
    this.data = data;
    this.applyData = applyData;
    this.thresholdMax = thresholdMax !== null ? thresholdMax:
      Object.values(this.data).reduce(
        (max, num) => num[this.applyData] > max ? num[this.applyData]: max,
        Number.MIN_VALUE
      );
    this.thresholdMin = thresholdMin !== null ? thresholdMin:
      Object.values(this.data).reduce(
        (min, num) => num.value < min ? num.value: min,
        Number.MAX_VALUE
      );
    const w = 1000, h = 900;
    this.R = Raphael("container", w, h);
    this.attr = {
      "fill": this.colorMin,
      "stroke": "#fff",
      "stroke-opacity": "1",
      "stroke-linejoin": "round",
      "stroke-miterlimit": "4",
      "stroke-width": "0.75",
      "stroke-dasharray": "none"
    };
    this.usRaphael = {};
    this.R.setSize("100%", "100%");
    this.R.setViewBox(0, 0, w, h, true);

    //Draw Map and store Raphael paths
    for (var state in usMap) {
      let dataVal = this.data[state][this.applyData];
      let colorPercent = dataVal > this.thresholdMax ? 1: dataVal / this.thresholdMax;
      this.attr.fill = this.colorGradient(this.colorMin, this.colorMax, colorPercent);
      this.usRaphael[state] = this.R.path(usMap[state]).attr(this.attr);
    }
  }

  colorGradient (color1, color2, percent) {
    const red = Math.floor(color1.red + percent * (color2.red - color1.red));
    const blue = Math.floor(color1.blue + percent * (color2.blue - color1.blue));
    const green = Math.floor(color1.green + percent * (color2.green - color1.green));
    return `rgb(${red},${green},${blue})`;
  }
}

window.onload = function () {
  let data = {};
  for(state in usMap){
    data[state] = {
      value: Math.floor(Math.random() * 100)
    }
  }
  new USheatMap({data: data, thresholdMax: 100});
};
