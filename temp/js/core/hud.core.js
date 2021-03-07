import DEFAULT_HOTKEYS from "../constant/hotkeys.constant.js";
import GlobalAssets from "../global/asset.global.js";
import GlobalGameConfig from "../global/game-config.global.js";
import Helper from "../helper/index.js";

export default class HUDCore {
    constructor(config) {
        this.world = null;
        this.scale = 1;

        Helper.Other.setValueFromConfig(this, config);
    }

    setScale(value) {
        this.scale = value;

        this.topleft = {
            x: width * 0.5 - 300,
            y: height - 80,
        };
    }

    show() {
        this.showMainHud();
    }

    showMainHud() {
        let player = this.world.player;

        // --------------------- item ---------------------
        image(
            GlobalAssets["asset/image/hud/item.png"],
            width * 0.5 + 390,
            height - 82
        );

        // --------------------- ability ---------------------
        image(
            GlobalAssets["asset/image/hud/ability.png"],
            width * 0.5,
            height - 85
        );

        this.showAbility(
            player.abilities.spell1,
            String.fromCharCode(DEFAULT_HOTKEYS.CastSpell1),
            width * 0.5 - 130,
            height - 85 - 25
        );
        this.showAbility(
            player.abilities.spell2,
            String.fromCharCode(DEFAULT_HOTKEYS.CastSpell2),
            width * 0.5 - 55,
            height - 85 - 25
        );
        this.showAbility(
            player.abilities.spell3,
            String.fromCharCode(DEFAULT_HOTKEYS.CastSpell3),
            width * 0.5 + 18,
            height - 85 - 25
        );
        this.showAbility(
            player.abilities.spell4,
            String.fromCharCode(DEFAULT_HOTKEYS.CastSpell4),
            width * 0.5 + 90,
            height - 85 - 25
        );
        this.showAbility(
            player.abilities.avatarSpell1,
            String.fromCharCode(DEFAULT_HOTKEYS.CastAvatarSpell1),
            width * 0.5 + 168,
            height - 118,
            43,
            43
        );
        this.showAbility(
            player.abilities.avatarSpell2,
            String.fromCharCode(DEFAULT_HOTKEYS.CastAvatarSpell2),
            width * 0.5 + 225,
            height - 118,
            43,
            43
        );

        // --------------------- health + mana ---------------------
        const { health, maxHealth } = player;
        const healthContainerW = 457;
        const healthW = map(health, 0, maxHealth, 0, healthContainerW);

        const { mana, maxMana } = player;
        const manaW = map(mana, 0, maxMana, 0, healthContainerW);

        // health
        stroke("#000");
        fill("#019204");
        rect(width * 0.5 - 215, height - 53, healthW, 20);

        // mana
        fill("#004CA1");
        rect(width * 0.5 - 215, height - 30, manaW, 15);

        // text
        fill("white");
        text(
            ~~health + " / " + maxHealth,
            width * 0.5,
            height - 51 + GlobalGameConfig.textSize * 0.5
        );
        text(
            ~~mana + " / " + maxMana,
            width * 0.5,
            height - 30 + GlobalGameConfig.textSize * 0.5
        );

        // --------------------- avatar ---------------------
        image(
            GlobalAssets[player.avatarCirclePath],
            width * 0.5 - 300,
            height - 80
        );

        image(
            GlobalAssets["asset/image/hud/avatar.png"],
            width * 0.5 - 300,
            height - 80
        );

        // level
        text(player.level, width * 0.5 - 272, height - 25);
    }

    showAbility(ability, hotkey, x, y, w = 60, h = 60) {
        if (!ability) return;

        // bound
        let b = {
            x: x - w * 0.5,
            y: y - h * 0.5,
            w: w,
            h: h,
        };

        // image
        image(GlobalAssets[ability.imagePath], x, y, b.w, b.h);

        // cost
        if (ability.cost) {
            fill("#fff");
            text(
                ability.cost,
                b.x + b.w - textWidth(ability.cost) * 0.5,
                b.y + GlobalGameConfig.textSize * 0.5
            );
        }

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
            let _h = map(cd, ability.cooldown, 0, 0, b.h);
            rect(b.x, b.y + _h, b.w, b.h - _h);

            // hightlight line
            stroke("#fff9");
            line(b.x, b.y + _h, b.x + b.w, b.y + _h);

            // cooldown text
            fill("#fff");
            stroke("#000");
            text(Helper.Format.abilityCountDown(cd), x, y);
        }

        // not enough mana
        else if (this.world.player.mana < ability.cost) {
            fill("#2229");
            rect(b.x, b.y, b.w, b.h);
        }

        // ability available
        else {
            if (isHovered) {
                stroke("#8E7C3C");
                noFill();
                rect(b.x, b.y, b.w, b.h);

                // TODO draw in camera view
                this.world.camera.beginState();
                ability.showIndicator(this.world.getMousePosition());
                this.world.camera.endState();
            }

            // hightlight border
            else {
                stroke("#8E7C3C");
                noFill();
                rect(b.x, b.y, b.w, b.h);
            }
        }

        // hot key
        fill("#f5d664");
        stroke("#000");
        text(hotkey, b.x, b.y + b.w);
    }
}
