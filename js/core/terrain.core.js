class TerrainCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.fillColor = "#555";
        this.strokeColor = "#999";
        this.strokeWeight = 3;
        this.paths = [];

        Helper.Other.setValueFromConfig(this, config);
    }

    show() {
        push();
        translate(this.position.x, this.position.y);

        strokeWeight(this.strokeWeight);
        stroke(this.strokeColor);
        fill(this.fillColor);

        beginShape();
        for (let p of this.paths) {
            vertex(p.x, p.y);
        }
        endShape(CLOSE);

        pop();
    }
}
