class OrbOfDeception extends AbilityCore {
    constructor(config = {}) {
        super(config);

        // override
        this.cooldown = 3000;
        this.cost = 65; // Mana

        // custom attributes
        this.effectRadius = 300;
        this.width = 30;
        this.damage = 40;
    }

    // override
    showIndicator() {
        const vec = Helper.Vector.getVectorWithRange(
            this.owner.position.copy(),
            this.owner.world.getMousePosition(),
            this.effectRadius
        );

        stroke(COLOR.ABILITY.INDICATOR.BORDER);
        fill(COLOR.ABILITY.INDICATOR.RECTFILL);
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
            radius: this.width / 2,
        });

        this.owner.world.addNewSpellObjects(orbObj);
    }

    // override
    onStarted() {}

    // override
    onFinished() {}
}
