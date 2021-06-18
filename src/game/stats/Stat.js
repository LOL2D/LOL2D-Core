export default class Stat {
    constructor(
        baseValue = 0,
        baseBouns = 0,
        percentBaseBonus = 0,
        flatBonus = 0,
        percentBonus = 0
    ) {
        this.baseValue = baseValue;
        this.baseBouns = baseBouns;
        this.percentBaseBonus = percentBaseBonus;

        this.flatBonus = flatBonus;
        this.percentBonus = percentBonus;
    }

    applyModifier(statModifier = new Stat()) {
        this.baseValue += statModifier.baseValue;
        this.baseBouns += statModifier.baseBouns;
        this.percentBaseBonus += statModifier.percentBaseBonus;
        this.flatBonus += statModifier.flatBonus;
        this.percentBonus += statModifier.percentBonus;
    }

    removeModifier(statModifier = new Stat()) {
        this.baseValue -= statModifier.baseValue;
        this.baseBouns -= statModifier.baseBouns;
        this.percentBaseBonus -= statModifier.percentBaseBonus;
        this.flatBonus -= statModifier.flatBonus;
        this.percentBonus -= statModifier.percentBonus;
    }
}
