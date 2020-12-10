class Ability {
    constructor(config = {}) {
        for (let c in config) {
            this[c] = config[c];
        }
    }
}
