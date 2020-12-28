import ChampionCore from "../../../core/champion.core.js";
import AhriBasicAttack from "./ability/ahri.basic-attack.ability.js";
import OrbOfDeception from "./ability/orb-of-deception.ability.js";
import FoxFire from "./ability/fox-fire.ability.js";

export default class Ahri extends ChampionCore {
    constructor(config = {}) {
        super(config);

        this.avatarCirclePath =
            "asset/image/champion/ahri/Ahri.avatar.circle.png";

        this.maxHealth = 500;

        this.abilities = {
            basicAttack: new AhriBasicAttack({ owner: this }),

            spell1: new OrbOfDeception({ owner: this }),
            spell2: new FoxFire({ owner: this }),
            spell3: null,
            spell4: null,

            avatarSpell1: null,
            avatarSpell2: null,
        };
    }
}
