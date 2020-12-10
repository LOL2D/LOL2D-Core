class CrowdControl {
    constructor(config = {}) {
        this.movement = ALLOWED;
        this.attacking = ALLOWED;
        this.abilities = ALLOWED;
        this.interruptsChannels = NO;
        this.disabledSummonerSpells = [];
        this.removal = [];

        for (let c in config) {
            this[c] = config[c];
        }
    }

    effect(champion) {}
}
