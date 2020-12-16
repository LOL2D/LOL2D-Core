class Ahri extends ChampionCore {
    constructor(config = {}) {
        super(config);

        this.avatarCirclePath = "asset/image/champion/ahri/Ahri.avatar.circle.png";

        this.maxHealth = 500;

        this.abilities = {
            spell1: new OrbOfDeception({ owner: this }),
            spell2: new FoxFire({ owner: this }),
            spell3: null,
            spell4: null,

            avatarSpell1: null,
            avatarSpell2: null,
        };
    }
}
