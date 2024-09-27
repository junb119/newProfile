// about
var wallPattern = {
  // Settings
  spacingX: 55,
  spacingY: 35,
  offsetVariance: 13,
  baseRadius: 55,

  // Other Globals
  points: [],
  canvas: null,
  context: null,

  init: function () {
    this.canvas = document.getElementById("about_bg");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.preparePoints();
    this.createPattern();
  },

  preparePoints: function () {
    var width, height, i, j, k, offsetX, offsetY;
    var maxVariance = this.offsetVariance * 2;

    // Vertical spacing
    for (i = this.spacingY; i < this.canvas.height; i += this.spacingY) {
      var pointSet = [];

      // Horizontal spacing
      for (j = this.spacingX; j < this.canvas.width; j += this.spacingX) {
        offsetX = Math.round(Math.random() * maxVariance - this.offsetVariance);
        offsetY = Math.round(Math.random() * maxVariance - this.offsetVariance);
        var offsetR = Math.round(
          Math.random() * maxVariance - this.offsetVariance
        );

        pointSet.push({
          x: j + offsetX,
          y: i + offsetY,
          radius: this.baseRadius + offsetR,
        });
      }

      this.points.push(this.shuffleArray(pointSet));
    }
  },

  createPattern: function () {
    var i, j, k, currentPoints, currentPoint;

    for (i = 0; i < this.points.length; i++) {
      currentPoints = this.points[i];

      for (j = 0; j < currentPoints.length; j++) {
        currentPoint = currentPoints[j];
        for (k = currentPoint.radius; k > 0; k -= 3) {
          this.context.beginPath();
          this.context.arc(
            currentPoint.x,
            currentPoint.y,
            k,
            0,
            Math.PI * 2,
            true
          );
          this.context.closePath();
          this.context.fillStyle = "#ffffff";
          this.context.strokeStyle = "#9FCFE3";
          this.context.fill();
          this.context.stroke();
        }
      }
    }
  },

  // Shuffle algorithm from: http://stackoverflow.com/questions/962802/is-it-correct-to-use-javascript-array-sort-method-for-shuffling
  shuffleArray: function (array) {
    var tmp,
      current,
      top = array.length;

    if (top)
      while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
      }

    return array;
  },
};

wallPattern.init();
// about

// skill
var canvas = document.getElementById("skill_bg"),
  ctx = canvas.getContext("2d"),
  twopi = Math.PI * 2,
  parts = [],
  sizeBase,
  cw,
  ch,
  opt,
  hue,
  count,
  fps = 30, // FPS 제한
  now,
  then = Date.now(),
  interval = 1000 / fps,
  delta;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function hsla(h, s, l, a) {
  return "hsla(" + h + "," + s + "%," + l + "%," + a + ")";
}

function createParticles() {
  sizeBase = cw + ch;
  parts.length = 0;
  count = Math.floor((cw + ch) * 0.02); // 파티클 수 줄이기
  for (var i = 0; i < count; i++) {
    parts.push({
      radius: rand(1, sizeBase * 0.03),
      x: rand(0, cw),
      y: rand(0, ch),
      angle: rand(0, twopi),
      vel: rand(.5, 5), // 속도 감소
      tick: rand(0, 10000),
      color: hsla(rand(0, 360), 70, 50, 0.3), // 파티클 색상 캐시
    });
  }
}

function init() {
  resize();
  createParticles();
  loop();
}

function loop() {
  requestAnimationFrame(loop);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);

    ctx.clearRect(0, 0, cw, ch);

    var i = parts.length;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#fff";
    while (i--) {
      var part = parts[i];

      part.x += Math.cos(part.angle) * part.vel;
      part.y += Math.sin(part.angle) * part.vel;
      part.angle += rand(-0.05, 0.05);

      ctx.beginPath();
      ctx.arc(part.x, part.y, part.radius, 0, twopi);
      ctx.fillStyle = part.color;
      ctx.fill();

      // 경계를 넘는 경우 화면 반대편으로 이동
      if (part.x - part.radius > cw) {
        part.x = -part.radius;
      }
      if (part.x + part.radius < 0) {
        part.x = cw + part.radius;
      }
      if (part.y - part.radius > ch) {
        part.y = -part.radius;
      }
      if (part.y + part.radius < 0) {
        part.y = ch + part.radius;
      }

      part.tick++;
    }
  }
}

function resize() {
  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
  createParticles();
  wallPattern.init();
}

window.addEventListener("resize", resize);
init();

// var colors = [
//   [107, 99, 170],
//   [82, 181, 82],
//   [177, 89, 114],
//   [45, 175, 230],
//   [189, 74, 189],
//   [189, 122, 54],
// ];

// var step = 0;
// var colorIndices = [0, 1, 2, 3];
// var gradientSpeed = 0.005;
