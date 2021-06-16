export default class Stat {
    constructor(
        baseValue = 0,
        baseBonus = 0,
        percentBaseBonus = 0,
        flatBonus = 0,
        percentBonus = 0
    ) {
        this.modified = false;
        this.baseValue = baseValue;
        this.baseBonus = baseBonus;
        this.flatBonus = flatBonus;
        this.percentBonus = percentBonus;
        this.precentBaseBonus = percentBaseBonus;
    }

    total() {
        return (
            ((this.baseValue + this.baseBonus) * (1 + this.percentBaseBonus) +
                this.flatBonus) *
            (1 + this.percentBonus)
        );
    }

    applyStatModifier(statModifier) {
        if (!statModifier.isStatModified) {
            return false;
        }
        this.baseBonus += statModifier.baseBonus;
        this.percentBaseBonus += statModifier.percentBaseBonus;
        this.flatBonus += statModifier.flatBonus;
        this.percentBonus += statModifier.percentBonus;

        return true;
    }

    removeStatModifier(statModifier) {
        if (!statModifier.isStatModified) {
            return false;
        }
        this.baseBonus -= statModifier.baseBonus;
        this.percentBaseBonus -= statModifier.percentBaseBonus;
        this.flatBonus -= statModifier.flatBonus;
        this.percentBonus -= statModifier.percentBonus;

        return true;
    }
}
