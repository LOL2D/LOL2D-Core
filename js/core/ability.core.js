import Helper from "../helper/index.js";

// https://leagueoflegends.fandom.com/wiki/Champion_ability
export default class AbilityCore {
    constructor(config = {}) {
        this.owner = null;
        this.lastCastSpell = 0;
        this.cooldown = 0;
        this.cost = 0;

        Helper.Other.setValueFromConfig(this, config);
    }

    showIndicator() {}

    castSpell(destination) {
        this.lastCastSpell = millis();
        this.cost > 0 && this.owner.loseMana(this.cost);
        this.onStarted();
    }

    onStarted() {}

    onFinished() {}

    isCoolDownFinished() {
        return (
            !this.lastCastSpell || millis() - this.lastCastSpell > this.cooldown
        );
    }
}
