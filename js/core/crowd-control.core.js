import { ALLOWED, NO } from "../constant/crowd-control.constant.js";
import Helper from "../helper/index.js";
export default class CrowdControlCore {
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

        Helper.Other.setValueFromConfig(this, config);
    }

    effect() {}
}
