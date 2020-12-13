class FoxFire extends AbilityCore {
    constructor(config = {}) {
        super(config);

        this.cooldown = 1000;
        this.castTime = 250;
        this.effectRadius = 350;
        this.speed = 15;
        this.cost = 65; // Mana
        this.damage = 40;

        this.foxFireCount = 3;
        this.foxFireRotateRadius = this.owner.radius;
        this.lastEffectTime = 0;
        this.nextEffectDelay = 400;
    }

    // override
    preview() {
        stroke(COLOR.ABILITY.PREVIEW.BORDER);
        fill(COLOR.ABILITY.PREVIEW.FILL);
        strokeWeight(3);

        circle(
            this.owner.position.x,
            this.owner.position.y,
            this.effectRadius * 2
        );
    }

    // override
    castSpell(destination) {
        super.castSpell();

        let listFireFoxObjects = [];

        for (let i = 0; i < this.foxFireCount; i++) {
            listFireFoxObjects.push(
                new FoxFireObject({
                    angle: (360 / this.foxFireCount) * i,
                    owner: this.owner,
                    damage: this.damage,
                    speed: this.speed,
                    effectRadius: this.effectRadius,
                    abilityRef: this,
                })
            );
        }

        this.owner.world.addNewSpellObjects(listFireFoxObjects);
    }

    // override
    onStarted() {
        // this.speedTemp = this.owner.speed;
        // this.owner.speed += 2;
        this.owner.loseMana(this.cost);
    }

    // override
    onFinished() {
        // this.owner.speed = this.speedTemp;
    }

    isReadyToNextEffect() {
        return millis() - this.lastEffectTime > this.nextEffectDelay;
    }
}
