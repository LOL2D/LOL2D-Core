class Ahri extends ChampionCore {
    constructor(config = {}) {
        super(config);

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
