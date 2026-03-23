const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight / 2;
const window_width = window.innerWidth / 2;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#ff8";

class Circle {
  constructor(x, y, radius, color, collisionColor, text, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.baseColor = color;          // color normal
    this.collisionColor = collisionColor; // color cuando colisiona
    this.color = color;
    this.text = text;
    this.speed = speed;

    // Dirección aleatoria
    this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
    this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;

    this.isColliding = false;
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();

    context.beginPath();
    context.fillStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.closePath();
  }

  move() {
    // Rebote contra bordes del canvas
    if (this.posX + this.radius >= window_width || this.posX - this.radius <= 0) {
      this.dx = -this.dx;
    }

    if (this.posY + this.radius >= window_height || this.posY - this.radius <= 0) {
      this.dy = -this.dy;
    }

    this.posX += this.dx;
    this.posY += this.dy;
  }

  updateColor() {
    this.color = this.isColliding ? this.collisionColor : this.baseColor;
  }
}

// Cantidad de círculos
const totalCircles = 10;

// Arreglo de círculos
let circles = [];

// Función para generar un número aleatorio entero
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Genera una posición válida para que el círculo no nazca fuera del canvas
function createCircle(index) {
  const radius = random(20, 50);
  const x = random(radius, window_width - radius);
  const y = random(radius, window_height - radius);
  const speed = random(2, 4);

  return new Circle(
    x,
    y,
    radius,
    "blue",
    "red",
    String(index + 1),
    speed
  );
}

// Crear N círculos
for (let i = 0; i < totalCircles; i++) {
  circles.push(createCircle(i));
}

// Detecta colisiones entre todos los círculos
function detectCollisions() {
  // Primero reinicia el estado de colisión
  for (let i = 0; i < circles.length; i++) {
    circles[i].isColliding = false;
  }

  // Compara cada círculo con los demás
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const dx = circles[j].posX - circles[i].posX;
      const dy = circles[j].posY - circles[i].posY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Hay colisión si se tocan o se traslapan
      if (distance <= circles[i].radius + circles[j].radius) {
        circles[i].isColliding = true;
        circles[j].isColliding = true;
      }
    }
  }

  // Actualiza color de cada círculo según colisión
  for (let i = 0; i < circles.length; i++) {
    circles[i].updateColor();
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, window_width, window_height);

  // Mover todos
  for (let i = 0; i < circles.length; i++) {
    circles[i].move();
  }

  // Detectar colisiones después de mover
  detectCollisions();

  // Dibujar todos
  for (let i = 0; i < circles.length; i++) {
    circles[i].draw(ctx);
  }
}

animate();