import StatusFlags from "../../../../../enums/StatusFlags.js";
import AttackableUnit from "../AttackableUnit.js";

export default class ObjAIBase extends AttackableUnit {
    canMove() {
        // TODO: Verify if Dashes should bypass this.
        return !(
            IsDead ||
            MoveOrder == OrderType.CastSpell ||
            !(
                Status.HasFlag(StatusFlags.CanMove) ||
                Status.HasFlag(StatusFlags.CanMoveEver)
            ) ||
            Status.HasFlag(StatusFlags.Immovable) ||
            Status.HasFlag(StatusFlags.Netted) ||
            Status.HasFlag(StatusFlags.Rooted) ||
            Status.HasFlag(StatusFlags.Sleep) ||
            Status.HasFlag(StatusFlags.Stunned) ||
            Status.HasFlag(StatusFlags.Suppressed)
        );
    }

    canAttack() {
        // TODO: Verify if all cases are accounted for.
        return !(
            !Status.HasFlag(StatusFlags.CanAttack) ||
            Status.HasFlag(StatusFlags.Charmed) ||
            Status.HasFlag(StatusFlags.Disarmed) ||
            Status.HasFlag(StatusFlags.Feared) ||
            // TODO: Verify
            Status.HasFlag(StatusFlags.Pacified) ||
            Status.HasFlag(StatusFlags.Sleep) ||
            Status.HasFlag(StatusFlags.Stunned) ||
            Status.HasFlag(StatusFlags.Suppressed)
        );
    }

    canCast() {
        // TODO: Verify if all cases are accounted for.
        return !(
            !Status.HasFlag(StatusFlags.CanCast) ||
            Status.HasFlag(StatusFlags.Charmed) ||
            Status.HasFlag(StatusFlags.Feared) ||
            // TODO: Verify
            Status.HasFlag(StatusFlags.Pacified) ||
            Status.HasFlag(StatusFlags.Silenced) ||
            Status.HasFlag(StatusFlags.Sleep) ||
            Status.HasFlag(StatusFlags.Stunned) ||
            Status.HasFlag(StatusFlags.Suppressed) ||
            Status.HasFlag(StatusFlags.Taunted)
        );
    }
}
