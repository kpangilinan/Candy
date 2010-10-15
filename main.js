let processor = {
  timerCallback: function() {
    if (this.video.paused || this.video.ended) {
      return;
    }
    this.computeFrame();
    let self = this;
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
    let self = this;
    this.video.addEventListener("play", function() {
        self.width = self.video.videoWidth / 2;
        self.height = self.video.videoHeight / 2;
        self.timerCallback();
      }, false);
  },

  computeFrame: function() {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
	this.ctx2.drawImage(this.video, 0, 0, this.width, this.height);
    let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
		let l = frame.data.length / 4;

    for (let i = 0; i < l; i++) {
      let r = frame.data[i * 4 + 0];
      let g = frame.data[i * 4 + 1];
      let b = frame.data[i * 4 + 2];
	  if (g < 125 && r < 125 && b < 125) //range of color on shirt
	  {
		//change to any color: http://en.wikipedia.org/wiki/Web_colors
		frame.data[i * 4 + 0] = 0;//red
        frame.data[i * 4 + 1] = 0;	//green
        frame.data[i * 4 + 2] = 0;//blue
	  }
	  if (g >= 125 && r >= 125 && b >= 125) //range of color on shirt
	  {
		//change to any color: http://en.wikipedia.org/wiki/Web_colors
		frame.data[i * 4 + 0] = 255;//red
        frame.data[i * 4 + 1] = 255;	//green
        frame.data[i * 4 + 2] = 255;//blue
	  }
    }

   this.ctx3.putImageData(frame, 0, 0);
    return;
  }
};