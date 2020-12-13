class ChampionCore extends MovementObjectCore {
    constructor(config = {}) {
        super(config);

        // core attributes
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

        this.level = 18;
        this.maxHealth = 1000;
        this.maxMana = 1000;
        this.health = this.maxHealth;
        this.mana = this.maxMana;
        this.fakeHealth = 0;
        this.healthRegen = 0.5;
        this.manaRegen = 0.5;

        // UI
        this.notiEffects = [];
        this.healthBar = new HealthBarCore({ champion: this });
    }

    show() {
        super.show();

        // health bar
        this.healthBar.show();

        // show notification effects
        for (let i = this.notiEffects.length - 1; i >= 0; i--) {
            this.notiEffects[i].run();

            if (this.notiEffects[i].isFinished()) {
                this.notiEffects.splice(i, 1);
            }
        }
    }

    update() {
        this.health += this.healthRegen;
        this.mana += this.manaRegen;

        this.health = constrain(this.health, 0, this.maxHealth);
        this.mana = constrain(this.mana, 0, this.maxMana);
    }

    run() {
        this.startCrowdControls();
        if (this.status.movement != DISABLED) this.move();
        this.update();
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
        if (this.canSpell(abilityKey)) {
            return this.abilities[abilityKey].castSpell(_mousePos);
        }

        return null;
    }

    canSpell(abilityKey) {
        return (
            this.status.abilities == ALLOWED &&
            this.abilities[abilityKey] &&
            this.abilities[abilityKey].isAvailable() &&
            this.mana >= this.abilities[abilityKey].cost
        );
    }

    loseHealth(value) {
        this.fakeHealth -= value;

        if (this.fakeHealth < 0) {
            this.health -= -this.fakeHealth;
            this.fakeHealth = 0;
        }

        noStroke();
        fill("red");
        circle(this.position.x, this.position.y, this.radius * 2.5);

        this.notiEffects.push(
            new NotiEffectCore({
                text: "- " + value,
                color: "red",
                position: this.healthBar.position.copy(),
                velocity: createVector(0, -5),
            })
        );
    }

    loseMana(value) {
        this.mana -= value;

        this.notiEffects.push(
            new NotiEffectCore({
                text: "- " + value,
                color: "lightblue",
                position: this.healthBar.position.copy(),
                velocity: createVector(0, -5),
            })
        );
    }
}
