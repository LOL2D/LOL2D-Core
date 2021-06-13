import { getSpellScript } from "./SpellScript.js";

export default class Spell {
    constructor(game, owner, spellName, slot) {
        this.game = game;
        this.slot = slot;
        this.owner = owner;
        this.spellName = spellName;
        this.spellScript = getSpellScript(spellName);

        console.log(this);
    }

    activate() {
        this.spellScript.onActivate(this.owner);
    }

    deactivate() {
        this.spellScript.onDeactivate(this.owner);
    }

    cast(x1, y1, x2, y2, unit = null) {
        // this.spellScript.onStartCasting(owner, spell, target);
    }
    finishCasting() {
        // this.spellScript.onFinishCasting(owner, spell, target);
    }

    channel() {}
    finishChanneling() {}

    update() {
        this.spellScript.update();
    }

    applyEffect(unit, pprojectile = null) {
        // this.spellScript.applyEffects(owner, target, spell, projectile);
    }
}
