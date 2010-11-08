var processor = {
  timerCallback: function() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.applyComic();
	this.applyGrayscale();
	this.applySepia();
	this.applyGreenScreen();
	this.applyFlip();
	this.applyNegative();
	this.applyInterlace();
	this.applyChannel();
    var self = this;
    setTimeout(function () {
        self.timerCallback();
      }, 0);
  },

  doLoad: function() {
    this.video = document.getElementById("video");

    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");
    
	this.c2 = document.getElementById("c2");
    this.ctx2 = this.c2.getContext("2d");
	this.c3 = document.getElementById("c3");
    this.ctx3 = this.c3.getContext("2d");
	this.c4 = document.getElementById("c4");
    this.ctx4 = this.c4.getContext("2d");
	this.c5 = document.getElementById("c5");
    this.ctx5 = this.c5.getContext("2d");
	this.c6 = document.getElementById("c6");
    this.ctx6 = this.c6.getContext("2d");
	this.c7 = document.getElementById("c7");
    this.ctx7 = this.c7.getContext("2d");
	this.c8 = document.getElementById("c8");
    this.ctx8 = this.c8.getContext("2d");
	this.c9 = document.getElementById("c9");
    this.ctx9 = this.c9.getContext("2d");
	this.c10 = document.getElementById("c10");
    this.ctx10 = this.c10.getContext("2d");

    var self = this;
    this.video.addEventListener("play", function() {
        self.width = self.video.videoWidth / 2;
        self.height = self.video.videoHeight / 2;
        self.timerCallback();
      }, false);
  },

	applyComic: function() {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
	
	//comic book effect
	var frame = this.ctx1.getImageData(0, 0, this.width, this.height);
	var l = frame.data.length / 4;
    for (var i = 0; i < l; i++) {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];
	  if (g < 125 && r < 125 && b < 125) //range of color on shirt
	  {
		frame.data[i * 4 + 0] = 0;//red
        frame.data[i * 4 + 1] = 0;	//green
        frame.data[i * 4 + 2] = 0;//blue
	  }
	  if (g >= 125 && r >= 125 && b >= 125) //range of color on shirt
	  {
		frame.data[i * 4 + 0] = 255;//red
        frame.data[i * 4 + 1] = 255;	//green
        frame.data[i * 4 + 2] = 255;//blue
	  }
    }
	this.ctx2.putImageData(frame, 0, 0);
	//end of comic book effect

	return;
  },

  	applyGrayscale: function() {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
	
	//black and white effect
	var frame = this.ctx1.getImageData(0, 0, this.width, this.height);
	var l = frame.data.length / 4;
   for (var i = 0; i < l; i++) {
      var r = frame.data[i * 4 + 0] * .3;
      var g = frame.data[i * 4 + 1] * .59;
      var b = frame.data[i * 4 + 2] * .11;
	  var grayscale = r + g + b;

	  frame.data[i * 4 + 0] = grayscale;//red
      frame.data[i * 4 + 1] = grayscale;//green
      frame.data[i * 4 + 2] = grayscale;//blue
    }
	this.ctx3.putImageData(frame, 0, 0);
	//end of black and white effect

	return;
  },

	  applySepia: function() {
	//sepia effect
	var frame = this.ctx1.getImageData(0, 0, this.width, this.height);
	var l = frame.data.length / 4;

   for (var i = 0; i < l; i++) {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];

	  var ro = (r * .393) + (g *.769) + (b * .189);
	  var go = (r * .349) + (g *.686) + (b * .168);
	  var bo = (r * .272) + (g *.354) + (b * .131);

	  frame.data[i * 4 + 0] = ro;//red
      frame.data[i * 4 + 1] = go;//green
      frame.data[i * 4 + 2] = bo;//blue
    }
	this.ctx4.putImageData(frame, 0, 0);
	//end of sepia effect
	return;
  },

	applyGreenScreen: function() {
	//green screen effect
	var frame = this.ctx1.getImageData(0, 0, this.width, this.height);
	var l = frame.data.length / 4;
	for (var i = 0; i < l; i++) {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];
	  if (g > 100 && r > 100 && b < 43)
		  frame.data[i * 4 + 3] = 0;
    }
	this.ctx5.putImageData(frame, 0, 0);
	//end of green screen effect
	return;
  },

	applyFlip: function() {
	//flip effect
	this.ctx6.translate(this.width, this.height);
    this.ctx6.rotate(Math.PI); //flip video
    this.ctx6.drawImage(this.video, 0, 0, this.width, this.height);
	this.ctx6.translate(this.width, this.height); //flip video
	//end of flip effect
	return;
  },
	
	applyNegative: function() {
	//negative effect
   var frame = this.ctx1.getImageData(0, 0, this.width, this.height);
	var l = frame.data.length / 4;
   for (var i = 0; i < l; i++) {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];
	  var o = frame.data[i * 4 + 3];

	  frame.data[i * 4 + 0] = 255 - r;//red
      frame.data[i * 4 + 1] = 255 - g;//green
      frame.data[i * 4 + 2] = 255 - b;//blue
    }
	this.ctx7.putImageData(frame, 0, 0);
	//end of negative effect
	return;
  },

	applyInterlace: function() {
	//interlaced effect
	this.ctx8.drawImage(this.video, 0, 0, this.width, this.height);
	this.ctx8.fillStyle = "rgba(0, 0, 0, 0.7)";
	for (var i = 0; i < this.height; i = i + 3) {
		this.ctx8.fillRect (0, i, this.width, 1.5);
	}
	//end of interlaced effect
	return;
  },
	applyChannel: function() {
	//multiple channels effect
	this.ctx9.drawImage(this.video, 0, 0, this.width, this.height);
	this.ctx10.drawImage(this.video, 0, 0, this.width/2, this.height/2);
	//end of multiple channels effect
	return;
  },
};