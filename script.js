let drawJS = {};
(function (pen) {
  pen.translatePos = { x: 10, y: 10 };
  pen.scale = 1.0;
  pen.scaleMultiplier = 0.8;

  pen.settings = {
    lineWidth: 1,
    strokeStyle: "000",
    layers: [],
  };

  pen.addStage = function (o = {}) {
    let stage = document.createElement("div");
    //stage.id = o.id || 'stage-' + document.querySelectorAll('.stage').length;;
    let el =
      document.querySelector(o.wrapper) || document.querySelector("body");
    stage.className = "stage";

    let height = o.width || el.offsetHeight || this.settings.stageHeight;
    let width = o.height || el.offsetWidth || this.settings.stageWidth;
    stage.style.height = height + "px";
    stage.style.width = width + "px";

    el.appendChild(stage);
    return stage;
  };

  pen.addLayer = function (o = {}) {
    //  let stage = document.querySelector(o.stageId) || document.querySelector('.stage') || this.addStage({id:'stage'});
    let stage = document.querySelector(".stage") || this.addStage();
    let layer = document.createElement("canvas");

    layer.id = o.id || "";
    layer.height = parseInt(stage.style.height, 10);
    layer.width = parseInt(stage.style.width, 10);
    stage.appendChild(layer);
    o.id && this.settings.layers.push(layer);
    return layer;
  };

  pen.clearLayers = function () {
    this.settings.layers.map((layer) => {
      layer.getContext("2d").clearRect(0, 0, layer.width, layer.height);
    });
  };

  pen.transform = function (context) {
    // translate and scale canvas
    context.save();
    context.translate(this.translatePos.x, this.translatePos.y);
    context.scale(this.scale, this.scale);
  };

  pen.zoomIn = function() {
    this.scale /= this.scaleMultiplier;
  }

  pen.zoomOut = function() {
    this.scale *= this.scaleMultiplier;
  }

  pen.drawPolygon = function (o = {}) {
    let canvas = document.querySelector("#" + o.layer) || this.addLayer();
    let context = canvas.getContext("2d");
    this.transform(context);
    // set shape properties
    let numSides = o.numSides || 3;
    let radius = o.radius || 100;
    let cx = o.cx || 0;
    let cy = o.cy || 0;

    // set pen properties
    context.lineWidth = o.lineWidth || this.settings.lineWidth;
    context.strokeStyle = o.strokeStyle || this.settings.strokeStyle;

    // start the path
    context.beginPath();

    // move to the first point in the 3 o'clock position
    context.moveTo(cx + radius, cy + 0);

    // determine angle of a pie slice based on number of slides
    let angle = (2 * Math.PI) / numSides;

    // for each side, go to a corner.
    for (var i = 1; i <= numSides; i++) {
      // get the current angle based on where we are in the loop
      let currentAngle = i * angle;

      // use cosine to get horizontal coordinate
      let x = cx + radius * Math.cos(currentAngle);

      // use sin to get vertical coordinate
      let y = cy + radius * Math.sin(currentAngle);

      context.lineTo(x, y);

      // go to this point next
      context.lineTo(x, y);
    }
    // add the outline
    context.stroke();

    // add the fill
    if (o.fill) {
      context.fillStyle = o.fill;
      context.fill();
    }
    context.restore();
  };

  pen.drawRect = function (o = {}) {
    let canvas = document.querySelector("#" + o.layer) || this.addLayer();
    let context = canvas.getContext("2d");
    this.transform(context);

    let cx = o.cx || 0;
    let cy = o.cy || 0;
    let height = o.height || 0;
    let width = o.width || 0;

    // set pen properties
    context.lineWidth = o.lineWidth || this.settings.lineWidth;
    context.strokeStyle = o.strokeStyle || this.settings.strokeStyle;

    // start the path
    context.beginPath();
    context.rect(cx - width / 2, cy - height / 2, width, height);
    context.stroke();

    // add the fill
    if (o.fill) {
      context.fillStyle = o.fill;
      context.fill();
    }
    context.restore();
  };

  pen.addText = function (o = {}) {
    let canvas = document.querySelector("#" + o.layer) || this.addLayer();
    let context = canvas.getContext("2d");
    this.transform(context);

    let size = o.size || "12px";
    let family = o.family || "Arial";
    context.font = o.font || size + " " + family;

    context.fillStyle = o.color || "#000";
    context.textAlign = o.align || "left";
    context.textBaseline = o.baseline || "top";

    let text = o.text || "";

    let x = o.x != undefined ? o.x : canvas.width / 2;
    let y = o.y != undefined ? o.y : canvas.height / 2;

    context.fillText(text, x, y);

    context.restore();
  };

  pen.drawCircle = function (o = {}) {
    // encapsulate this function
    let canvas = document.querySelector("#" + o.layer) || this.addLayer();
    let context = canvas.getContext("2d");
    this.transform(context);

    // set properties
    let x = o.cx || 0;
    let y = o.cy || 0;
    let radius = o.radius || 100;

    // set pen properties
    context.lineWidth = o.lineWidth || this.settings.lineWidth;
    context.strokeStyle = o.strokeStyle || this.settings.strokeStyle;

    // start the path
    context.beginPath();

    // plot out the path
    context.arc(x, y, radius, 0, 2 * Math.PI);

    // draw it
    context.stroke();

    // fill
    if (o.fill) {
      context.fillStyle = o.fill;
      context.fill();
    }
    context.restore();
  };

  pen.addImage = function (o = {}) {
    // without zoom and move
    if (o.src) {
      let canvas = document.querySelector("#" + o.layer) || this.addLayer();
      let context = canvas.getContext("2d");

      let img = new Image();

      let x = o.x != undefined ? o.x : canvas.width / 2;
      let y = o.y != undefined ? o.y : canvas.height / 2;

      img.onload = function () {
        x -= img.width / 2;
        y -= img.height / 2;
        context.drawImage(img, x, y);
      };
      img.src = o.src;
    }
  };
})(drawJS);
