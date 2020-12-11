class OrbOfDeception extends Ability {
    constructor(config = {}) {
        super(config);

        this.cooldown = 1000;
        this.castTime = 250;
        this.range = 400;
        this.width = 100;
        this.speed = 10;
        this.cost = 65; // Mana
        this.damage = 40;

        this.lastCastSpell = 0;
        this.times = 0;
    }

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

    castSpell(_mousePos) {
        this.lastCastSpell = millis();
        this.onStarted();

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
        });
    }

    onStarted() {
        this.speedTemp = this.owner.speed;
        this.owner.mana -= 60;
    }

    onFinished() {
        this.owner.speed = this.speedTemp;
    }
}
