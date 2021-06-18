export default class Stat {
    constructor(
        baseValue = 0,
        baseBonus = 0,
        percentBaseBonus = 0,
        flatBonus = 0,
        percentBonus = 0
    ) {
        this.baseValue = baseValue;
        this.baseBonus = baseBonus;
        this.percentBaseBonus = percentBaseBonus;

        this.flatBonus = flatBonus;
        this.percentBonus = percentBonus;
    }

    total() {
        return (
            ((this.baseValue + this.baseBonus) * (1 + this.percentBaseBonus) +
                this.flatBonus) *
            (1 + this.percentBonus)
        );
    }

    applyModifier(statModifier = new Stat()) {
        this.baseValue += statModifier.baseValue;
        this.baseBonus += statModifier.baseBonus;
        this.percentBaseBonus += statModifier.percentBaseBonus;
        this.flatBonus += statModifier.flatBonus;
        this.percentBonus += statModifier.percentBonus;
    }

    removeModifier(statModifier = new Stat()) {
        this.baseValue -= statModifier.baseValue;
        this.baseBonus -= statModifier.baseBonus;
        this.percentBaseBonus -= statModifier.percentBaseBonus;
        this.flatBonus -= statModifier.flatBonus;
        this.percentBonus -= statModifier.percentBonus;
    }
}
