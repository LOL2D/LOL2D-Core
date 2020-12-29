import AbilityCore from "../../../../core/ability.core.js";

export default class SpriritRush extends AbilityCore {
    constructor(config = {}) {
        super(config);

        // override
        this.cooldown = 130000;
        this.cost = 100; // Mana
        this.imagePath = "asset/image/champion/ahri/Spirit-Rush.ability.png";

        // custom attributes
    }

    // override
    showIndicator() {}

    // override
    castSpell(destination) {}

    // override
    onStarted() {}

    // override
    onFinished() {}

    // other functions here
}
