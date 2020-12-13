class CrowdControlCore {
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

        Utils.setValueFromConfig(this, config);
    }

    effect() {}
}
