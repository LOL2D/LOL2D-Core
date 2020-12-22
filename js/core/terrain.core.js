class TerrainCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.fillColor = "#555";
        this.strokeColor = "#0000";
        this.strokeWeight = 3;
        this.rects = [];

        Helper.Other.setValueFromConfig(this, config);

        for (let r of this.rects) {
            r.x += this.position.x;
            r.y += this.position.y;
        }
    }

    collideChampion(champion) {
        for (let r of this.rects) {
            let SATrect = new SAT.Box(new SAT.Vector(r.x, r.y), r.w, r.h);

            let SATcircle = new SAT.Circle(
                new SAT.Vector(champion.position.x, champion.position.y),
                champion.radius
            );

            let response = new SAT.Response();

            let collided = SAT.testPolygonCircle(
                SATrect.toPolygon(),
                SATcircle,
                response
            );

            if (collided) {
                champion.position.x += response.overlapV.x;
                champion.position.y += response.overlapV.y;
            }
        }
    }

    getBoundary() {
        let left = Infinity;
        let bottom = -Infinity;
        let top = Infinity;
        let right = -Infinity;

        for (let r of this.rects) {
            if (r.x < left) {
                left = r.x;
            }
            if (r.x + r.w > right) {
                right = r.x + r.w;
            }
            if (r.y < top) {
                top = r.y;
            }
            if (r.y + r.h > bottom) {
                bottom = r.y + r.h;
            }
        }

        return {
            x: left,
            y: top,
            w: right - left,
            h: bottom - top,
        };
    }

    show(fillColor) {
        strokeWeight(this.strokeWeight);
        stroke(this.strokeColor);
        fill(fillColor || this.fillColor);

        for (let r of this.rects) {
            rect(r.x, r.y, r.w, r.h);
        }
    }
}
