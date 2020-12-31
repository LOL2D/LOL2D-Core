import COLOR from "../../../../constant/color.constant.js";
import Helper from "../../../../helper/index.js";
import AbilityCore from "../../../../core/ability.core.js";
import DashEffect from "../../../effect-on-champion/dash.effect.js";

export default class SpriritRush extends AbilityCore {
    constructor(config = {}) {
        super(config);

        // override
        this.cooldown = 2000;
        this.cost = 100; // Mana
        this.imagePath = "asset/image/champion/ahri/Spirit-Rush.ability.png";

        // custom attributes
        this.effectRadius = 150;
        this.width = 20;
    }

    // override
    showIndicator(destination) {
        const vec = Helper.Vector.getVectorWithRange(
            this.owner.position,
            destination,
            this.effectRadius
        );

        stroke(COLOR.ABILITY.INDICATOR.BORDER);
        fill(COLOR.ABILITY.INDICATOR.RECTFILL);
        strokeWeight(3);

        Helper.UI.rectFromVectorRange(vec, this.width);
    }

    // override
    castSpell(destination) {
        super.castSpell(destination);

        const { to: dest } = Helper.Vector.getVectorWithRange(
            this.owner.position.copy(),
            destination,
            this.effectRadius
        );

        this.owner.world.addNewEffectOnChampion(
            new DashEffect({
                world: this.world,
                owner: this.owner,
                target: this.owner,
                destination: dest,
                speed: 8,
            })
        );
    }

    // other functions here
}
