class InputCore {
    constructor(config = {}) {
        this.hotkeys = {
            ...DEFAULT_HOTKEYS,
            ...config.hotkeys,
        };

        this.champion = config.champion;
        this.mousePos = createVector(0, 0);
        this.previewAbilityId = null;
    }

    run(_mousePos) {
        this.mousePos = _mousePos;

        if (this.previewAbilityId) {
            this.champion.previewCastSpell(this.previewAbilityId, _mousePos);
        }
    }

    keyDown(_keyCode) {}

    keyPressed(_keyCode) {
        const { hotkeys } = this;

        switch (_keyCode) {
            case hotkeys.CastSpell1:
                this.previewAbilityId = "spell1";
                break;

            case hotkeys.CastSpell2:
                this.previewAbilityId = "spell2";
                break;

            case hotkeys.CastSpell3:
                this.previewAbilityId = "spell3";
                break;

            case hotkeys.CastSpell4:
                this.previewAbilityId = "spell4";
                break;

            default:
                this.previewAbilityId = null;
        }
    }

    keyReleased(_keyCode) {
        if (this.previewAbilityId) {
            const { hotkeys, champion } = this;

            switch (_keyCode) {
                case hotkeys.CastSpell1:
                    return champion.castSpell("spell1", this.mousePos);

                case hotkeys.CastSpell2:
                    return champion.castSpell("spell2", this.mousePos);

                case hotkeys.CastSpell3:
                    return champion.castSpell("spell3", this.mousePos);

                case hotkeys.CastSpell4:
                    return champion.castSpell("spell4", this.mousePos);
            }

            this.previewAbilityId = null;
        }
    }

    mousePressed() {
        if (this.previewAbilityId) {
            // cancel cast spell on mouse clicked
            this.previewAbilityId = null;
        }
    }
}
