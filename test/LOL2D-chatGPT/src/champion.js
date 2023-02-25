export default class Champion {
    constructor(x, y, spells = []) {
        this.destination = createVector(x, y);
        this.spells = spells;

        this.position = createVector(x, y);
        this.color = 150;
        this.speed = 3;
        this.size = 40;
    }

    run() {
        this.update();
        this.draw();
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
        fill(this.color);
        circle(this.position.x, this.position.y, this.size);
    }

    setDestination(x, y) {
        this.destination.set(x, y);
    }

    castSpell(spellIndex) {
        if (this.spells[spellIndex]) {
            this.spells[spellIndex].cast(this.position.x, this.position.y);
        }
    }
}
