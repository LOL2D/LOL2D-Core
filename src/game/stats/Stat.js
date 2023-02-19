import StatModifier from "./StatModifier.js";

export default class Stat extends StatModifier {
    total() {
        return (
            ((this.baseValue + this.baseBonus) * (1 + this.percentBaseBonus) +
                this.flatBonus) *
            (1 + this.percentBonus)
        );
    }

    applyModifier(statModifier = new StatModifier()) {
        this.baseValue += statModifier.baseValue;
        this.baseBonus += statModifier.baseBonus;
        this.percentBaseBonus += statModifier.percentBaseBonus;
        this.flatBonus += statModifier.flatBonus;
        this.percentBonus += statModifier.percentBonus;
    }

    removeModifier(statModifier = new StatModifier()) {
        this.baseValue -= statModifier.baseValue;
        this.baseBonus -= statModifier.baseBonus;
        this.percentBaseBonus -= statModifier.percentBaseBonus;
        this.flatBonus -= statModifier.flatBonus;
        this.percentBonus -= statModifier.percentBonus;
    }
}
