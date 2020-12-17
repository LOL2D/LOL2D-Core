// https://leagueoflegends.fandom.com/wiki/Sight
class SightCore {
    constructor(config = {}) {
        this.overlay = createGraphics(windowWidth, windowHeight);
        this.outOfViewColor = "#000c";
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
        image(this.overlay, width / 2, height / 2);
    }

    drawSights() {
        // default sight of champion
        for (let champ of this.world.champions) {
            if (champ.isAllyWithPlayer) {
                const pos = this.world.camera.worldToCanvas(
                    champ.position.x,
                    champ.position.y
                );

                let r = champ.sightRadius * this.world.camera.scale;
                let innerR = max(0, r - 100 * this.world.camera.scale);
                Helper.Color.createRadialGradient(
                    this.overlay,
                    pos.x,
                    pos.y,
                    innerR,
                    r,
                    this.colorStops
                );
                this.overlay.ellipse(pos.x, pos.y, r * 2);
            }
        }

        // turret sight
        for (let turret of this.world.turrets) {
            if (turret.isAllyWithPlayer) {
                const pos = this.world.camera.worldToCanvas(
                    turret.position.x,
                    turret.position.y
                );

                let r = turret.sightRadius * this.world.camera.scale;
                let innerR = max(0, r - 100 * this.world.camera.scale);
                Helper.Color.createRadialGradient(
                    this.overlay,
                    pos.x,
                    pos.y,
                    innerR,
                    r,
                    this.colorStops
                );
                this.overlay.ellipse(pos.x, pos.y, r * 2);
            }
        }
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
        this.overlay.resizeCanvas(w, h);
    }
}
