//global variables:
var video;
var canvasCopy, contextCopy;
var canvas, context;

//used in RGB effect 
var rr = gg = bb = 0;

//used in Modulate effect 
var trap = 0;
var z = 0;

document.addEventListener('DOMContentLoaded', function () {
  video = document.getElementById('candy');
  canvasCopy = document.createElement('canvas');
  contextCopy = canvasCopy.getContext('2d');
  canvas = document.createElement('canvas');
  context = canvas.getContext('2d');

  document.body.appendChild(canvas);

  var cw = video.width;
  var ch = video.height;
  canvasCopy.width = canvas.width = cw;
  canvasCopy.height = canvas.height = ch;

  video.addEventListener('play', function () {
    draw(this, context, cw, ch); //continue to draw() until video has paused or ended
  }, false);
}, false);

function draw(v, c, w, h) {
  if (v.paused || v.ended) return false;
  contextCopy.drawImage(v, 0, 0, w, h);

  var effect = (String)(v.getAttribute('data-apply-effect')).split("|"); //
  c.drawImage(v, 0, 0, w, h);

  switch (effect[0]) {
  case "comic":
    //========================//
    //      COMIC EFFECT      //
    //========================//
    var frame = contextCopy.getImageData(0, 0, w, h);
    var l = frame.data.length / 4;
    for (var i = 0; i < l; i++) {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];
      if (g < 125 && r < 125 && b < 125) {
        frame.data[i * 4 + 0] = 0;
        frame.data[i * 4 + 1] = 0;
        frame.data[i * 4 + 2] = 0;
      }
      if (g >= 125 && r >= 125 && b >= 125) {
        frame.data[i * 4 + 0] = 255;
        frame.data[i * 4 + 1] = 255;
        frame.data[i * 4 + 2] = 255;
      }
    }
    c.putImageData(frame, 0, 0);
    break;

  case "grayscale":
    //========================//
    //    GRAYSCALE EFFECT    //
    //========================//
    var frame = contextCopy.getImageData(0, 0, w, h);
    var l = frame.data.length / 4;
    for (var i = 0; i < l; i++) {
      var r = frame.data[i * 4 + 0] * .3;
      var g = frame.data[i * 4 + 1] * .59;
      var b = frame.data[i * 4 + 2] * .11;
      var grayscale = r + g + b;

      frame.data[i * 4 + 0] = grayscale;
      frame.data[i * 4 + 1] = grayscale;
      frame.data[i * 4 + 2] = grayscale;
    }
    c.putImageData(frame, 0, 0);
    break;

  case "sepia":
    //========================//
    //      SEPIA EFFECT      //
    //========================//
    var frame = contextCopy.getImageData(0, 0, w, h);
    var l = frame.data.length / 4;

    for (var i = 0; i < l; i++) {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];

      var ro = (r * .393) + (g * .769) + (b * .189);
      var go = (r * .349) + (g * .686) + (b * .168);
      var bo = (r * .272) + (g * .354) + (b * .131);

      frame.data[i * 4 + 0] = ro;
      frame.data[i * 4 + 1] = go;
      frame.data[i * 4 + 2] = bo;
    }
    c.putImageData(frame, 0, 0);
    break;

  case "greenscreen":
    //========================//
    //   GREENSCREEN EFFECT   //
    //========================//
    var frame = contextCopy.getImageData(0, 0, w, h);
    var l = frame.data.length / 4;
    for (var i = 0; i < l; i++) {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];
      if (g > 100 && r > 100 && b < 43) frame.data[i * 4 + 3] = 0;
    }

    c.putImageData(frame, 0, 0);
    var imgURL = 'url(' + effect[1] + ')';
    canvas.style.backgroundImage = imgURL;
    break;

  case "rotate":
    //========================//
    //      ROTATE EFFECT     //
    //========================//
    c.translate(w, h);
    c.rotate(Math.PI); //rotate video
    c.drawImage(v, 0, 0, w, h);
    c.translate(w, h);
    break;

  case "negative":
    //========================//
    //     NEGATIVE EFFECT    //
    //========================//
    var frame = contextCopy.getImageData(0, 0, w, h);
    var l = frame.data.length / 4;
    for (var i = 0; i < l; i++) {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];
      var o = frame.data[i * 4 + 3];

      frame.data[i * 4 + 0] = 255 - r;
      frame.data[i * 4 + 1] = 255 - g;
      frame.data[i * 4 + 2] = 255 - b;
    }
    c.putImageData(frame, 0, 0);
    break;

  case "bright":
    //========================//
    //      BRIGHT EFFECT     //
    //========================//
    var frame = contextCopy.getImageData(0, 0, w, h);
    var l = frame.data.length / 4;

    for (var i = 0; i < l; i++) {
      var ro = r = frame.data[i * 4 + 0];
      var go = g = frame.data[i * 4 + 1];
      var bo = b = frame.data[i * 4 + 2];

      ro += parseFloat(effect[1]) * 20;
      go += parseFloat(effect[1]) * 20;
      bo += parseFloat(effect[1]) * 20;

      frame.data[i * 4 + 0] = ro;
      frame.data[i * 4 + 1] = go;
      frame.data[i * 4 + 2] = bo;
    }
    c.putImageData(frame, 0, 0);
    break;

  case "emboss":
    //========================//
    //      EMBOSS EFFECT     //
    //========================//
    var frame = contextCopy.getImageData(0, 0, w, h);
    var data = frame.data;
    var width = frame.width;
    var limit = data.length

    // Loop through the subpixels, convoluting each using an edge-detection matrix.
    for (var i = 0; i < limit; i++) {
      if (i % 4 == 3) continue;
      data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
    }

    // Draw the pixels onto the visible canvas
    c.putImageData(frame, 0, 0);
    break;

  case 'tilt-shift':
    //========================//
    //    TILT-SHIFT EFFECT   //
    //========================//
    var focusLine = 100;
    var focusHeight = 30;
    var depthOfField = 10;
	
    var dof = document.createElement('canvas');
    var ctx = dof.getContext('2d');
    var ow = dof.width = video.width;
    var oh = dof.height = video.height;

    var r = 1 - depthOfField / 128;
    var w = dof.width * r;
    var h = dof.height * r;

    ctx.drawImage(v, 0, 0, ow, oh);
    while (ow > w)
      ctx.drawImage(dof, 0, 0, ow, oh, 0, 0, --ow, oh);
    while (oh > h)
      ctx.drawImage(dof, 0, 0, ow, oh, 0, 0, ow, --oh);

    c.drawImage(v, 0, 0, dof.width, h);
    for (var y = dof.height; y--;) {
      c.globalAlpha = Math.max(0, Math.min(1, (Math.abs(focusLine - y) - focusHeight) / focusHeight));
      c.drawImage(dof, 0, y, dof.width, 1, 0, y, dof.width + 40, 1);
    }
    break;
	
  case 'blur':
    //========================//
    //       BLUR EFFECT      //
    //========================//
    var depthOfField = 10; //2-16
    var dof = document.createElement('canvas');
    var ctx = dof.getContext('2d');
    var ow = dof.width = video.width;
    var oh = dof.height = video.height;

    var r = 1 - depthOfField / 128;
    var w = dof.width * r;
    var h = dof.height * r;

    ctx.drawImage(v, 0, 0, ow, oh);
    while (ow > w)
      ctx.drawImage(dof, 0, 0, ow, oh, 0, 0, --ow, oh);
    while (oh > h)
      ctx.drawImage(dof, 0, 0, ow, oh, 0, 0, ow, --oh);

    c.drawImage(dof, 0, 0, dof.width + 30, dof.height + 30);
    break;
	
  case 'rgb':
    //========================//
    //       RGB EFFECT       //
    //========================//
    var frame = contextCopy.getImageData(0, 0, w, h);
    var l = frame.data.length;
    for (var i = 0; i < l; i++) {
      frame.data[i * 4 + 0] += rr;
      frame.data[i * 4 + 1] += gg;
      frame.data[i * 4 + 2] += bb;
    }
    c.putImageData(frame, 0, 0);
    break;

  case 'pointillize-e':
    //========================//
    //   POINTALLIZE EFFECT   //
    //========================//
    var size = parseFloat(effect[1]);
    var spacing = parseFloat(effect[2]);
    var jitter = parseFloat(effect[3]);

    c.fillStyle = 'rgb(' + 255 + ',' + 255 + ',' + 255 + ')';
    c.fillRect(0, 0, w, h);

    for (var x = size; x < w; x += spacing) {
      for (var y = size; y < h; y += spacing) {
        var pixel = contextCopy.getImageData(x, y, 1, 1);
        var color = pixel.data;
        c.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

        var j1 = (jitter - jitter * 2) + (Math.random() * (jitter));
        var j2 = (jitter - jitter * 2) + (Math.random() * (jitter));
        c.beginPath();
        c.arc(x + j1, y + j2, size / 2, 0, Math.PI * 2, true);
        c.closePath();
        c.fill();
      }
    }
    break;
	
  case 'pointillize-r':
    //========================//
    //   POINTILLIZE EFFECT   //
    //========================//
    var size = parseFloat(effect[1]);
    var spacing = parseFloat(effect[2]);
    var jitter = parseFloat(effect[3]);

    c.fillStyle = 'rgb(' + 0 + ',' + 0 + ',' + 0 + ')';
    c.fillRect(0, 0, w, h);

    for (var x = 0; x < w; x += spacing) {
      for (var y = 0; y < h; y += spacing) {
        var pixel = contextCopy.getImageData(x, y, 1, 1);
        var color = pixel.data;
        c.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

        var j1 = (jitter - jitter * 2) + (Math.random() * (jitter));
        var j2 = (jitter - jitter * 2) + (Math.random() * (jitter));
        c.fillRect(x + j1, y + j2, size, size);
      }
    }
    break;
	
  case 'pixelate':
    //========================//
    //     PIXELATE EFFECT    //
    //========================//
    var size = parseFloat(effect[1]);

    for (var x = 0; x < w; x += size) {
      for (var y = 0; y < h; y += size) {
        var pixel = contextCopy.getImageData(x, y, 1, 1);
        var color = pixel.data;
        c.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

        var j1 = (jitter - jitter * 2) + (Math.random() * (jitter));
        var j2 = (jitter - jitter * 2) + (Math.random() * (jitter));
        c.fillRect(x, y, size, size);
      }
    }
    break;

  case "modulate":
    //========================//
    //     MODULATE EFFECT    //
    //========================//
    //var waveform = s; [in progress]
    var wavelength = parseFloat(effect[1]);
    var amplitude = parseFloat(effect[2]);
    var orientation = effect[3];

    c.globalAlpha = 0.2;

    if (orientation == 'v') {
      c.drawImage(v, 0, 0, w, h);
      if (trap == 1) {
        for (var i = 0; i < w; i += wavelength * 2) {
          c.fillRect(i, 0, wavelength, h);
        }

        z++;
        if (z == amplitude) {
          z = 0;
          trap = 0;
        }
      }
      else {
        for (var i = wavelength; i < w; i += wavelength * 2)
        c.fillRect(i, 0, wavelength, h);

        z++;
        if (z == amplitude) {
          z = 0;
          trap = 1;
        }
      }
    }
    else {
      c.drawImage(v, 0, 0, w, h);
      if (trap == 1) {
        for (var i = 0; i < h; i += wavelength * 2)
        c.fillRect(0, i, w, wavelength);

        z++;
        if (z == amplitude) {
          z = 0;
          trap = 0;
        }
      }
      else {
        for (var i = wavelength; i < h; i += wavelength * 2)
        c.fillRect(0, i, w, wavelength);
        z++;
        if (z == amplitude) {
          z = 0;
          trap = 1;
        }
      }
    }
    break;
	
	case 'disperse':
    //========================//
    //     DISPERSE EFFECT    //
    //========================//
    var size = 3;
    var spacing = 3;
    var jitter = 15;

    for (var x = size; x < w; x += spacing) {
      for (var y = size; y < h; y += spacing) {
        var pixel = contextCopy.getImageData(x, y, 1, 1);
        var color = pixel.data;
        c.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

        var j1 = (jitter - jitter * 2) + (Math.random() * (jitter));
        var j2 = (jitter - jitter * 2) + (Math.random() * (jitter));
        c.beginPath();
        c.arc(x + j1, y + j2, size / 2, 0, Math.PI * 2, true);
        c.closePath();
        c.fill();
      }
    }
    break;

  default:
    c.drawImage(v, 0, 0, w, h);
  }
  setTimeout(draw, 0, v, c, w, h);
}

function changeEffect(e) {
  video.setAttribute("data-apply-effect", e);
}