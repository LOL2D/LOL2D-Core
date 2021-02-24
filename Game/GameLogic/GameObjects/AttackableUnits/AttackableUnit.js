import DamageType from "../../Enums/DamageType.js";
import ApiEventManager from "../../API/ApiEventManager.js";
import AssetManager from "../../AssetManager.js";
import GameObject from "../GameObject.js";

export default class AttackableUnit extends GameObject {
    constructor(
        game,
        model,
        stats,
        collisionRadius,
        position,
        visionRadius,
        id,
        team
    ) {
        super(game, position, collisionRadius, visionRadius, id, team);

        this.stats = stats;
        this.model = model;
        this.destination = this.position.copy();
        this.statUpdateTimer = 0;
        this.isDead = false;
        this.isDasing = false;
        this.dashTime = 0;
        this.dashElapsedTime = 0;

        this.crowdControls = [];
    }

    // override
    update(diff) {
        this.statUpdateTimer += diff;
        while (this.statUpdateTimer >= 500) {
            // update Stats (hpregen, manaregen) every 0.5 seconds
            this.stats.update(this.statUpdateTimer);
            this.statUpdateTimer -= 500;
        }

        // moving
        if (this.isMoving()) {
            this.move();
        }

        // crowdControls
        for (let cc of this.crowdControls) {
            cc.update(diff);
        }
        this.crowdControls = this.crowdControls.filter((cc) => !cc.isRemoved);

        // dashing
        if (this.isDashing) {
            if (this.dashTime <= 0) {
                this.setDashingState(false);
                return;
            }

            this.dashElapsedTime += diff;
            if (this.dashElapsedTime >= this.dashTime) {
                this.setDashingState(false);
            }
        }
    }

    // override
    draw() {
        let img = AssetManager.getAsset(this.model);
        if (img) {
            image(
                img,
                this.position.x,
                this.position.y,
                this.collisionRadius * 2,
                this.collisionRadius * 2
            );
        } else {
            super.draw();
        }

        // draw moveVector
        push();
        let direction = this.getDirectionVector(this.collisionRadius);
        stroke(255);
        strokeWeight(3);
        line(
            this.position.x,
            this.position.y,
            this.position.x + direction.x,
            this.position.y + direction.y
        );
        pop();
    }

    move() {
        let mag = min(
            this.stats.moveSpeed.total,
            p5.Vector.dist(this.position, this.destination) - 1
        );

        this.position.add(this.getDirectionVector(mag));
    }

    teleportTo(x, y) {
        this.position.set(x, y);
    }

    isMoving() {
        return this.destination != null && this.getDirectionMag() > 1;
    }

    stopMovement() {
        this.destination.set(this.position.x, this.position.y);
    }

    getDirectionVector(customMag = 0) {
        let moveVector = p5.Vector.sub(this.destination, this.position);
        moveVector.setMag(customMag || this.stats.moveSpeed.total);
        return moveVector;
    }

    getDirectionMag() {
        return p5.Vector.sub(this.destination, this.position).mag();
    }

    addStatModifier(statModifier) {
        this.stats.addModifier(statModifier);
    }

    removeStatModifier(statModifier) {
        this.stats.removeModifier(statModifier);
    }

    takeDamage(attacker, damage, type, source, damageText) {
        let defense = 0;
        let regain = 0;
        var attackerStats = attacker.stats;

        switch (type) {
            case DamageType.DAMAGE_TYPE_PHYSICAL:
                defense = this.stats.armor.total;
                defense =
                    (1 - attackerStats.armorPenetration.percentBonus) *
                        defense -
                    attackerStats.armorPenetration.flatBonus;

                break;
            case DamageType.DAMAGE_TYPE_MAGICAL:
                defense = this.stats.magicPenetration.total;
                defense =
                    (1 - attackerStats.magicPenetration.percentBonus) *
                        defense -
                    attackerStats.magicPenetration.flatBonus;
                break;
            case DamageType.DAMAGE_TYPE_TRUE:
                break;
            default:
        }

        switch (source) {
            case DamageSource.DAMAGE_SOURCE_RAW:
                break;
            case DamageSource.DAMAGE_SOURCE_INTERNALRAW:
                break;
            case DamageSource.DAMAGE_SOURCE_PERIODIC:
                break;
            case DamageSource.DAMAGE_SOURCE_PROC:
                break;
            case DamageSource.DAMAGE_SOURCE_REACTIVE:
                break;
            case DamageSource.DAMAGE_SOURCE_ONDEATH:
                break;
            case DamageSource.DAMAGE_SOURCE_SPELL:
                regain = attackerStats.spellVamp.total;
                break;
            case DamageSource.DAMAGE_SOURCE_ATTACK:
                regain = attackerStats.lifeSteal.total;
                break;
            case DamageSource.DAMAGE_SOURCE_DEFAULT:
                break;
            case DamageSource.DAMAGE_SOURCE_SPELLAOE:
                break;
            case DamageSource.DAMAGE_SOURCE_SPELLPERSIST:
                break;
            case DamageSource.DAMAGE_SOURCE_PET:
                break;
            default:
        }

        if (damage < 0) {
            damage = 0;
        } else {
            //Damage dealing. (based on leagueoflegends' wikia)
            damage =
                defense >= 0
                    ? (100 / (100 + defense)) * damage
                    : (2 - 100 / (100 - defense)) * damage;
        }

        ApiEventManager.onUnitDamageTaken.publish(this);

        this.stats.currentHealth = Math.max(
            0.0,
            this.stats.currentHealth - damage
        );
        if (!this.isDead && this.stats.currentHealth <= 0) {
            this.isDead = true;
            this.die(attacker);
        }

        if (regain > 0) {
            attackerStats.currentHealth = Math.min(
                attackerStats.healthPoints.total,
                attackerStats.currentHealth + regain * damage
            );
        }
    }

    die(attacker) {
        console.log("die");
    }

    setDashingState(state) {
        if (this.isDashing && state == false) {
            this.dashTime = 0;
            this.dashElapsedTime = 0;

            // let animList = ["RUN"];
            // _game.PacketNotifier.NotifySetAnimation(this, animList);
        }

        this.isDashing = state;
    }
}
