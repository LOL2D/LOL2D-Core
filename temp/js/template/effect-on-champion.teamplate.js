import Helper from "path/tp/helper/index.js";
import EffectOnChampion from "path/to/effect-on-champion.core.js";

export default class EffectName extends EffectOnChampion {
    constructor(config) {
        super(config);

        // override

        // custom attribute

        Helper.Other.setValueFromConfig(this, config);
    }

    // override
    onStarted() {}

    // override
    update() {}

    // override
    show() {}

    // override
    onEffect() {}

    // override
    onFinished() {}

    // override
    checkFinished() {}

    // other functions here
}
