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
    }
}
