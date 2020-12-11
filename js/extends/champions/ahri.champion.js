class Ahri extends Champion {
    constructor(config = {}) {
        super(config);

        this.abilities = {
            spell1: new OrbOfDeception({ owner: this }),
            spell2: null,
            spell3: null,
            spell4: null,

            avatarSpell1: null,
            avatarSpell2: null,
        };
    }
}
