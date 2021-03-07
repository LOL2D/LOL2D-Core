import { ALLOWED, NO } from "../constant/crowd-control.constant.js";
import Helper from "../helper/index.js";
import EffectOnChampion from "./effect-on-champion.core.js";

export default class CrowdControlCore extends EffectOnChampion {
    constructor(config = {}) {
        super(config);

        this.movement = ALLOWED;
        this.attacking = ALLOWED;
        this.abilities = ALLOWED;
        this.interruptsChannels = NO;
        this.disabledSummonerSpells = [];
        this.removal = [];

        Helper.Other.setValueFromConfig(this, config);
    }

    // override
    onEffect() {
        this.target.status.movement = this.movement;
        this.target.status.attacking = this.attacking;
        this.target.status.abilities = this.abilities;
    }
}
