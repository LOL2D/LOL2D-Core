class OrbOfDeception extends AbilityCore {
    constructor(config = {}) {
        super(config);

        this.cooldown = 1000;
        this.castTime = 250;
        this.range = 400;
        this.width = 50;
        this.speed = 15;
        this.cost = 65; // Mana
        this.damage = 40;
    }

    // override
    preview(_mousePos) {
        stroke("#5577bb55");
        strokeWeight(this.width);
        noFill();

        const { from, to } = getVectorRange(
            this.owner.position.copy(),
            _mousePos,
            this.range
        );

        line(from.x, from.y, to.x, to.y);
    }

    // override
    castSpell(_mousePos) {
        super.castSpell(_mousePos);

        const { to: target } = getVectorRange(
            this.owner.position.copy(),
            _mousePos,
            this.range
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
        this.owner.mana -= 60;
    }

    // override
    onFinished() {
        this.owner.speed = this.speedTemp;
    }
}
