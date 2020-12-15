// https://leagueoflegends.fandom.com/wiki/Champion_ability
class AbilityCore {
    constructor(config = {}) {
        this.owner = null;
        this.lastCastSpell = 0;
        this.cooldown = 0;

        Helper.Other.setValueFromConfig(this, config);
    }

    showIndicator() {}

    castSpell(destination) {
        this.lastCastSpell = millis();
        this.onStarted();
    }

    onStarted() {}

    onFinished() {}

    isAvailable() {
        return (
            !this.lastCastSpell || millis() - this.lastCastSpell > this.cooldown
        );
    }
}
