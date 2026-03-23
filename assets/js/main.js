(() => {
  let animationId = null;

  window.initMoveSimulation = function (totalCircles = 8) {
    const canvas = document.getElementById("canvasMove");
    const ctx = canvas.getContext("2d");

    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    const parentWidth = canvas.parentElement.clientWidth - 20;
    canvas.width = parentWidth > 250 ? parentWidth : 250;
    canvas.height = 320;

    const width = canvas.width;
    const height = canvas.height;

    class Circle {
      constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;
      }

      draw(context) {
        context.save();

        // Crear gradiente tipo glass
        const gradient = context.createRadialGradient(
          this.posX - this.radius * 0.3,
          this.posY - this.radius * 0.3,
          this.radius * 0.2,
          this.posX,
          this.posY,
          this.radius,
        );

        gradient.addColorStop(0, "rgba(255, 255, 255, 0.6)");
        gradient.addColorStop(1, this.currentColor || this.color);

        // Círculo principal (vidrio)
        context.beginPath();
        context.fillStyle = gradient;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.fill();

        // Borde glass
        context.strokeStyle = "rgba(255,255,255,0.4)";
        context.lineWidth = 2;
        context.stroke();
        context.closePath();

        // Efecto brillo
        context.beginPath();
        context.arc(this.posX - this.radius * 0.3, this.posY - this.radius * 0.3, this.radius * 0.25, 0, Math.PI * 2);
        context.fillStyle = "rgba(255,255,255,0.25)";
        context.fill();
        context.closePath();

        // Texto
        context.beginPath();
        context.fillStyle = "#ffffff";
        context.font = "bold 16px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.text, this.posX, this.posY);
        context.closePath();

        context.restore();
      }

      update(context) {
        if (this.posX + this.radius >= width || this.posX - this.radius <= 0) {
          this.dx = -this.dx;
        }

        if (this.posY + this.radius >= height || this.posY - this.radius <= 0) {
          this.dy = -this.dy;
        }

        this.posX += this.dx;
        this.posY += this.dy;

        this.draw(context);
      }
    }

    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const circles = [];

    for (let i = 0; i < totalCircles; i++) {
      const radius = random(12, 24);
      const x = random(radius, width - radius);
      const y = random(radius, height - radius);
      const speed = random(2, 4);

      circles.push(new Circle(x, y, radius, "#2563eb", String(i + 1), speed));
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < circles.length; i++) {
        circles[i].update(ctx);
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();
  };
})();
