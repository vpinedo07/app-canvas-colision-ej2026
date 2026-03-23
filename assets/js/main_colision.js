(() => {
  let animationId = null;

  window.initCollisionSimulation = function (totalCircles = 8) {
    const canvas = document.getElementById("canvasCollision");
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
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.dy = (Math.random() < 0.5 ? -1 : 1) * this.speed;
        this.isColliding = false;
      }

      draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
        context.fill();
        context.closePath();

        context.beginPath();
        context.fillStyle = "#ffffff";
        context.font = "bold 16px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.text, this.posX, this.posY);
        context.closePath();
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

      circles.push(
        new Circle(x, y, radius, "#0f766e", "#ef4444", String(i + 1), speed)
      );
    }

    function detectCollisions() {
      for (let i = 0; i < circles.length; i++) {
        circles[i].isColliding = false;
        circles[i].color = circles[i].baseColor;
      }

      for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
          if (distance(circles[i], circles[j]) <= circles[i].radius + circles[j].radius) {
            circles[i].isColliding = true;
            circles[j].isColliding = true;
            circles[i].color = circles[i].collisionColor;
            circles[j].color = circles[j].collisionColor;
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < circles.length; i++) {
        circles[i].update(ctx);
      }

      detectCollisions();

      for (let i = 0; i < circles.length; i++) {
        circles[i].draw(ctx);
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();
  };
})();