// https://leagueoflegends.fandom.com/wiki/Champion_ability
class AbilityCore {
    constructor(config = {}) {
        this.owner = null;
        this.lastCastSpell = 0;

        for (let c in config) {
            this[c] = config[c];
        }
    }

    previewCastSpell() {}

    castSpell() {
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
