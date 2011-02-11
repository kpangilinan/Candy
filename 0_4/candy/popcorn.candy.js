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
    //global variables:
    var video;
    var canvasCopy, contextCopy;
    var canvas, context;

    document.addEventListener('DOMContentLoaded', function () {
      video = document.getElementById('video');
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
	  	video.addEventListener('loadeddata', function () {
        draw(this, context, cw, ch); //continue to draw() until video has paused or ended
        }, false);
      }, false);
    }, false);

    function draw(v, c, w, h) {
      if (v.paused || v.ended) return false;
      contextCopy.drawImage(v, 0, 0, w, h);

      var effect = (String)(v.getAttribute('data-apply-effect')).split("|"); //
      c.drawImage(v, 0, 0, w, h);

      if (effect[0] == "grayscale") {
        //========================//
        // GRAYSCALE EFFECT //
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
      } else if (effect[0] == "emboss") {
        //========================//
        // EMBOSS EFFECT //
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
      } else {
        c.drawImage(v, 0, 0, w, h);
      }

      setTimeout(draw, 0, v, c, w, h);
    }

    function changeEffect(e) {
      video.setAttribute("data-apply-effect", e);
    }

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
            elem: 'input', type: 'text', label: 'In'
          },
          end: {
            elem: 'input', type: 'text', label: 'Out'
          },
          filter: {
            elem: 'input', type: 'text', label: 'Text'
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
        changeEffect();
      }

    };
  })());

})(Popcorn);