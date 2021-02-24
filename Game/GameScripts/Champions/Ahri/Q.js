export default class OrbOfDeception {
    static spellData = {
        metaData: {
            id: "AhriOrbofDeception",
            name: "AhriOrbofDeception",
        },
        values: {
            spellData: {
                manaCost: 55,
                cooldown: 7,
                castRadius: 275,
            },
        },
    };

    constructor() {}

    onActivate(owner) {}

    onDeactivate(owner) {}

    onStartCasting(owner, spell, target) {}

    onFinishCasting(owner, spell, target) {}

    applyEffects(owner, target, spell, projectile) {}

    onUpdate(diff) {}
}
