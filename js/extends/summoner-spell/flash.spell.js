import COLOR from "../../constant/color.constant.js";
import Helper from "../../helper/index.js";
import AbilityCore from "../../core/ability.core.js";
import FlashObject from "./flash.object.js";

export default class Flash extends AbilityCore {
    constructor(config = {}) {
        super(config);

        // override
        this.cooldown = 30000;
        this.cost = 0; // Mana
        this.imagePath = "asset/image/spell/Flash.png";

        // custom attributes
        this.effectRadius = 240;
    }

    // override
    showIndicator(destination) {
        stroke(COLOR.ABILITY.INDICATOR.BORDER);
        strokeWeight(3);
        fill("white"); // turn on fill to use Gradient below

        Helper.Color.createRadialGradient(
            p5.instance,
            this.owner.position.x,
            this.owner.position.y,
            max(0, this.effectRadius - 100),
            this.effectRadius,
            [
                { stop: 0, color: "#1111" },
                { stop: 1, color: COLOR.ABILITY.INDICATOR.CIRCLEFILL },
            ]
        );

        circle(
            this.owner.position.x,
            this.owner.position.y,
            this.effectRadius * 2
        );
    }

    // override
    castSpell(destination) {
        super.castSpell(destination);

        let { to } = Helper.Vector.getVectorWithRange(
            this.owner.position,
            destination,
            min(
                this.effectRadius,
                p5.Vector.dist(this.owner.position, destination)
            )
        );

        this.owner.world.addNewSpellObjects(
            new FlashObject({
                position: this.owner.position.copy(),
                radius: this.owner.radius,
            })
        );

        this.owner.position.set(to.x, to.y);
        this.owner.removeDestination();

        this.owner.world.addNewSpellObjects(
            new FlashObject({
                position: this.owner.position.copy(),
                radius: this.owner.radius,
            })
        );
    }

    // other functions here
}
