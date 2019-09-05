var CANVAS = document.getElementById("stars");
var CTX = CANVAS.getContext("2d");
var dpi = window.devicePixelRatio;

CANVAS.setAttribute('width', getComputedStyle(CANVAS).getPropertyValue('width').slice(0, -2));
CANVAS.setAttribute('height', getComputedStyle(CANVAS).getPropertyValue('height').slice(0, -2));
var WIDTH = CANVAS.width;
var HEIGHT = CANVAS.height;

var n_stars = 100;
var speed = 1;
var c_mindist = 150;
var star_size = 3;
var star_color = "#FFFFFF";
var path_color = "#FFFFFF";
var bg_color = "#808080";
var request;

var stars = [];
CANVAS.style.backgroundColor = bg_color;

function random_scale(n) {
  return Math.random() * n;
}

function random_real(n) {
  return (Math.random() < 0.5 ? -1 : 1) * random_scale(n);
}

function e_dist(p1_x, p1_y, p2_x, p2_y) {
  return Math.sqrt(
    Math.pow(p2_x - p1_x, 2) +
    Math.pow(p2_y - p1_y, 2)
  );
}

for (var i = 0; i < n_stars; i++) {
  var s = {
    x: random_scale(WIDTH - star_size) + star_size,
    y: random_scale(HEIGHT - star_size) + star_size,
    v_x: random_real(speed),
    v_y: random_real(speed),
    color: star_color
  };
  stars.push(s);
}

function draw_stars() {

  stars.forEach(s => {
    CTX.beginPath();
    CTX.arc(s.x, s.y, star_size, 0, 2 * Math.PI);
    CTX.fillStyle = CTX.strokeStyle = s.color;
    CTX.fill();

    stars.forEach(ss => {
      d = e_dist(s.x, s.y, ss.x, ss.y)
      if (d <= c_mindist && d > 0) {
        CTX.moveTo(s.x, s.y);
        CTX.strokeStyle = CTX.fillStyle = path_color;
        CTX.lineTo(ss.x, ss.y);
        CTX.stroke();
      }
    });

  });

}


function animate() {
  CTX.canvas.width = CTX.canvas.width;
  stars.forEach(s => {
    if (s.x + s.v_x <= star_size || s.x + s.v_x >= WIDTH - star_size)
      s.v_x *= -1;
    if (s.y + s.v_y <= star_size || s.y + s.v_y >= HEIGHT - star_size)
      s.v_y *= -1;
    s.x += s.v_x;
    s.y += s.v_y;
  });

  draw_stars();

  window.requestAnimationFrame(animate);
}

window.wallpaperPropertyListener = {
  applyUserProperties: function(properties) {
    if (properties.starcolor) {
      star_color = 'rgb(' + properties.starcolor.value.split(' ').map(function (c) {
        return Math.ceil(c * 255);
      }) + ')';
    }
    if (properties.bgcolor) {
      bg_color = 'rgb(' + properties.bgcolor.value.split(' ').map(function (c) {
        return Math.ceil(c * 255);
      }) + ')';
    }
    if (properties.nstars) {
      n_stars = properties.nstars.value;
    }
    if (properties.starsize) {
      star_size = properties.starsize.value;
    }
    if (properties.speed) {
      speed = properties.speed.value;
    }
    if (properties.linelength) {
      c_mindist = properties.c_mindist.value;
    }
  }
};

function load(){
  animate();
}