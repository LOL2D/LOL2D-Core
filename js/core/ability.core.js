import GlobalTime from "../global/time.global.js";
import Helper from "../helper/index.js";

// https://leagueoflegends.fandom.com/wiki/Champion_ability
export default class AbilityCore {
    constructor(config = {}) {
        this.world = null;
        this.owner = null;
        this.imagePath = null;
        this.lastCastSpell = 0;
        this.cooldown = 0;
        this.cost = 0;
        this.castTime = 0;

        Helper.Other.setValueFromConfig(this, config);
    }

    update() {}

    showIndicator(destination) {}

    castSpell(destination) {
        this.lastCastSpell = GlobalTime.getNow();
        this.cost > 0 && this.owner.loseMana(this.cost);
    }

    isCoolDownFinished() {
        return (
            !this.lastCastSpell ||
            GlobalTime.getNow() - this.lastCastSpell > this.cooldown
        );
    }

    getCurrentCooldown() {
        // chưa dùng chiêu lần nào
        if (!this.lastCastSpell) return 0;

        // đã dùng chiêu ít nhất 1 lần
        return max(
            0,
            this.cooldown - (GlobalTime.getNow() - this.lastCastSpell)
        );
    }
}
