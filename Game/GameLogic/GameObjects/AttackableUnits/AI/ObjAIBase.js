import AttackableUnit from "../AttackableUnit.js";

export default class ObjAIBase extends AttackableUnit {
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
        super(
            game,
            model,
            stats,
            collisionRadius,
            position,
            visionRadius,
            id,
            team
        );

        this.isAttacking = false;
        this.isCastingSpell = false;
        this.isMelee = false;

        this.stats.currentMana = stats.manaPoints.total;
        this.stats.currentHealth = stats.healthPoints.total;
    }

    canMove() {
        return !(this.isDead || this.isCastingSpell || this.isDasing);
        // TODO: Remove these and implement them as buffs, then just check the BuffType here.
        // || HasCrowdControl(CrowdControlType.AIRBORNE)
        // || HasCrowdControl(CrowdControlType.ROOT)
        // || HasCrowdControl(CrowdControlType.STASIS)
        // || HasCrowdControl(CrowdControlType.STUN)
        // || HasCrowdControl(CrowdControlType.SNARE));
    }
}
