import AbilityObjectCore from "../../core/ability-object.core.js";

export default class FlashObject extends AbilityObjectCore {
    constructor(config = {}) {
        // get value from config
        super(config);

        // override
        this.fillColor = "#FDF028";
        // this.speed = 0;

        // custom attributes
    }

    // override
    update() {
        super.update();

        this.radius -= 2;
    }

    // override
    // show() {}

    // override
    // effectChampions(champions) {}

    // override
    // move() {}

    // override
    checkFinished() {
        return this.radius <= 0;
    }

    // other functions here
}
