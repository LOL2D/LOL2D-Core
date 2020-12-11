class Champion extends MovementObject {
    constructor(config = {}) {
        super(config);

        this.crowdControls = [];
        this.status = {
            movement: ALLOWED,
            attacking: ALLOWED,
            abilities: ALLOWED,
        };
        this.abilities = {
            spell1: null,
            spell2: null,
            spell3: null,
            spell4: null,

            avatarSpell1: null,
            avatarSpell2: null,
        };

        this.health = 100;
        this.mana = 100;
    }

    show() {
        super.show();

        text(
            this.health + ";" + this.mana,
            this.position.x,
            this.position.y - this.size / 2 - 20
        );
    }

    run() {
        this.startCrowdControls();
        if (this.status.movement != DISABLED) this.move();
        this.show();
        this.endCrowdControls();
    }

    startCrowdControls() {
        for (let c of this.crowdControls) {
            c.effect(this);
        }
    }

    endCrowdControls() {
        this.status.movement = ALLOWED;
        this.status.attacking = ALLOWED;
        this.status.abilities = ALLOWED;
    }

    previewCastSpell(abilityKey, _mousePos) {
        if (this.canSpell(abilityKey))
            this.abilities[abilityKey].preview(_mousePos);
    }

    castSpell(abilityKey, _mousePos) {
        if (this.canSpell(abilityKey))
            return this.abilities[abilityKey].castSpell(_mousePos);

        return null;
    }

    canSpell(abilityKey) {
        return (
            this.status.abilities == ALLOWED &&
            this.abilities[abilityKey] &&
            this.abilities[abilityKey].isAvailable()
        );
    }
}
