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
 	target : 'candydiv',
 	filter: 'FILTERNAME|[OPTIONS]' // select filter
 	} )
 	*
 	*/
	var p;
	var videoB;
	var canvas, videoOut;
	var bgCanvas, bgContext;

	var frame;
	var effect;

	var r, g, b;
	var l;

	var w, h;

	//used in Multi-Channel effect
	var posX;
	var posY;
	var multiON=false;

	//used in Modulate effect
	var trap = 0;
	var z = 0;

	//used in Pointillize effect
	var size;
	var spacing;
	var jitter;

	var noise;
	var noise2;
	var pixelNoise;
	var j1;
	var j2;

	canvas = document.createElement('canvas');
	videoOut = canvas.getContext('2d');

	bgCanvas = document.createElement('canvas');
	bgContext = bgCanvas.getContext('2d');

	videoB = document.createElement('video');
	videoB.src = null;
	videoB.autoplay = "autoplay";
	videoB.loop = "loop";
	videoB.volume = 0;
	videoB.style.display = "none";

	function draw(v, c, bg) {
		if (v.paused || v.ended)
			return false;
		bg.drawImage(v, 0, 0, w, h);

		effect = (String)(v.getAttribute('data-apply-effect')).split("|");

		frame = bg.getImageData(0, 0, w, h);
		l = frame.data.length / 2;

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
				if (i % 4 == 3)
					continue;
				frame.data[i] = 127 + 2 * frame.data[i] - frame.data[i + 4] - frame.data[i + frame.width * 4];
			}
			// Draw the pixels onto the visible canvas
			c.putImageData(frame, 0, 0);
		} else if (effect[0] == "rotate") {
			//===============//
			// ROTATE EFFECT //
			//===============//
			if (effect[1] == 'h') {
				c.scale(-1, 1);
				c.drawImage(v, -w, 0, w, h)
			} else if (effect[1] == 'v') {
				c.scale(1, -1);
				c.drawImage(v, 0, -h, w, h)
			} else if (effect[1] == 'hv' || effect[1] == 'vh') {
				c.scale(-1, -1);
				c.drawImage(v, -w, -h, w, h)
			}
			//if no option is used, video does not rotate
			c.scale(1, 1);
		} else if (effect[0] == "comic") {
			//==============//
			// COMIC EFFECT //
			//==============//
			for (var i = 0; i < l; i++) {
				r = frame.data[i * 4 + 0];
				g = frame.data[i * 4 + 1];
				b = frame.data[i * 4 + 2];
				if (effect[1] == "bw") {
					if (g < 125 && r < 125 && b < 125) {
						frame.data[i * 4 + 0] = 0;
						frame.data[i * 4 + 1] = 0;
						frame.data[i * 4 + 2] = 0;
					} else {
						frame.data[i * 4 + 0] = 255;
						frame.data[i * 4 + 1] = 255;
						frame.data[i * 4 + 2] = 255;
					}
				} else {
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
				} //DEFAULT: NORMAL COMIC
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

				frame.data[i * 4 + 0] = (r * .393) + (g * .769) + (b * .189);
				frame.data[i * 4 + 1] = (r * .349) + (g * .686) + (b * .168);
				frame.data[i * 4 + 2] = (r * .272) + (g * .354) + (b * .131);
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
				if (g > 100 && r > 100 && b < 43)
					frame.data[i * 4 + 3] = 0;
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
		} else if (effect[0] == "divide") {
			//===================//
			//   DIVIDE EFFECT   //
			//===================//
			var div = parseFloat(effect[1]);
			var a = w / div;
			var b = h / div;
			for (var x = 0; x < div; x++) {
				for (var y = 0; y < div; y++) {
					c.drawImage(v, x * a, y * b, a, b);
				}
			}
		} else if (effect[0] == "multi-channel") {
			//======================//
			// MULTI-CHANNEL EFFECT //
			//======================//
			if (multiON==false) {
				videoB.src = effect[1];
				multiON=true;
			}
			if (effect[2] == "tr") {
				posX = w/2;
				posY = 0;
			} else if (effect[2] == "bl") {
				posX = 0;
				posY = h/2;
			} else if (effect[2] == "br") {
				posX = w/2;
				posY = h/2;
			} else {
				posX = 0;
				posY = 0;
			}
			c.drawImage(v, 0, 0, w, h);
			c.drawImage(videoB, posX, posY, w/2, h/2);
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
				r = frame.data[i * 4 + 0];
				g = frame.data[i * 4 + 1];
				b = frame.data[i * 4 + 2];

				r += parseFloat(effect[1]) * 20;
				g += parseFloat(effect[1]) * 20;
				b += parseFloat(effect[1]) * 20;

				frame.data[i * 4 + 0] = r;
				frame.data[i * 4 + 1] = g;
				frame.data[i * 4 + 2] = b;
			}
			c.putImageData(frame, 0, 0);
		} else if (effect[0] == "pointillize") {
			//====================//
			// POINTILLIZE EFFECT //
			//====================//
			size = parseFloat(effect[1]);
			spacing = parseFloat(effect[2]);
			jitter = parseFloat(effect[3]);

			c.fillStyle = 'rgb(' + 255 + ',' + 255 + ',' + 255 + ')';
			c.fillRect(0, 0, w, h);

			for (var x = 0; x < w; x += spacing) {
				for (var y = 0; y < h; y += spacing) {
					var pixel = bg.getImageData(x, y, 1, 1);
					var color = pixel.data;
					c.fillStyle = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';

					var j1 = -jitter + (Math.random() * (jitter));
					var j2 = -jitter + (Math.random() * (jitter));
					if (effect[4] == 'e') {
						c.beginPath();
						c.arc(x + j1, y + j2, size / 2, 0, Math.PI * 2, true);
						c.closePath();
						c.fill();
					} else {
						c.fillRect(x + j1, y + j2, size, size); //DEFAULT: rectangle
					}
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
					c.fillRect(x, y, size, size);
				}
			}
		} else if (effect[0] == "old-tv") {
			//=================//
			//   OLD-TV EFFECT  //
			//=================//
			jitter = 30;
			//c.drawImage(v, 0, 0, w, h);
			for (var i = 0; i < l; i++) {
				r = frame.data[i * 4 + 0] * .3;
				g = frame.data[i * 4 + 1] * .59;
				b = frame.data[i * 4 + 2] * .11;
				var grayscale = r + g + b;

				frame.data[i * 4 + 0] = frame.data[i * 4 + 1] = frame.data[i * 4 + 2] = grayscale;
			}
			c.putImageData(frame, 0, 0);
			for (var x = 0; x < w + jitter; x += jitter) {
				for (var y = 0; y < h + jitter; y += jitter) {
					//pixelNoise = noise2 + Math.random() * noise;
					c.fillStyle = 'rgb(0,0,0)';

					j1 = (-jitter) + (Math.random() * (jitter));
					j2 = (-jitter) + (Math.random() * (jitter));
					c.fillRect(x + j1, y + j2, 1, 1);
				}
			}
		} else if (effect[0] == "noise") {
			//=================//
			//   NOISE EFFECT  //
			//=================//
			jitter = 20;
			c.drawImage(v, 0, 0, w, h);
			for (var x = 0; x < w + jitter; x += jitter) {
				for (var y = 0; y < h + jitter; y += jitter) {
					//pixelNoise = noise2 + Math.random() * noise;
					c.fillStyle = 'rgb(0,0,0)';

					j1 = (-jitter) + (Math.random() * (jitter));
					j2 = (-jitter) + (Math.random() * (jitter));
					c.fillRect(x + j1, y + j2, 1, 1);
				}
			}
		} else if (effect[0] == "modulate") {
			//=================//
			// MODULATE EFFECT //
			//=================//
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
					for (var i = wavelength; i < h; i += wavelength * 2) //DEFAULT: horizontal
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
	}; //end of draw function

	function changeEffect(v, e) {
		p.video.setAttribute("data-apply-effect", e);
	};

	Popcorn.plugin("candy", (function () {
		return {
			manifest: {
				about: {
					name: "Popcorn Candy Plugin",
					version: "0.8",
					author: "@kpangilinan",
					website: "kpangilinan.wordpress.com"
				},
				options: {
					start: {elem: 'input', type: 'text',label: 'In'},
					end: {elem: 'input',type: 'text',label: 'Out'},
					target : 'candy-container',
					filter: {elem: 'input',type: 'text',label: 'Text'}
				}
			},
			_setup: function (options) {
				p = this;
				p.video.style.display = "none";

				w = canvas.width = bgCanvas.width = p.video.width;
				h = canvas.height = bgCanvas.height = p.video.height;

				if ( document.getElementById( options.target ) ) {
					document.getElementById( options.target ).appendChild(canvas); // add the widget's div to the target div
				}

				p.listen( "play", function ( event ) {
					draw(p.video, videoOut, bgContext); //continue to draw() until video has paused or ended
				});
			},
			/**
 			* @member candy
 			* The start function will be executed when the currentTime
 			* of the video reaches the start time provided by the
 			* options variable
 			*/
			start: function (event, options) {
				// make the <canvas> visible
				changeEffect(p, options.filter);
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
				multiON=false;
			}
		};
	})());
})(Popcorn);