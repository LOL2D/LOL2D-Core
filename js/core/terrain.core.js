class TerrainCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.fillColor = "#555";
        this.strokeColor = "#999";
        this.strokeWeight = 3;
        this.shapeVertices = [];

        Helper.Other.setValueFromConfig(this, config);

        // calculate real vertices base on vertices and shape vertices
        this.vertices = this.shapeVertices.map((v) => ({
            x: v.x + this.position.x,
            y: v.y + this.position.y,
        }));
    }

    effect(champions) {
        for (let champ of champions) {
            let isCollide = Helper.Collide.polyCircle(
                this.vertices,
                champ.position.x,
                champ.position.y,
                champ.radius
            );

            if (isCollide) {
                fill("#9909");
                circle(champ.position.x, champ.position.y, champ.radius * 2.5);
            }
        }
    }

    show() {
        strokeWeight(this.strokeWeight);
        stroke(this.strokeColor);
        fill(this.fillColor);

        beginShape();
        for (let p of this.vertices) {
            vertex(p.x, p.y);
        }
        endShape(CLOSE);
    }
}
