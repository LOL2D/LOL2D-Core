class CrowdControl {
    constructor(config = {}) {
        this.movement = ALLOWED;
        this.attacking = ALLOWED;
        this.abilities = ALLOWED;
        this.interruptsChannels = NO;
        this.disabledSummonerSpells = [];
        this.removal = [];

        this.duration = 0;
        this.owner = null;

        this.startTime = millis();

        for (let c in config) {
            this[c] = config[c];
        }
    }

    effect() {}
}
