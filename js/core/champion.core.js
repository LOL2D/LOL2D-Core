import COLOR from "../constant/color.constant.js";
import { ALLOWED } from "../constant/crowd-control.constant.js";
import GlobalAssets from "../global/asset.global.js";
import Helper from "../helper/index.js";
import MovementObjectCore from "./movement-object.core.js";
import HealthBarCore from "./health-bar.core.js";
import CombatTextCore from "./combat-text.core.js";

// TODO https://leagueoflegends.fandom.com/wiki/On-action_effects#On-Attack
// TODO https://leagueoflegends.fandom.com/wiki/Channel
export default class ChampionCore extends MovementObjectCore {
    constructor(config = {}) {
        super(config);

        // override
        this.fillColor = "#0000";
        this.radius = 30;
        this.speed = 3;

        // abilities
        this.crowdControls = [];
        this.status = {
            movement: ALLOWED,
            attacking: ALLOWED,
            abilities: ALLOWED,
        };
        this.abilities = {
            basicAttack: null,

            spell1: null,
            spell2: null,
            spell3: null,
            spell4: null,

            avatarSpell1: null,
            avatarSpell2: null,
        };

        // base statistic
        this.sightRadius = 500;
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
        this.basicAttackDamage = 30;
        this.basicAttackRadius = 250;

        // UI
        this.world = null;
        this.combatTexts = [];

        // set value from config
        Helper.Other.setValueFromConfig(this, config);

        // stand still
        this.removeDestination();

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
        if (GlobalAssets[this.avatarCirclePath]) {
            image(
                GlobalAssets[this.avatarCirclePath],
                this.position.x,
                this.position.y,
                this.radius * 2,
                this.radius * 2
            );
        }

        // destination direction
        if (!this.isArrivedDestination()) {
            let { from, to } = Helper.Vector.getVectorWithRange(
                this.position,
                this.destination,
                this.radius
            );
            stroke("#ddd");
            line(from.x, from.y, to.x, to.y);
        }

        // health bar
        this.healthBar.show();

        // show notification effects
        for (let cbt of this.combatTexts) {
            cbt.show();
        }
    }

    update() {
        super.update();

        // heal + mana
        this.health += this.healthRegen;
        this.mana += this.manaRegen;

        this.health = constrain(this.health, 0, this.maxHealth);
        this.mana = constrain(this.mana, 0, this.maxMana);

        // update notification effects
        for (let i = this.combatTexts.length - 1; i >= 0; i--) {
            this.combatTexts[i].update();

            if (this.combatTexts[i].isFinished()) {
                this.combatTexts.splice(i, 1);
            }
        }
    }

    run() {
        this.startCrowdControls();
        if (this.status.movement != DISABLED) this.move();
        this.update();
        this.show();
        this.endCrowdControls();
    }

    getSightBoundary() {
        return {
            x: this.position.x - this.sightRadius,
            y: this.position.y - this.sightRadius,
            w: this.sightRadius * 2,
            h: this.sightRadius * 2,
        };
    }

    basicAttack(destination) {
        this.castSpell("basicAttack", destination);
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
            this.abilities[abilityKey].isCoolDownFinished() &&
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

        this.combatTexts.push(
            new CombatTextCore({
                text: "+ " + value,
                color: "green",
                position: this.position, // reference to this position
                velocity: createVector(random(-1, 1), random(-1.5, -2)),
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

        this.combatTexts.push(
            new CombatTextCore({
                text: "- " + value,
                color: "red",
                position: this.position, // reference to this position
                velocity: createVector(0, -2),
            })
        );
    }

    addMana(value) {
        this.mana += value;

        this.combatTexts.push(
            new CombatTextCore({
                text: "+ " + value,
                color: "lightblue",
                position: this.position, // reference to healthbar's position
                velocity: createVector(random(-1, 1), random(-1.5, -2)),
            })
        );
    }

    loseMana(value) {
        this.mana -= value;

        this.combatTexts.push(
            new CombatTextCore({
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
        this.destination.set(position.x, position.y);
        this.killedBy = null;
    }

    isDead() {
        return this.health == 0;
    }
}
