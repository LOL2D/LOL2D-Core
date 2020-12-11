// https://leagueoflegends.fandom.com/wiki/Champion_ability
class Ability {
    constructor(config = {}) {
        this.owner = null;
        this.lastCastSpell = 0;

        for (let c in config) {
            this[c] = config[c];
        }
    }

    previewCastSpell() {}

    castSpell() {}

    onStarted() {}

    onFinished() {}

    isAvailable() {
        return (
            !this.lastCastSpell || millis() - this.lastCastSpell > this.cooldown
        );
    }
}
