import ChampionCore from "../../../core/champion.core.js";
import AhriBasicAttack from "./ability/ahri.basic-attack.ability.js";
import OrbOfDeception from "./ability/orb-of-deception.ability.js";
import FoxFire from "./ability/fox-fire.ability.js";
import Charm from "./ability/charm.ability.js";
import SpriritRush from "./ability/spririt-rush.ability.js";
import Flash from "../../summoner-spell/flash.spell.js";

export default class Ahri extends ChampionCore {
    constructor(config = {}) {
        super(config);

        this.avatarCirclePath =
            "asset/image/champion/ahri/Ahri.avatar.circle.png";

        this.maxHealth = 500;

        this.abilities = {
            basicAttack: new AhriBasicAttack({
                owner: this,
                world: this.world,
            }),

            spell1: new OrbOfDeception({ owner: this, world: this.world }),
            spell2: new FoxFire({ owner: this, world: this.world }),
            spell3: new Charm({ owner: this, world: this.world }),
            spell4: new SpriritRush({ owner: this, world: this.world }),

            avatarSpell1: new Flash({ owner: this, world: this.world }),
            avatarSpell2: null,
        };
    }
}
