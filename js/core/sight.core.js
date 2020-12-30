import TERRAIN_TYPE from "../constant/terrain-map.constant.js";
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
        let { terrainMap } = this.world;

        for (let champ of this.world.champions) {
            if (!champ.isAllyWithPlayer) continue;

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

            // prepare gradient color
            this.prepareRadialGradient(
                champ.position.x,
                champ.position.y,
                champ.sightRadius,
                100
            );

            // show visibility
            this.overlay.beginShape();
            for (let p of viewportVisibility) {
                const pos = this.world.camera.worldToCanvas(p[0], p[1]);
                this.overlay.vertex(pos.x, pos.y);
            }
            this.overlay.endShape(CLOSE);
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

    isChampionInSight(champion) {
        // is ally
        if (champion.isAllyWithPlayer) {
            return true;
        }

        // is enemy
        // find all allies in this enemy sightRange
        let alliesInRange = Helper.Distance.getChampionsInRange({
            rootPosition: champion.position,
            champions: this.world.champions,
            inRange: champion.sightRadius,
            addChampRadiusToRange: true,
            allyWithPlayer: true,
            excludes: [champion],
        });

        // if there is/are ally => return true
        return alliesInRange.length > 0;
    }

    resize(w, h) {
        this.overlay.resizeCanvas(w, h, true);
    }
}
