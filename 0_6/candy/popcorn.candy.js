// PLUGIN: CANDY
(function (Popcorn) {

  /**
   * Webpages popcorn plug-in
   * DESCRIPTION
   *
   * @param {Object} options
   *
   * Example:
   var p = Popcorn('#video')
   .candy({
   id: "video",
   start: 5, // seconds
   end: 15, // seconds
   } )
   *
   */
  Popcorn.plugin("candy", (function () {
    var videoIn;
    var canvas, videoOut;
    var bgCanvas, bgContext;

    var frame;
    var effect;

    var r = g = b = 0;
    var l;

    var w, h;

    //used in Modulate effect 
    var trap = 0;
    var z = 0;

    document.addEventListener('DOMContentLoaded', function () {
      setUpVideo();
      videoIn.addEventListener('play', function () {
        videoIn.addEventListener('loadeddata', function () {
          draw(videoIn, videoOut, bgContext); //continue to draw() until video has paused or ended
        }, false);
      }, false);
    }, false);

    function setUpVideo() {
      videoIn = document.getElementById('video');
      videoIn.style.display = "none";

      canvas = document.createElement('canvas');
      videoOut = canvas.getContext('2d');

      bgCanvas = document.createElement('canvas');
      bgContext = bgCanvas.getContext('2d');

      document.body.appendChild(canvas);

      w = canvas.width = bgCanvas.width = videoIn.width;
      h = canvas.height = bgCanvas.height = videoIn.height;
    };

    function draw(v, c, bg) {
      try {
        if (v.paused || v.ended) return false; //DOESN'T NEED REPEAR
        bg.drawImage(v, 0, 0, w, h);

        effect = (String)(v.getAttribute('data-apply-effect')).split("|");

        frame = bg.getImageData(0, 0, w, h);
        l = frame.data.length / 4;

        //document.write("<script type=\"text/javascript\" src=\"effects/grayscale.js\"></script>");
        if (effect[0] == "grayscale") {
          //==================//
          // GRAYSCALE EFFECT //
          //==================//
          for (var i = 0; i < l; i++) {
            r = frame.data[i * 4 + 0] * .3;
            g = frame.data[i * 4 + 1] * .59;
            b = frame.data[i * 4 + 2] * .11;
            var grayscale = r + g + b;

            frame.data[i * 4 + 0] = frame.data[i * 4 + 1] = frame.data[i * 4 + 2] = grayscale;
          }
          c.putImageData(frame, 0, 0);
        } else if (effect[0] == "emboss") {
          //===============//
          // EMBOSS EFFECT //
          //===============//
          // Loop through the subpixels, convoluting each using an edge-detection matrix.
          for (var i = 0; i < frame.data.length; i++) {
            if (i % 4 == 3) continue;
            frame.data[i] = 127 + 2 * frame.data[i] - frame.data[i + 4] - frame.data[i + frame.width * 4];
          }
          // Draw the pixels onto the visible canvas
          c.putImageData(frame, 0, 0);
        } else if (effect[0] == "rotate") {
          //===============//
          // ROTATE EFFECT //
          //===============//
          c.translate(w, h);
          c.rotate(Math.PI); //rotate video
          c.drawImage(v, 0, 0, w, h);
          c.translate(w, h);

        } else if (effect[0] == "comic") {
          //==============//
          // COMIC EFFECT //
          //==============//
          for (var i = 0; i < l; i++) {
            r = frame.data[i * 4 + 0];
            g = frame.data[i * 4 + 1];
            b = frame.data[i * 4 + 2];
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
        } else if (effect[0] == "comic-bw") {
          //============================//
          // COMIC BLACK & WHITE EFFECT //
          //============================//
          for (var i = 0; i < l; i++) {
            r = frame.data[i * 4 + 0];
            g = frame.data[i * 4 + 1];
            b = frame.data[i * 4 + 2];
            if (g < 120 && r < 120 && b < 120) {
              frame.data[i * 4 + 0] = 0;
              frame.data[i * 4 + 1] = 0;
              frame.data[i * 4 + 2] = 0;
            } else {
              frame.data[i * 4 + 0] = 255;
              frame.data[i * 4 + 1] = 255;
              frame.data[i * 4 + 2] = 255;
            }
          }
          c.putImageData(frame, 0, 0);
        } else if (effect[0] == "sepia") {
          //==============//
          // SEPIA EFFECT //
          //==============//
          for (var i = 0; i < l; i++) {
            r = frame.data[i * 4 + 0];
            g = frame.data[i * 4 + 1];
            b = frame.data[i * 4 + 2];

            var ro = (r * .393) + (g * .769) + (b * .189);
            var go = (r * .349) + (g * .686) + (b * .168);
            var bo = (r * .272) + (g * .354) + (b * .131);

            frame.data[i * 4 + 0] = ro;
            frame.data[i * 4 + 1] = go;
            frame.data[i * 4 + 2] = bo;
          }
          c.putImageData(frame, 0, 0);
        } else if (effect[0] == "greenscreen") {
          //====================//
          // GREENSCREEN EFFECT //
          //====================//
          for (var i = 0; i < l; i++) {
            r = frame.data[i * 4 + 0];
            g = frame.data[i * 4 + 1];
            b = frame.data[i * 4 + 2];
            if (g > 100 && r > 100 && b < 43) frame.data[i * 4 + 3] = 0;
          }

          c.putImageData(frame, 0, 0);
          var imgURL = 'url(' + effect[1] + ')';
          canvas.style.backgroundImage = imgURL;
        } else if (effect[0] == "blur") {
          //=================//
          //    BLUR EFFECT  //
          //=================//
          c.globalAlpha = 0.05;
          c.drawImage(v, 0, 0, w, h);
          c.globalAlpha = 1;
        } else if (effect[0] == "negative") {
          //=================//
          // NEGATIVE EFFECT //
          //=================//
          for (var i = 0; i < l; i++) {
            r = frame.data[i * 4 + 0];
            g = frame.data[i * 4 + 1];
            b = frame.data[i * 4 + 2];

            frame.data[i * 4 + 0] = 255 - r;
            frame.data[i * 4 + 1] = 255 - g;
            frame.data[i * 4 + 2] = 255 - b;
          }
          c.putImageData(frame, 0, 0);
        } else if (effect[0] == "xray") {
            //=============//
            // XRAY EFFECT //
            //=============//
            for (var i = 0; i < l; i++) {
              r = frame.data[i * 4 + 0];
              g = frame.data[i * 4 + 1];
              b = frame.data[i * 4 + 2];

              frame.data[i * 4 + 0] = 255 - r;
              frame.data[i * 4 + 1] = 255 - g;
              frame.data[i * 4 + 2] = 255 - b;
              
              r = frame.data[i * 4 + 0] * .3;
              g = frame.data[i * 4 + 1] * .59;
              b = frame.data[i * 4 + 2] * .11;
              var grayscale = r + g + b;

              frame.data[i * 4 + 0] = frame.data[i * 4 + 1] = frame.data[i * 4 + 2] = grayscale;
            }
            c.putImageData(frame, 0, 0);
          } else if (effect[0] == "rgb") {
          //=================//
          //    RGB EFFECT   //
          //=================// 
          for (var i = 0; i < l; i++) {
            r = frame.data[i * 4 + 0] + parseFloat(effect[1]);
            g = frame.data[i * 4 + 1] + parseFloat(effect[2]);
            b = frame.data[i * 4 + 2] + parseFloat(effect[3]);

            frame.data[i * 4 + 0] = r;
            frame.data[i * 4 + 1] = g;
            frame.data[i * 4 + 2] = b;
          }
          c.putImageData(frame, 0, 0);
        } else if (effect[0] == "bright") {
          //===============//
          // BRIGHT EFFECT //
          //===============//
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
        } else if (effect[0] == "pointillize-e") {
          //====================//
          // POINTALLIZE EFFECT //
          //====================//
          var size = parseFloat(effect[1]);
          var spacing = parseFloat(effect[2]);
          var jitter = parseFloat(effect[3]);

          c.fillStyle = 'rgb(' + 255 + ',' + 255 + ',' + 255 + ')';
          c.fillRect(0, 0, w, h);

          for (var x = size; x < w; x += spacing) {
            for (var y = size; y < h; y += spacing) {
              var pixel = bg.getImageData(x, y, 1, 1);
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
        } else if (effect[0] == "pointillize-r") {
          //====================//
          // POINTILLIZE EFFECT //
          //====================//
          var size = parseFloat(effect[1]);
          var spacing = parseFloat(effect[2]);
          var jitter = parseFloat(effect[3]);

          c.fillStyle = 'rgb(' + 0 + ',' + 0 + ',' + 0 + ')';
          c.fillRect(0, 0, w, h);

          for (var x = 0; x < w; x += spacing) {
            for (var y = 0; y < h; y += spacing) {
              var pixel = bg.getImageData(x, y, 1, 1);
              var color = pixel.data;
              c.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

              var j1 = (jitter - jitter * 2) + (Math.random() * (jitter));
              var j2 = (jitter - jitter * 2) + (Math.random() * (jitter));
              c.fillRect(x + j1, y + j2, size, size);
            }
          }
        } else if (effect[0] == "pixelate") {
          //=================//
          // PIXELATE EFFECT //
          //=================//
          var size = parseFloat(effect[1]);

          for (var x = 0; x < w; x += size) {
            for (var y = 0; y < h; y += size) {
              var pixel = bg.getImageData(x, y, 1, 1);
              var color = pixel.data;
              c.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

              var j1 = (jitter - jitter * 2) + (Math.random() * (jitter));
              var j2 = (jitter - jitter * 2) + (Math.random() * (jitter));
              c.fillRect(x, y, size, size);
            }
          }
        } else if (effect[0] == "modulate") {
          //=================//
          // MODULATE EFFECT //
          //=================//
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
            } else {
              for (var i = wavelength; i < w; i += wavelength * 2)
              c.fillRect(i, 0, wavelength, h);

              z++;
              if (z == amplitude) {
                z = 0;
                trap = 1;
              }
            }
          } else {
            c.drawImage(v, 0, 0, w, h);
            if (trap == 1) {
              for (var i = 0; i < h; i += wavelength * 2)
              c.fillRect(0, i, w, wavelength);

              z++;
              if (z == amplitude) {
                z = 0;
                trap = 0;
              }
            } else {
              for (var i = wavelength; i < h; i += wavelength * 2)
              c.fillRect(0, i, w, wavelength);
              z++;
              if (z == amplitude) {
                z = 0;
                trap = 1;
              }
            }
          }

          c.globalAlpha = 1;

        } else {
          c.drawImage(v, 0, 0, w, h);
        }

        setTimeout(draw, 0, v, c, bg);
      } catch (err) {
        draw(v, c, bg);
      }
    };

    function changeEffect(e) {
      videoIn.setAttribute("data-apply-effect", e);
    };

    return {
      manifest: {
        about: {
          name: "Popcorn Candy Plugin",
          version: "0.4",
          author: "@kpangilinan",
          website: "kpangilinan.wordpress.com"
        },
        options: {
          start: {
            elem: 'input',
            type: 'text',
            label: 'In'
          },
          end: {
            elem: 'input',
            type: 'text',
            label: 'Out'
          },
          filter: {
            elem: 'input',
            type: 'text',
            label: 'Text'
          }
        }
      },
      _setup: function (options) {

      },
      /**
       * @member candy
       * The start function will be executed when the currentTime
       * of the video reaches the start time provided by the
       * options variable
       */
      start: function (event, options) {
        // make the <canvas> visible
        changeEffect(options.filter);
      },
      /**
       * @member candy
       * The end function will be executed when the currentTime
       * of the video reaches the end time provided by the
       * options variable
       */
      end: function (event, options) {
        // make the <canvas> invisible
        changeEffect(); //back to normal video
      }

    };
  })());

})(Popcorn);