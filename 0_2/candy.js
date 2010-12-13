var ctx = new Array();
var c = new Array();
var index;
var effect = "normal";
var bg;
var currentLevel=0;

var processor =
{
  timerCallback: function ()
  {
    if (this.video.paused || this.video.ended)
    {
      return;
    }

    this.ctx.drawImage(this.video, 0, 0, this.width, this.height);

    for (index = 0, l = c.length; index < l; index++)
    {
var effect2 = (String)(c[index].getAttribute('data-apply-effect')).split("|");
      switch (effect2[0])
      {
      case "interlace":
        this.applyInterlace(ctx, index);
        break;
      case "comic":
        this.applyComic(ctx, index);
        break;
      case "grayscale":
        this.applyGrayscale(ctx, index);
        break;
      case "sepia":
        this.applySepia(ctx, index);
        break;
      case "greenscreen":
        this.applyGreenScreen(ctx, index, effect2[1]);
//alert(effect2[1]);
        break;
      case "flip":
        this.applyFlip(ctx, index);
        break;
      case "negative":
        this.applyNegative(ctx, index);
        break;
      case "bright":
        this.applyBright(ctx, index, effect2[1]);
        break;
      default:
        this.applyNormal(ctx, index);
      }
    }

    var self = this;
    setTimeout(function ()
    {
      self.timerCallback();
    }, 0);
  },

  doLoad: function ()
  {
    this.video = document.getElementById("video");
    c = document.getElementsByTagName('canvas');

    this.candy = document.getElementById("candy");
    this.ctx = this.candy.getContext("2d");

    for (index = 0, l = c.length; index < l; index++)
    {
      ctx[index] = c[index].getContext("2d");
    }

    var self = this;
    this.video.addEventListener("play", function ()
    {
      self.width = self.video.videoWidth / 2;
      self.height = self.video.videoHeight / 2;
      self.timerCallback();
    }, false);
  },
  
  applyNormal: function (ctx, index)
  {
    //normal video
    ctx[index].drawImage(this.video, 0, 0, this.width, this.height);
    //end of normal video
    return;
  },
  
  applyInterlace: function (ctx, index)
  {
    //interlaced effect
    ctx[index].drawImage(this.video, 0, 0, this.width, this.height);
    ctx[index].fillStyle = "rgba(0, 0, 0, 0.7)";
    for (var i = 0; i < this.height; i = i + 3)
    {
      ctx[index].fillRect(0, i, this.width, 1.5);
    }
    //end of interlaced effect
    return;
  },

  applyComic: function (ctx, index)
  {
    //comic book effect
    var frame = this.ctx.getImageData(0, 0, this.width, this.height);
    var l = frame.data.length / 4;
    for (var i = 0; i < l; i++)
    {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];
      if (g < 125 && r < 125 && b < 125) //range of color on shirt
      {
        frame.data[i * 4 + 0] = 0; //red
        frame.data[i * 4 + 1] = 0; //green
        frame.data[i * 4 + 2] = 0; //blue
      }
      if (g >= 125 && r >= 125 && b >= 125) //range of color on shirt
      {
        frame.data[i * 4 + 0] = 255; //red
        frame.data[i * 4 + 1] = 255; //green
        frame.data[i * 4 + 2] = 255; //blue
      }
    }
    ctx[index].putImageData(frame, 0, 0);
    //end of comic book effect*/
    return;
  },

  applyGrayscale: function (ctx, index)
  {
    //black and white effect
    var frame = this.ctx.getImageData(0, 0, this.width, this.height);
    var l = frame.data.length / 4;
    for (var i = 0; i < l; i++)
    {
      var r = frame.data[i * 4 + 0] * .3;
      var g = frame.data[i * 4 + 1] * .59;
      var b = frame.data[i * 4 + 2] * .11;
      var grayscale = r + g + b;

      frame.data[i * 4 + 0] = grayscale; //red
      frame.data[i * 4 + 1] = grayscale; //green
      frame.data[i * 4 + 2] = grayscale; //blue
    }
    ctx[index].putImageData(frame, 0, 0);
    //end of black and white effect

    return;
  },

  applySepia: function (ctx, index)
  {
    //sepia effect
    var frame = this.ctx.getImageData(0, 0, this.width, this.height);
    var l = frame.data.length / 4;

    for (var i = 0; i < l; i++)
    {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];

      var ro = (r * .393) + (g * .769) + (b * .189);
      var go = (r * .349) + (g * .686) + (b * .168);
      var bo = (r * .272) + (g * .354) + (b * .131);

      frame.data[i * 4 + 0] = ro; //red
      frame.data[i * 4 + 1] = go; //green
      frame.data[i * 4 + 2] = bo; //blue
    }
    ctx[index].putImageData(frame, 0, 0);
    //end of sepia effect
    return;
  },

  applyGreenScreen: function (ctx, index, img)
  {
    //green screen effect
    var frame = this.ctx.getImageData(0, 0, this.width, this.height);
    var l = frame.data.length / 4;
    for (var i = 0; i < l; i++)
    {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];
      if (g > 100 && r > 100 && b < 43) frame.data[i * 4 + 3] = 0;
    }

    ctx[index].putImageData(frame, 0, 0);
var imgURL = 'url(' + img + ')';
c[index].style.backgroundImage = imgURL;
//c[index].style.backgroundColor = 'red';
    //end of green screen effect
    return;
  },

  applyFlip: function (ctx, index)
  {
    //flip effect
    ctx[index].translate(this.width, this.height);
    ctx[index].rotate(Math.PI); //flip video
    ctx[index].drawImage(this.video, 0, 0, this.width, this.height);
    ctx[index].translate(this.width, this.height); //flip video
    //end of flip effect
    return;
  },

  applyNegative: function (ctx, index)
  {
    //negative effect
    var frame = this.ctx.getImageData(0, 0, this.width, this.height);
    var l = frame.data.length / 4;
    for (var i = 0; i < l; i++)
    {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];
      var o = frame.data[i * 4 + 3];

      frame.data[i * 4 + 0] = 255 - r; //red
      frame.data[i * 4 + 1] = 255 - g; //green
      frame.data[i * 4 + 2] = 255 - b; //blue
    }
    ctx[index].putImageData(frame, 0, 0);
    //end of negative effect
    return;
  },

  applyBright: function (ctx, index, level)
  {
    //bright effect
    var frame = this.ctx.getImageData(0, 0, this.width, this.height);
    var l = frame.data.length/4;

    for (var i = 0; i < l; i++)
    {
      var r = frame.data[i * 4 + 0];
      var g = frame.data[i * 4 + 1];
      var b = frame.data[i * 4 + 2];

var ro = r;
var go = g;
var bo = b;

if (level ==3) {
ro += 105;
go += 105;
bo += 105;
}
else if (level == 1) {
ro += 35;
go += 35;
bo += 35;
}
else if (level == 2) {
ro += 70;
go += 70;
bo += 70;
}
else if (level ==3) {
ro += 105;
go += 105;
bo += 105;
}
else if (level == -1) {
ro -= 35;
go -= 35;
bo -= 35;
}
else if (level == -2) {
ro -= 70;
go -= 70;
bo -= 70;
}
else if (level == -3) {
ro -= 105;
go -= 105;
bo -= 105;
}

      frame.data[i * 4 + 0] = ro; //red
      frame.data[i * 4 + 1] = go; //green
      frame.data[i * 4 + 2] = bo; //blue
    }
    ctx[index].putImageData(frame, 0, 0);
    //end of bright effect
    return;
  },
  
  brighten: function (canvas)
  {
   if (currentLevel <= 3) {
document.getElementById(canvas.id).setAttribute("data-apply-effect","bright|" + currentLevel);
}
else {currentLevel=3}
    return;
  },
  darken: function (canvas)
  {
   if (currentLevel >= -3) {
document.getElementById(canvas.id).setAttribute("data-apply-effect","bright|" + currentLevel);
}
else {currentLevel = -3}
    return;
  },
  
  
  changeEffect: function (canvas, effect)
  {
    document.getElementById(canvas.id).setAttribute("data-apply-effect",effect);
    return;
  },


};