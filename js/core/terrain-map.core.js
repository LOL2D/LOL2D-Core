import Helper from "../helper/index.js";

export default class TerrainMapCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.width = 1000;
        this.height = 1000;

        this.jsonArray = []; // to save json data
        this.polygons = []; // to save polygons data (after process json data)

        Helper.Other.setValueFromConfig(this, config);

        // process data
        this.polygons = this.jsonArrayToPolygon(this.jsonArray);
    }

    jsonArrayToPolygon(jsonArr) {
        let result = [];
        for (let polyArr of jsonArr) {
            result.push({
                path: polyArr.map((point) => ({ x: point[0], y: point[1] })),
                bound: Helper.Boundary.polygon(polyArr),
            });
        }
        return result;
    }

    polygonToJsonArray(polygon) {
        let result = [];

        for (let polyData of polygon) {
            result.push(polyData.path.map((point) => [point.x, point.y]));
        }

        return result;
    }

    effect(champion) {
        let data = this.getTerrainsNearChampion(champion);

        let SATcollided;
        let response = new SAT.Response();
        let collided = false;

        for (let poly of data) {
            response.clear();

            SATcollided = SAT.testPolygonCircle(
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

        strokeWeight(5);
        stroke("#555");
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
        return this.getTerrainsInRectagleRange(camera.getViewBoundary());
    }

    getTerrainsNearChampion(champion) {
        return this.getTerrainsInRectagleRange(champion.getBoundary());
    }

    getTerrainsInSight(champion) {
        let bound = champion.getSightBoundary();
        return this.getTerrainsInRectagleRange(bound);
    }
}
