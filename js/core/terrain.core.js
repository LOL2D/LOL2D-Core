class TerrainCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.fillColor = "#555";
        this.strokeColor = "#999";
        this.strokeWeight = 3;
        this.rects = [];

        Helper.Other.setValueFromConfig(this, config);

        for (let r of this.rects) {
            r.x += this.position.x;
            r.y += this.position.y;
        }
    }

    effect(champions) {
        // for (let champ of champions) {
        //     let isCollide = Helper.Collide.polyCircle(
        //         this.vertices,
        //         champ.position.x,
        //         champ.position.y,
        //         champ.radius
        //     );
        //     if (isCollide) {
        //         // fill("#9909");
        //         // circle(champ.position.x, champ.position.y, champ.radius * 2.5);
        //     }
        // }
    }

    show() {
        strokeWeight(this.strokeWeight);
        stroke(this.strokeColor);
        fill(this.fillColor);

        for (let r of this.rects) {
            rect(r.x, r.y, r.w, r.h);
        }
    }
}
