import COLOR from "../../../../constant/color.constant.js";
import Helper from "../../../../helper/index.js";
import AbilityCore from "../../../../core/ability.core.js";
import CharmObject from "./charm.object.js";

export default class Charm extends AbilityCore {
    constructor(config = {}) {
        super(config);

        // override
        this.cooldown = 12000;
        this.cost = 70; // Mana
        this.imagePath = "asset/image/champion/ahri/Charm.ability.png";

        // custom attributes
        this.effectRadius = 350;
        this.width = 20;
        this.damage = 20;
    }

    // override
    showIndicator() {
        const vec = Helper.Vector.getVectorWithRange(
            this.owner.position,
            this.owner.world.getMousePosition(),
            this.effectRadius
        );

        stroke(COLOR.ABILITY.INDICATOR.BORDER);
        fill(COLOR.ABILITY.INDICATOR.RECTFILL);
        strokeWeight(3);

        Helper.UI.rectFromVectorRange(vec, this.width);
    }

    // override
    castSpell(destination) {
        super.castSpell();

        const { to: target } = Helper.Vector.getVectorWithRange(
            this.owner.position.copy(),
            destination,
            this.effectRadius
        );

        const orbObj = new CharmObject({
            world: this.world,
            owner: this.owner,
            position: this.owner.position.copy(),
            damage: this.damage,
            destination: target,
            radius: this.width * 0.5,
        });

        this.owner.world.addNewSpellObjects(orbObj);
    }

    // other functions here
}
