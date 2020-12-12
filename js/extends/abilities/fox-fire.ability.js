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
        this.lastEffectTime = 0;
        this.nextEffectDelay = 400;
    }

    // override
    preview(_mousePos) {
        stroke("#5577bb55");
        fill("#5577bb22");
        strokeWeight(3);
        circle(
            this.owner.position.x,
            this.owner.position.y,
            this.effectRadius * 2
        );
    }

    // override
    castSpell(_mousePos) {
        super.castSpell(_mousePos);

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

        return listFireFoxObjects;
    }

    // override
    onStarted() {
        // this.speedTemp = this.owner.speed;
        // this.owner.speed += 2;
        this.owner.mana -= 60;
    }

    // override
    onFinished() {
        // this.owner.speed = this.speedTemp;
    }

    isReadyToNextEffect() {
        return millis() - this.lastEffectTime > this.nextEffectDelay;
    }
}
