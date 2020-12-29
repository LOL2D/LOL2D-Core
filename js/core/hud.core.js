import Helper from "../helper/index.js";

export default class HUDCore {
    constructor(config) {
        this.world = null;
        this.scale = 1;

        Helper.Other.setValueFromConfig(this, config);
    }

    show() {
        this.showMainHud();
    }

    showMainHud() {
        let player = this.world.player;

        // item
        image(
            globalassets["asset/image/hud/item.png"],
            width / 2 + 390,
            height - 82
        );

        // ability
        image(
            globalassets["asset/image/hud/ability.png"],
            width / 2,
            height - 85
        );

        this.showAbility(
            player.abilities.spell1,
            width / 2 - 130,
            height - 85 - 25
        );
        this.showAbility(
            player.abilities.spell2,
            width / 2 - 55,
            height - 85 - 25
        );
        this.showAbility(
            player.abilities.spell3,
            width / 2 + 18,
            height - 85 - 25
        );
        this.showAbility(
            player.abilities.spell4,
            width / 2 + 90,
            height - 85 - 25
        );

        // avatar
        image(
            globalassets[player.avatarCirclePath],
            width / 2 - 300,
            height - 80
        );

        image(
            globalassets["asset/image/hud/avatar.png"],
            width / 2 - 300,
            height - 80
        );
    }

    showAbility(ability, x, y) {
        if (!ability) return;

        // bound
        let b = {
            x: x - 30,
            y: y - 30,
            w: 60,
            h: 60,
        };

        // image
        image(globalassets[ability.imagePath], x, y, b.w, b.h);

        // cost
        fill("#fff");
        noStroke();
        text(
            ability.cost,
            b.x + b.w - textWidth(ability.cost) * 0.5,
            b.y + GameConfig.textSize * 0.5
        );

        let isHovered = Helper.Collide.pointRect(
            mouseX,
            mouseY,
            b.x,
            b.y,
            b.w,
            b.h
        );

        let cd = ability.getCurrentCooldown();

        // ability cooldown
        if (cd > 0) {
            // background
            noStroke();
            fill("#2229");
            rect(b.x, b.y, b.w, b.h);

            // cooldown
            fill("#0B548E");
            let h = map(cd, ability.cooldown, 0, 0, b.h);
            rect(b.x, b.y + h, b.w, b.h - h);

            // hightlight line
            stroke("#fff9");
            line(b.x, b.y + h, b.x + b.w, b.y + h);

            // cooldown text
            fill("#fff");
            text(Helper.Format.abilityCountDown(cd), x, y);
        }

        // ability available
        else {
            if (isHovered) {
                stroke("#8E7C3C");
                strokeWeight(4);
                noFill();
                rect(b.x, b.y, b.w, b.h);

                // TODO draw in camera view
                this.world.camera.beginState();
                ability.showIndicator();
                this.world.camera.endState();
            }

            // hightlight border
            else {
                stroke("#8E7C3C");
                strokeWeight(2);
                noFill();
                rect(b.x, b.y, b.w, b.h);
            }
        }
    }
}
