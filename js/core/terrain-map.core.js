class TerrainMapCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.width = 1000;
        this.height = 1000;

        this.data = []; // to save json data
        this.polygons = []; // to save polygons data (after process json data)

        Helper.Other.setValueFromConfig(this, config);

        // process data
        this.processData();
    }

    processData() {
        for (let poly of this.data) {
            this.polygons.push({
                path: poly.map((point) => ({ x: point[0], y: point[1] })),
                bound: Helper.Boundary.polygon(poly),
            });
        }
    }

    effect(champion) {
        let data = this.getTerrainsNearChampion(champion);

        let response = new SAT.Response();
        let collided = false;

        for (let poly of data) {
            // hight light
            fill("#fff9");
            beginShape();
            for (let p of poly.path) {
                vertex(p.x, p.y);
            }
            endShape(CLOSE);

            fill("#ff52");
            rect(poly.bound.x, poly.bound.y, poly.bound.w, poly.bound.h);
            // end hight light

            response.clear();

            let SATcollided = SAT.testPolygonCircle(
                new SAT.Polygon(
                    new SAT.Vector(),
                    poly.path.map((p) => new SAT.Vector(p.x, p.y))
                ),
                champion.getSATBody(),
                response
            );

            if (SATcollided) {
                champion.position.x += response.overlapV.x;
                champion.position.y += response.overlapV.y;

                collided = true;
            }
        }

        return collided;
    }

    show(camera) {
        let data = this.getTerrainsInView(camera);

        strokeWeight(3);
        stroke("#fff6");
        fill("#555");

        for (let poly of data) {
            beginShape();
            for (let p of poly.path) {
                vertex(p.x, p.y);
            }
            endShape(CLOSE);
        }
    }

    getTerrainsInRectagleRange({ x, y, w, h }) {
        let result = [];
        for (let poly of this.polygons) {
            let { x: x2, y: y2, w: w2, h: h2 } = poly.bound;
            let intersect = Helper.Collide.rectRect(x, y, w, h, x2, y2, w2, h2);

            if (intersect) {
                result.push(poly);
            }
        }

        return result;
    }

    getTerrainsInView(camera) {
        let topleft = camera.canvasToWorld(0, 0);
        let bottomright = camera.canvasToWorld(width, height);

        let data = this.getTerrainsInRectagleRange({
            x: topleft.x,
            y: topleft.y,
            w: bottomright.x - topleft.x,
            h: bottomright.y - topleft.y,
        });

        return data;
    }

    getTerrainsNearChampion(champion) {
        let bound = {
            x: champion.position.x - champion.radius - champion.speed / 2,
            y: champion.position.y - champion.radius - champion.speed / 2,
            w: champion.radius * 2 + champion.speed,
            h: champion.radius * 2 + champion.speed,
        };

        let data = this.getTerrainsInRectagleRange(bound);

        // hight light
        fill("#ff52");
        rect(bound.x, bound.y, bound.w, bound.h);
        // end hight light

        return data;
    }
}
