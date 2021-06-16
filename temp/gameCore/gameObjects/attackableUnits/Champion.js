import { HasFlag } from "../../utils/Helpers.js";
import StatusFlags from "../../../enums/StatusFlags.js";
import TeamID from "../../../enums/TeamID.js";
import AssetManager from "../../../AssetManager.js";
import GameObject from "../GameObject.js";
import Stats from "../stats/Stats.js";

export default class Champion extends GameObject {
    constructor(
        game,
        model = AssetManager.getAsset(
            "asset/image/champion/ahri/Ahri.avatar.circle.png"
        ),
        stats = new Stats(),
        position = createVector(),
        collisionRadius = 40,
        visionRadius = 200,
        teamId = TeamID.TEAM_BLUE
    ) {
        super(game, position, collisionRadius, visionRadius, teamId);

        this.stats = stats;
        this.model = model;
        this.buffs = [];
        this.wayPoints = [];

        this.status =
            StatusFlags.CanAttack |
            StatusFlags.CanCast |
            StatusFlags.CanMove |
            StatusFlags.CanMoveEver;
    }

    update() {
        if (this.canMove()) {
            this.move();
        }
    }

    // override
    display() {
        image(
            this.model,
            this.position.x,
            this.position.y,
            this.collisionRadius * 2,
            this.collisionRadius * 2
        );
    }

    // Moves this unit to its specified waypoints, updating its position along the way.
    move() {}

    // Enables or disables the given status on this unit.
    setStatus(statusFlag, enabled) {
        if (enabled) this.status |= statusFlag;
        else this.status &= ~statusFlag;
    }

    isDead() {
        return this.stats.currentHealth <= 0;
    }

    canMove() {
        // TODO: Verify if Dashes should bypass this.
        return !(
            this.isDead() ||
            !(
                HasFlag(this.status, StatusFlags.CanMove) ||
                HasFlag(this.status, StatusFlags.CanMoveEver)
            ) ||
            HasFlag(this.status, StatusFlags.Immovable) ||
            HasFlag(this.status, StatusFlags.Netted) ||
            HasFlag(this.status, StatusFlags.Rooted) ||
            HasFlag(this.status, StatusFlags.Sleep) ||
            HasFlag(this.status, StatusFlags.Stunned) ||
            HasFlag(this.status, StatusFlags.Suppressed)
        );
    }

    canAttack() {
        // TODO: Verify if all cases are accounted for.
        return !(
            !HasFlag(this.status, StatusFlags.CanAttack) ||
            HasFlag(this.status, StatusFlags.Charmed) ||
            HasFlag(this.status, StatusFlags.Disarmed) ||
            HasFlag(this.status, StatusFlags.Feared) ||
            // TODO: Verify
            HasFlag(this.status, StatusFlags.Pacified) ||
            HasFlag(this.status, StatusFlags.Sleep) ||
            HasFlag(this.status, StatusFlags.Stunned) ||
            HasFlag(this.status, StatusFlags.Suppressed)
        );
    }

    canCast() {
        // TODO: Verify if all cases are accounted for.
        return !(
            !HasFlag(this.status, StatusFlags.CanCast) ||
            HasFlag(this.status, StatusFlags.Charmed) ||
            HasFlag(this.status, StatusFlags.Feared) ||
            // TODO: Verify
            HasFlag(this.status, StatusFlags.Pacified) ||
            HasFlag(this.status, StatusFlags.Silenced) ||
            HasFlag(this.status, StatusFlags.Sleep) ||
            HasFlag(this.status, StatusFlags.Stunned) ||
            HasFlag(this.status, StatusFlags.Suppressed) ||
            HasFlag(this.status, StatusFlags.Taunted)
        );
    }
}
