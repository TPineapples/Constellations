var CANVAS = document.getElementById("stars");
var CTX = CANVAS.getContext("2d");
var dpi = window.devicePixelRatio;

CANVAS.setAttribute('width', getComputedStyle(CANVAS).getPropertyValue('width').slice(0, -2));
CANVAS.setAttribute('height', getComputedStyle(CANVAS).getPropertyValue('height').slice(0, -2));
var WIDTH = CANVAS.width;
var HEIGHT = CANVAS.height;

var n_stars, speed, c_mindist, star_size, star_color, path_color, bg_color;
var stars = [];

n_stars = 100;
speed = 5;
c_mindist = 150;
star_size = 3;
star_color = "#FFFFFF";
path_color = "#FFFFFF";
bg_color = "#808080";

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

function draw_stars() {

  stars.forEach(s => {
    CTX.beginPath();
    CTX.arc(s.x, s.y, star_size, 0, 2 * Math.PI);
    CTX.fillStyle = CTX.strokeStyle = s.color;
    CTX.fill();

    stars.forEach(ss => {
      d = e_dist(s.x, s.y, ss.x, ss.y);
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
  //CLEAR Canvas
  CTX.canvas.width = CTX.canvas.width;
  CTX.fillStyle = bg_color;
  CTX.fillRect(0,0, WIDTH, HEIGHT);

  //UPDATE star values
  stars.forEach(s => {
    if (s.x + s.v_x <= star_size || s.x + s.v_x >= WIDTH - star_size)
      s.v_x *= -1;
    if (s.y + s.v_y <= star_size || s.y + s.v_y >= HEIGHT - star_size)
      s.v_y *= -1;
    s.x += s.v_x;
    s.y += s.v_y;
    s.color = star_color;
  });

  //DRAW Stars
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
    if (properties.linecolor) {
      path_color = 'rgb(' + properties.linecolor.value.split(' ').map(function (c) {
        return Math.ceil(c * 255);
      }) + ')';
    }
    if (properties.nstars) {
      n_stars = properties.nstars.value;
      // if(n_stars < stars.length){
      //   while(stars.length != n_stars){
      //     stars.pop();
      //   }
      // } else if(n_stars > stars.length){
      //   while(n_stars != stars.length){
      //     n_stars.push({
      //       x: random_scale(WIDTH - star_size) + star_size,
      //       y: random_scale(HEIGHT - star_size) + star_size,
      //       v_x: random_real(speed),
      //       v_y: random_real(speed),
      //       color: star_color
      //     });
      //   }
      // }
      stars = [];
      create_stars(n_stars);
      clear_canvas();
    }
    if (properties.starsize) {
      star_size = properties.starsize.value;
    }
    if (properties.starspeed) {
      speed = properties.starspeed.value;
      stars.forEach(s => {
        s.v_x = random_real(speed);
        s.v_y = random_real(speed);
      });
    }
    if (properties.linelength) {
      c_mindist = properties.linelength.value;
    }
  }
};

function create_stars(n){
  for (var i = 0; i < n; i++) {
    var s = {
      x: random_scale(WIDTH - star_size) + star_size,
      y: random_scale(HEIGHT - star_size) + star_size,
      v_x: random_real(speed),
      v_y: random_real(speed),
      color: star_color
    };
    stars.push(s);
  }
}

function clear_canvas(){
  CTX.canvas.width = CTX.canvas.width;
  CTX.fillStyle = bg_color;
  CTX.fillRect(0,0, WIDTH, HEIGHT);
}

function load(){
  create_stars(n_stars);
  animate();
}