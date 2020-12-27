import COLOR from "../../../../constant/color.constant.js";
import Helper from "../../../../helper/index.js";

import AbilityCore from "../../../../core/ability.core.js";
import FoxFireObject from "./fox-fire.object.js";

export default class FoxFire extends AbilityCore {
    constructor(config = {}) {
        super(config);

        // override
        this.cooldown = 5000;
        this.cost = 65; // Mana

        // custom attribute
        this.castTime = 250;
        this.effectRadius = 200;
        this.damage = 40;
        this.speed = 10;

        this.foxFireCount = 3;
        this.foxFireRotateRadius = this.owner.radius;
        this.lastEffectTime = 0;
        this.nextEffectDelay = 400;
    }

    // override
    showIndicator() {
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
        super.castSpell();

        let listFireFoxObjects = [];

        for (let i = 0; i < this.foxFireCount; i++) {
            listFireFoxObjects.push(
                new FoxFireObject({
                    angle: (360 / this.foxFireCount) * i,
                    owner: this.owner,
                    damage: this.damage,
                    speed: this.speed,
                    effectRadius: this.effectRadius,
                    abilityRef: this,
                })
            );
        }

        this.owner.world.addNewSpellObjects(listFireFoxObjects);
    }

    // override
    onStarted() {}

    // override
    onFinished() {}

    // other functions here
    isReadyToNextEffect() {
        return millis() - this.lastEffectTime > this.nextEffectDelay;
    }
}
