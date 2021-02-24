export default class Stat {
    #modified;
    #baseValue;
    #baseBonus;
    #flatBonus;
    #percentBonus;
    #percentBaseBonus;

    get modified() {
        return this.#modified;
    }
    set modified(value) {
        this.#modified = value;
    }

    get baseBonus() {
        return this.#baseBonus;
    }
    set baseBonus(value) {
        this.modified = true;
        this.#baseBonus = value;
    }

    get flatBonus() {
        return this.#flatBonus;
    }
    set flatBonus(value) {
        this.modified = true;
        this.#flatBonus = value;
    }

    get baseValue() {
        return this.#baseValue;
    }
    set baseValue(value) {
        this.modified = true;
        this.#baseValue = value;
    }

    get percentBonus() {
        return this.#percentBonus;
    }
    set percentBonus(value) {
        this.modified = true;
        this.#percentBonus = value;
    }

    get percentBaseBonus() {
        return this.#percentBaseBonus;
    }
    set percentBaseBonus(value) {
        this.modified = true;
        this.#percentBaseBonus = value;
    }

    get total() {
        return (
            ((this.baseValue + this.baseBonus) * (1 + this.percentBaseBonus) +
                this.flatBonus) *
            (1 + this.percentBonus)
        );
    }

    constructor(
        baseValue = 0,
        baseBonus = 0,
        percentBaseBonus = 0,
        flatBonus = 0,
        percentBonus = 0
    ) {
        this.#baseValue = baseValue;
        this.#baseBonus = baseBonus;
        this.#percentBaseBonus = percentBaseBonus;
        this.#flatBonus = flatBonus;
        this.#percentBonus = percentBonus;
        this.modified = false;
    }

    applyStatModifier(statModifier) {
        if (!statModifier.statModified) {
            return false;
        }
        this.baseBonus += statModifier.baseBonus;
        this.percentBaseBonus += statModifier.percentBaseBonus;
        this.flatBonus += statModifier.flatBonus;
        this.percentBonus += statModifier.percentBonus;

        return true;
    }

    removeStatModifier(statModifier) {
        if (!statModifier.statModified) {
            return false;
        }
        this.baseBonus -= statModifier.baseBonus;
        this.percentBaseBonus -= statModifier.percentBaseBonus;
        this.flatBonus -= statModifier.flatBonus;
        this.percentBonus -= statModifier.percentBonus;

        return true;
    }
}
