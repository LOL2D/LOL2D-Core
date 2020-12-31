import TERRAIN_TYPE from "../constant/terrain-map.constant.js";
import Helper from "../helper/index.js";

export default class TerrainMapCore {
    constructor(config = {}) {
        this.position = createVector(0, 0);
        this.width = 1000;
        this.height = 1000;

        this.jsonData = {
            wall: [],
            brush: [],
            water: [],
            turret1: [],
            turret2: [],
        };

        this.polygons = []; // to save polygons data (after process json data)
        /*
            structure of polygons:
            polygons = [
                {
                    type: "..."
                    path: [...],
                    bound: {x:..., y:..., w:..., h:...},
                }, 
                ...
            ]
         */

        Helper.Other.setValueFromConfig(this, config);

        // process data
        this.polygons = this.jsonDataToPolygon(this.jsonData);
    }

    jsonDataToPolygon(jsonData) {
        let { WALL, BRUSH, WATER, TURRET } = TERRAIN_TYPE;

        let result = [];
        result.push(...this.jsonArrayToPolygon(jsonData.wall, WALL));
        result.push(...this.jsonArrayToPolygon(jsonData.brush, BRUSH));
        result.push(...this.jsonArrayToPolygon(jsonData.water, WATER));
        result.push(...this.jsonArrayToCircle(jsonData.turret1, 50, TURRET));
        result.push(...this.jsonArrayToCircle(jsonData.turret2, 50, TURRET));

        return result;
    }

    jsonArrayToCircle(jsonArr, radius, type) {
        // use for turret
        let result = [];
        for (let circlePos of jsonArr) {
            result.push({
                type,
                radius,
                position: { x: circlePos[0], y: circlePos[1] },
                bound: Helper.Boundary.circle({
                    x: circlePos[0],
                    y: circlePos[1],
                    radius,
                }),
            });
        }
        return result;
    }

    jsonArrayToPolygon(jsonArr, type) {
        // use for wall, brush, water
        let result = [];
        for (let polyArr of jsonArr) {
            result.push({
                type,
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
        if (!champion.isCheckCollideTerrain) return;

        let data = this.getTerrainsNearChampion(champion, [
            TERRAIN_TYPE.WALL,
            TERRAIN_TYPE.TURRET,
        ]);

        let SATcollided;
        let response = new SAT.Response();
        let collided = false;

        for (let terrain of data) {
            response.clear();

            if (terrain.type == TERRAIN_TYPE.TURRET) {
                SATcollided = SAT.testCircleCircle(
                    new SAT.Circle(
                        new SAT.Vector(terrain.position.x, terrain.position.y),
                        terrain.radius
                    ),
                    champion.getSATBody(),
                    response
                );
            } else if (terrain.type == TERRAIN_TYPE.WALL) {
                SATcollided = SAT.testPolygonCircle(
                    new SAT.Polygon(
                        new SAT.Vector(),
                        terrain.path.map((p) => new SAT.Vector(p.x, p.y))
                    ),
                    champion.getSATBody(),
                    response
                );
            }

            if (SATcollided) {
                champion.position.x += response.overlapV.x;
                champion.position.y += response.overlapV.y;

                collided = true;
            }
        }

        return collided;
    }

    show(camera) {
        let data = this.getTerrainsInView(camera, [
            TERRAIN_TYPE.WALL,
            TERRAIN_TYPE.BRUSH,
            TERRAIN_TYPE.WATER,
        ]);

        strokeWeight(5);

        // water
        noStroke();
        fill("#082740");
        for (let terrain of data) {
            if (terrain.type == TERRAIN_TYPE.WATER) {
                beginShape();
                for (let p of terrain.path) {
                    vertex(p.x, p.y);
                }
                endShape(CLOSE);
            }
        }

        // brush
        stroke("#107d49");
        fill("#10613a");
        for (let terrain of data) {
            if (terrain.type == TERRAIN_TYPE.BRUSH) {
                beginShape();
                for (let p of terrain.path) {
                    vertex(p.x, p.y);
                }
                endShape(CLOSE);
            }
        }

        // wall
        stroke("#555");
        fill("#555");
        for (let terrain of data) {
            if (terrain.type == TERRAIN_TYPE.WALL) {
                beginShape();
                for (let p of terrain.path) {
                    vertex(p.x, p.y);
                }
                endShape(CLOSE);
            }
        }
    }

    getTerrainsInRectagleRange({ x, y, w, h }, type) {
        let result = [];
        for (let poly of this.polygons) {
            // check type
            if (type) {
                // is array of types
                if (Array.isArray(type)) {
                    let qualified = false;
                    for (let t of type) {
                        if (poly.type == t) {
                            qualified = true;
                            break;
                        }
                    }

                    if (!qualified) continue;
                }

                // is single type
                else if (poly.type != type) {
                    continue;
                }
            }

            // get intersect terrain
            let { x: x2, y: y2, w: w2, h: h2 } = poly.bound;
            let intersect = Helper.Collide.rectRect(x, y, w, h, x2, y2, w2, h2);

            if (intersect) {
                result.push(poly);
            }
        }

        return result;
    }

    getTerrainsInView(camera, type) {
        return this.getTerrainsInRectagleRange(camera.getViewBoundary(), type);
    }

    getTerrainsNearChampion(champion, type) {
        return this.getTerrainsInRectagleRange(champion.getBoundary(), type);
    }

    getTerrainsInSight(champion, type) {
        let bound = champion.getSightBoundary();
        return this.getTerrainsInRectagleRange(bound, type);
    }
}
