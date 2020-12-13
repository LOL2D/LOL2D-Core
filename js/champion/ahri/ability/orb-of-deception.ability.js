class OrbOfDeception extends AbilityCore {
    constructor(config = {}) {
        super(config);

        this.cooldown = 1000;
        this.castTime = 250;
        this.effectRadius = 400;
        this.width = 50;
        this.speed = 15;
        this.cost = 65; // Mana
        this.damage = 40;
    }

    // override
    preview(_mousePos) {
        const vec = Utils.getVectorWithRange(
            this.owner.position.copy(),
            _mousePos,
            this.effectRadius
        );

        stroke(COLOR.ABILITY.PREVIEW.BORDER);
        fill(COLOR.ABILITY.PREVIEW.FILL);
        strokeWeight(3);

        Utils.rectFromVectorRange(vec, this.width);
    }

    // override
    castSpell(_mousePos) {
        super.castSpell(_mousePos);

        const { to: target } = Utils.getVectorWithRange(
            this.owner.position.copy(),
            _mousePos,
            this.effectRadius
        );

        return new OrbOfDeceptionObject({
            position: this.owner.position.copy(),
            owner: this.owner,
            damage: this.damage,
            targetMove: target,
            speed: this.speed,
            radius: this.width / 2,
        });
    }

    // override
    onStarted() {
        this.speedTemp = this.owner.speed;
        this.owner.loseMana(this.cost);
    }

    // override
    onFinished() {
        this.owner.speed = this.speedTemp;
    }
}
