class ChampionCore extends MovementObjectCore {
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

        this.notiEffects = [];
    }

    show() {
        super.show();

        // show notification effects
        for (let i = this.notiEffects.length - 1; i >= 0; i--) {
            this.notiEffects[i].run();

            if (this.notiEffects[i].isFinished()) {
                this.notiEffects.splice(i, 1);
            }
        }

        // show info
        fill("white");
        noStroke();
        text(
            this.health + ";" + this.mana,
            this.position.x,
            this.position.y + this.radius + 20
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

    loseHealth(value) {
        this.health -= value;

        noStroke();
        fill("red");
        circle(this.position.x, this.position.y, this.radius * 2.5);

        this.notiEffects.push(
            new NotiEffectCore({
                text: "-" + value,
                position: this.position.copy().add(0, -this.radius * 0.5),
                velocity: createVector(0, -5),
            })
        );
    }
}
