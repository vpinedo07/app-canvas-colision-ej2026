(() => {
  let animationId = null;

  window.initBounceSimulation = function (totalCircles = 8) {
    const canvas = document.getElementById("canvasBounce");
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
      constructor(x, y, radius, color, collisionColor, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.baseColor = color;
        this.collisionColor = collisionColor;
        this.currentColor = color;
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

      move() {
        if (this.posX + this.radius >= width || this.posX - this.radius <= 0) {
          this.dx = -this.dx;
        }

        if (this.posY + this.radius >= height || this.posY - this.radius <= 0) {
          this.dy = -this.dy;
        }

        this.posX += this.dx;
        this.posY += this.dy;
      }
    }

    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function distance(c1, c2) {
      const dx = c2.posX - c1.posX;
      const dy = c2.posY - c1.posY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    const circles = [];

    for (let i = 0; i < totalCircles; i++) {
      const radius = random(12, 24);
      const x = random(radius, width - radius);
      const y = random(radius, height - radius);
      const speed = random(2, 4);

      circles.push(new Circle(x, y, radius, "#7c3aed", "#f97316", String(i + 1), speed));
    }

    function resolveCollisions() {
      for (let i = 0; i < circles.length; i++) {
        circles[i].currentColor = circles[i].baseColor;
      }

      for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
          const c1 = circles[i];
          const c2 = circles[j];
          const dist = distance(c1, c2);
          const minDist = c1.radius + c2.radius;

          if (dist <= minDist) {
            c1.currentColor = c1.collisionColor;
            c2.currentColor = c2.collisionColor;

            const tempDx = c1.dx;
            const tempDy = c1.dy;

            c1.dx = c2.dx;
            c1.dy = c2.dy;

            c2.dx = tempDx;
            c2.dy = tempDy;

            const overlap = minDist - dist;

            let nx = 1;
            let ny = 0;

            if (dist !== 0) {
              nx = (c2.posX - c1.posX) / dist;
              ny = (c2.posY - c1.posY) / dist;
            }

            c1.posX -= nx * (overlap / 2);
            c1.posY -= ny * (overlap / 2);

            c2.posX += nx * (overlap / 2);
            c2.posY += ny * (overlap / 2);
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < circles.length; i++) {
        circles[i].move();
      }

      resolveCollisions();

      for (let i = 0; i < circles.length; i++) {
        circles[i].draw(ctx);
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();
  };
})();
