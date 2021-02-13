import SpellFlags from "../../Enums/SpellFlags.js";
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

        this.waypoints = [position.copy()];
        this.currentWaypoint = {
            index: 1,
            value: position.copy(),
        };
        this.crowdControls = [];
        this.isDashing = false;
        this.stats.attackSpeedMultiplier.baseValue = 1.0;

        this.buffSlots = [];
        this.parentBuffs = {};
        this.buffList = [];
    }

    // override
    onAdded() {
        super.onAdded();
        // this.game.objectManager.addVisionUnit(this);
    }

    // override
    onRemoved() {
        super.onRemoved();
        // this.game.objectManager.removeVisionUnit(this);
    }

    onCollision(o, isTerrain = false) {}

    isTargetableToTeam(team) {
        if (!this.stats.isTargetable) {
            return false;
        }
        if (this.team == team) {
            return !this.stats.isTargetableToTeam.hasFlag(
                SpellFlags.NonTargetableAlly
            );
        }
        return !this.stats.isTargetableToTeam.hasFlag(
            SpellFlags.NonTargetableEnemy
        );
    }
}
