import ChampionCore from "../../../core/champion.core.js";

export default class Jinx extends ChampionCore {
    constructor(config = {}) {
        super(config);

        this.avatarCirclePath =
            "asset/image/champion/jinx/Jinx.avatar.circle.png";

        this.abilities = {
            spell1: null,
            spell2: null,
            spell3: null,
            spell4: null,

            avatarSpell1: null,
            avatarSpell2: null,
        };
    }
}
