class TerrainCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.fillColor = "#555";
        this.strokeColor = "#fff6";
        this.strokeWeight = 3;
        this.polygons = [];

        Helper.Other.setValueFromConfig(this, config);

        for (let poly of this.polygons) {
            for (let p of poly) {
                p[0] += this.position.x;
                p[1] += this.position.y;
            }
        }
    }

    collideChampion(champion) {
        for (let poly of this.polygons) {
            let response = new SAT.Response();

            let collided = SAT.testPolygonCircle(
                new SAT.Polygon(
                    new SAT.Vector(),
                    poly.map((p) => new SAT.Vector(p[0], p[1]))
                ),
                champion.getSATBody(),
                response
            );

            if (collided) {
                stroke("yellow");
                line(
                    champion.position.x,
                    champion.position.y,
                    champion.position.x + response.overlapV.x,
                    champion.position.y + response.overlapV.y
                );

                champion.position.x += response.overlapV.x;
                champion.position.y += response.overlapV.y;
            }
        }

        return false;
    }

    getBoundary() {
        let left = Infinity;
        let bottom = -Infinity;
        let top = Infinity;
        let right = -Infinity;

        for (let poly of this.polygons) {
            for (let p of poly) {
                left = min(left, p[0]);
                right = max(right, p[0]);
                top = min(top, p[1]);
                bottom = max(bottom, p[1]);
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
        // noFill();
        fill(fillColor || this.fillColor);

        for (let poly of this.polygons) {
            beginShape();
            for (let p of poly) {
                vertex(p[0], p[1]);
            }
            endShape(CLOSE);
        }

        fill("red");
        noStroke();
        for (let poly of this.polygons) {
            for (let p of poly) {
                circle(p[0], p[1], 10);
            }
        }
    }
}
