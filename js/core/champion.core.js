// TODO https://leagueoflegends.fandom.com/wiki/On-action_effects#On-Attack
// TODO https://leagueoflegends.fandom.com/wiki/Channel
class ChampionCore extends MovementObjectCore {
    constructor(config = {}) {
        super(config);

        // override
        this.fillColor = "#0000";
        this.radius = 40;

        // abilities
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

        // base statistic
        this.maxHealth = 1000;
        this.maxMana = 1000;
        this.fakeHealth = 0;
        this.healthRegen = 0;
        this.manaRegen = 0;

        // attributes
        this.name = "Champion name";
        this.exp = 0;
        this.level = 0;
        this.health = this.maxHealth;
        this.mana = this.maxMana;

        // UI
        this.world = null;
        this.notiEffects = [];

        // set value from config
        Helper.Other.setValueFromConfig(this, config);

        // team
        const c =
            COLOR.HEALTHBAR.HEALTH[this.isAllyWithPlayer ? "ALLY" : "ENEMY"];

        this.healthBar = new HealthBarCore({
            champion: this,
            healthColor: c,
        });
        this.strokeColor = c;
        this.strokeWeight = 4;
    }

    // override
    show() {
        super.show();

        // avatar
        if (globalassets[this.avatarCirclePath]) {
            image(
                globalassets[this.avatarCirclePath],
                this.position.x,
                this.position.y,
                this.radius * 2,
                this.radius * 2
            );
        }

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

    showIndicator(abilityKey) {
        if (this.canSpell(abilityKey))
            this.abilities[abilityKey].showIndicator();
    }

    castSpell(abilityKey, destination) {
        if (this.canSpell(abilityKey)) {
            this.abilities[abilityKey].castSpell(destination);
        }
    }

    canSpell(abilityKey) {
        return (
            this.status.abilities == ALLOWED &&
            this.abilities[abilityKey] &&
            this.abilities[abilityKey].isAvailable() &&
            this.mana >= this.abilities[abilityKey].cost
        );
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

    heal(value) {
        this.health += value;

        this.notiEffects.push(
            new NotiEffectCore({
                text: "+ " + value,
                color: "green",
                position: this.position, // reference to this position
                velocity: createVector(0, -2),
            })
        );
    }

    loseHealth(value, damageSource) {
        this.fakeHealth -= value;

        if (this.fakeHealth < 0) {
            this.health -= -this.fakeHealth;
            this.fakeHealth = 0;

            if (this.health <= 0) this.killedBy = damageSource;
        }

        noStroke();
        fill("red");
        circle(this.position.x, this.position.y, this.radius * 2.5);

        this.notiEffects.push(
            new NotiEffectCore({
                text: "- " + value,
                color: "red",
                position: this.position, // reference to this position
                velocity: createVector(0, -2),
            })
        );
    }

    addMana(value) {
        this.mana += value;

        this.notiEffects.push(
            new NotiEffectCore({
                text: "+ " + value,
                color: "lightblue",
                position: this.position, // reference to healthbar's position
                velocity: createVector(0, -2),
            })
        );
    }

    loseMana(value) {
        this.mana -= value;

        this.notiEffects.push(
            new NotiEffectCore({
                text: "- " + value,
                color: "lightblue",
                position: this.position, // reference to healthbar's position
                velocity: createVector(0, -2),
            })
        );
    }

    spawn({ position, health = this.maxHealth, mana = this.maxMana }) {
        this.health = health;
        this.mana = mana;
        this.position.set(position.x, position.y);
        this.targetMove.set(position.x, position.y);
        this.killedBy = null;
    }

    isDead() {
        return this.health == 0;
    }
}
