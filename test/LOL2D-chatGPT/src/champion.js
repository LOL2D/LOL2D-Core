export default class Champion {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.destination = createVector(x, y);
    this.speed = 5;
    this.size = 50;
  }

  update() {
    if (
      this.position.x !== this.destination.x ||
      this.position.y !== this.destination.y
    ) {
      let distance = p5.Vector.dist(this.position, this.destination);
      if (distance <= this.speed) {
        this.position.set(this.destination);
      } else {
        let direction = p5.Vector.sub(this.destination, this.position);
        direction.setMag(this.speed);
        this.position.add(direction);
      }
    }
  }

  draw() {
    fill(255);
    circle(this.position.x, this.position.y, this.size);
  }

  setDestination(x, y) {
    this.destination.set(x, y);
  }
}
