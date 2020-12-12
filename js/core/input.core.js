class InputCore {
    constructor(config = {}) {
        this.hotkeys = {
            ...DEFAULT_HOTKEYS,
            ...config.hotkeys,
        };

        this.champion = config.champion;
    }

    keyDown(_keyCode, _mousePos) {
        const { hotkeys, champion } = this;

        switch (_keyCode) {
            case hotkeys.CastSpell1:
                champion.previewCastSpell("spell1", _mousePos);
                break;
            case hotkeys.CastSpell2:
                champion.previewCastSpell("spell2", _mousePos);
                break;
            case hotkeys.CastSpell3:
                champion.previewCastSpell("spell3", _mousePos);
                break;
            case hotkeys.CastSpell4:
                champion.previewCastSpell("spell4", _mousePos);
                break;
        }
    }

    keyReleased(_keyCode, _mousePos) {
        const { hotkeys, champion } = this;

        switch (_keyCode) {
            case hotkeys.CastSpell1:
                return champion.castSpell("spell1", _mousePos);
            case hotkeys.CastSpell2:
                return champion.castSpell("spell2", _mousePos);
            case hotkeys.CastSpell3:
                return champion.castSpell("spell3", _mousePos);
            case hotkeys.CastSpell4:
                return champion.castSpell("spell4", _mousePos);
        }
    }
}
