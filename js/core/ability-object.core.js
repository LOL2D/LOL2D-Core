class AbilityObjectCore extends MovementObjectCore {
    constructor(config = {}) {
        super(config);

        // default value
        this.owner = null;
        this.isStarted = false;
        this.finished = false; // flag
        this.effectRadius = 0;
        this.isShowEffectRadius = false;

        Helper.Other.setValueFromConfig(this, config);
    }

    run() {
        if (!this.isStarted) {
            this.onStarted();
            this.isStarted = true;
        }

        this.move();
        this.isShowEffectRadius && this.showEffectRadius();
        this.show();

        if (this.checkFinished() || this.finished) {
            this.onFinished();
            this.finished = true;
        }
    }

    showEffectRadius() {
        stroke(COLOR.ABILITY.PREVIEW.BORDER);
        fill(COLOR.ABILITY.PREVIEW.FILL);
        strokeWeight(3);
        circle(this.position.x, this.position.y, this.effectRadius * 2);
    }

    getEnemyInRange(champions, inRange, addChampRadiusToRange) {
        let champsInRange = [];

        for (let champ of champions) {
            let distance = p5.Vector.dist(this.position, champ.position);
            let range = addChampRadiusToRange
                ? inRange + champ.radius
                : inRange;

            if (distance < range) {
                champsInRange.push(champ);
            }
        }

        return champsInRange;
    }

    getClosestEnemy(champions) {
        let closestChamp = null;
        let closestDistance = Infinity;

        for (let champ of champions) {
            if (champ != this.owner) {
                let distance = p5.Vector.dist(champ.position, this.position);
                if (distance < closestDistance) {
                    closestChamp = champ;
                    closestDistance = distance;
                }
            }
        }

        return closestChamp;
    }

    getClosestEnemyInRange(champions, inRange, addChampRadiusToRange) {
        return this.getClosestEnemy(
            this.getEnemyInRange(champions, inRange, addChampRadiusToRange)
        );
    }

    onStarted() {}
    onFinished() {}
    checkFinished() {}
    effectChampions() {}
    effectAbilities() {}
}
