class OrbOfDeception extends AbilityCore {
    constructor(config = {}) {
        super(config);

        // override
        this.cooldown = 3000;

        // custom attributes
        this.castTime = 250;
        this.effectRadius = 400;
        this.width = 50;
        this.cost = 65; // Mana
        this.damage = 40;
        this.speed = 15;
    }

    // override
    showIndicator() {
        const vec = Helper.Vector.getVectorWithRange(
            this.owner.position.copy(),
            this.owner.world.getMousePosition(),
            this.effectRadius
        );

        stroke(COLOR.ABILITY.INDICATOR.BORDER);
        fill(COLOR.ABILITY.INDICATOR.FILL);
        strokeWeight(3);

        Helper.UI.rectFromVectorRange(vec, this.width);
    }

    // override
    castSpell(destination) {
        super.castSpell();

        const { to: target } = Helper.Vector.getVectorWithRange(
            this.owner.position.copy(),
            destination,
            this.effectRadius
        );

        const orbObj = new OrbOfDeceptionObject({
            position: this.owner.position.copy(),
            owner: this.owner,
            damage: this.damage,
            targetMove: target,
            speed: this.speed,
            radius: this.width / 2,
        });

        this.owner.world.addNewSpellObjects(orbObj);
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
