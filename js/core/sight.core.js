import TERRAIN_TYPE from "../constant/terrain-map.constant.js";
import GlobalGameConfig from "../global/game-config.global.js";
import Helper from "../helper/index.js";

// https://leagueoflegends.fandom.com/wiki/Sight
export default class SightCore {
    constructor(config = {}) {
        this.overlay = createGraphics(windowWidth, windowHeight);
        this.outOfViewColor = "#0008";
        this.world = null;

        this.colorStops = [
            { stop: 0, color: "#fff" },
            { stop: 1, color: "#0001" },
        ];

        Helper.Other.setValueFromConfig(this, config);
    }

    update() {
        let { terrainMap } = this.world;

        for (let champ of this.world.champions) {
            let polygonsInSight = terrainMap.getTerrainsInSight(champ, [
                TERRAIN_TYPE.WALL,
                TERRAIN_TYPE.BRUSH,
                // TERRAIN_TYPE.TURRET,
            ]);

            // check if champ is in brush
            for (let i = polygonsInSight.length - 1; i > 0; i--) {
                if (
                    polygonsInSight[i].type == TERRAIN_TYPE.BRUSH &&
                    Helper.Collide.polyPoint(
                        polygonsInSight[i].path,
                        champ.position.x,
                        champ.position.y
                    )
                )
                    polygonsInSight.splice(i, 1);
            }

            polygonsInSight = terrainMap.polygonToJsonArray(polygonsInSight);

            let sightBound = champ.getSightBoundary();
            let sourcelight = [champ.position.x, champ.position.y];

            // calculate visibility
            let segments = VisibilityPolygon.convertToSegments(polygonsInSight);
            segments = VisibilityPolygon.breakIntersections(segments);

            let viewportVisibility = VisibilityPolygon.computeViewport(
                sourcelight,
                segments,
                [sightBound.x, sightBound.y],
                [sightBound.x + sightBound.w, sightBound.y + sightBound.h]
            );

            // calculate vertices polygon
            // let vertices = [];
            // let pos;
            // for (let p of viewportVisibility) {
            //     pos = this.world.camera.worldToCanvas(p[0], p[1]);
            //     vertices.push([pos.x, pos.y]);
            // }

            champ.visibility = viewportVisibility;

            // calculate champions in sight
            champ.championsInSight = this.getAllChampionsInSightOf(champ);
        }
    }

    draw() {
        // clear overlay with overlay color
        this.overlay.clear();
        this.overlay.background(this.outOfViewColor);

        // start erase overlay color in sight-area
        this.overlay.erase();
        this.overlay.noStroke();
        this.drawSights();
        this.overlay.noErase();

        // show overlay
        image(this.overlay, width * 0.5, height * 0.5);
    }

    drawSights() {
        // default sight of champion
        // for (let champ of this.world.champions) {
        //     if (!champ.isAllyWithPlayer) continue;

        //     this.drawCircleSight(
        //         champ.position.x,
        //         champ.position.y,
        //         champ.sightRadius
        //     );
        // }

        // turret sight
        for (let turret of this.world.turrets) {
            if (!turret.isAllyWithPlayer) continue;

            this.drawCircleSight(
                turret.position.x,
                turret.position.y,
                turret.sightRadius
            );
        }

        // ===================== visibility ========================
        for (let champ of this.world.champions) {
            if (!champ.isAllyWithPlayer) continue;

            // prepare gradient color
            this.prepareRadialGradient(
                champ.position.x,
                champ.position.y,
                champ.sightRadius,
                100
            );

            // show visibility
            this.overlay.beginShape();
            for (let p of champ.visibility) {
                let pos = this.world.camera.worldToCanvas(p[0], p[1]);
                this.overlay.vertex(pos.x, pos.y);
            }
            this.overlay.endShape(CLOSE);
        }

        // debug
        if (GlobalGameConfig.debugSight) {
            stroke("white");
            noFill();

            this.world.camera.beginState();

            beginShape();
            for (let p of this.world.player.visibility) {
                vertex(p[0], p[1]);
            }
            endShape(CLOSE);

            this.world.camera.endState();
        }
    }

    drawCircleSight(_x, _y, _r) {
        const { x, y, r } = this.prepareRadialGradient(_x, _y, _r, 100);

        this.overlay.ellipse(x, y, r * 2);
    }

    prepareRadialGradient(x, y, r, rRing) {
        let pos = this.world.camera.worldToCanvas(x, y);
        let radius = r * this.world.camera.scale;
        let innerR = max(0, radius - rRing * this.world.camera.scale);

        Helper.Color.createRadialGradient(
            this.overlay,
            pos.x,
            pos.y,
            innerR,
            radius,
            this.colorStops
        );

        // return to reuse
        return {
            x: pos.x,
            y: pos.y,
            r: radius,
        };
    }

    getAllChampionsInSightOf(champion) {
        let result = [];

        for (let otherChamp of this.world.champions) {
            // remove self
            // if (otherChamp == champion) continue;

            // if out-of-sight-radius => use 'continue' to increase performance
            let distChamp = p5.Vector.dist(
                otherChamp.position,
                champion.position
            );
            let outOfChampSight =
                distChamp > champion.sightRadius + otherChamp.radius;

            if (outOfChampSight) continue;

            // check visibility
            decomp.makeCCW(champion.visibility);
            let decompVisibility = decomp.quickDecomp(champion.visibility);

            let SATpolygon;
            let SATchamp = new SAT.Vector(
                otherChamp.position.x,
                otherChamp.position.y
            );

            for (let poly of decompVisibility) {
                SATpolygon = new SAT.Polygon(
                    new SAT.Vector(),
                    poly.map((p) => new SAT.Vector(p[0], p[1]))
                );

                let overlap = SAT.pointInPolygon(SATchamp, SATpolygon);

                if (overlap) {
                    result.push(otherChamp);
                    break;
                }
            }
        }

        return result;
    }

    // TODO use quadtree
    getAllChampionsCanSeeOf(champion) {
        // get all champions in sight of this champion
        let result = [...champion.championsInSight];

        for (let otherChamp of this.world.champions) {
            // is ally ?
            if (otherChamp.isAllyWithPlayer == champion.isAllyWithPlayer) {
                // add ally to result array
                if (result.indexOf(otherChamp) < 0) {
                    result.push(otherChamp);
                }
                // combine ally's championsInSight to result array
                for (let c of otherChamp.championsInSight) {
                    if (result.indexOf(c) < 0) {
                        result.push(c);
                    }
                }
            }

            // is enemy ?
            else {
                // prevent duplicate
                if (result.indexOf(otherChamp) >= 0) {
                    continue;
                }

                // check in turret sight radius
                for (let t of this.world.turrets) {
                    if (t.isAllyWithPlayer == champion.isAllyWithPlayer) {
                        let distTurret = p5.Vector.dist(
                            otherChamp.position,
                            t.position
                        );
                        if (distTurret < t.sightRadius) {
                            result.push(otherChamp);
                            break;
                        }
                    }
                }
            }
        }

        return result;
    }

    resize(w, h) {
        this.overlay.resizeCanvas(w, h, true);
    }
}
