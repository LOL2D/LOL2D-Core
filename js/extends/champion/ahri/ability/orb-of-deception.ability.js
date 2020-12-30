import COLOR from "../../../../constant/color.constant.js";
import Helper from "../../../../helper/index.js";
import AbilityCore from "../../../../core/ability.core.js";
import OrbOfDeceptionObject from "./orb-of-deception.object.js";

export default class OrbOfDeception extends AbilityCore {
    constructor(config = {}) {
        super(config);

        // override
        this.cooldown = 7000;
        this.cost = 65; // Mana
        this.imagePath =
            "asset/image/champion/ahri/Orb-of-Deception.ability.png";

        // custom attributes
        this.effectRadius = 300;
        this.width = 30;
        this.damage = 40;
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

        const orbObj = new OrbOfDeceptionObject({
            position: this.owner.position.copy(),
            owner: this.owner,
            damage: this.damage,
            destination: dest,
            radius: this.width * 0.5,
        });

        this.owner.world.addNewSpellObjects(orbObj);
    }
}
