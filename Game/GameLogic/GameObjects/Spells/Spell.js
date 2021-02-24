export default class Spell {
    constructor(game, owner, spellName, slot) {
        this.game = game;
        this.owner = owner;
        this.slot = slot;
        this.spellScript = spellScript;

        this.spellScript.onActivate(this.owner);
    }

    deactivate() {
        this.spellScript.onDeactivate(this.owner);
    }

    cast(x1, y1, x2, y2, unit = null) {}
    finishCasting() {}

    channel() {}
    finishChanneling() {}

    update(diff) {}

    applyEffect(unit, pprojectile = null) {}

}
