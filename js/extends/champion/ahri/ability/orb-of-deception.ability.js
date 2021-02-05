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
        this.width = 40;
        this.damage = 80;
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

        Helper.UI.rectFromVectorRange(vec, this.width, true);
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
            world: this.world,
            owner: this.owner,
            position: this.owner.position.copy(),
            damage: this.damage,
            destination: dest,
            radius: this.width * 0.5,
        });

        this.owner.world.addNewSpellObjects(orbObj);
    }
}
