class Jinx extends ChampionCore {
    constructor(config = {}) {
        super(config);

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
