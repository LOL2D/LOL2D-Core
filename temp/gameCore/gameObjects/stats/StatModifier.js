const COMPARE_EPSILON = 0.0001;

export default class StatModifier {
    constructor(baseBonus, percentBaseBonus, flatBonus, percentBonus) {
        this.baseBonus = baseBonus;
        this.percentBaseBonus = percentBaseBonus;
        this.flatBonus = flatBonus;
        this.percentBonus = percentBonus;
    }

    isStatModified() {
        return (
            Math.Abs(BaseBonus) > COMPARE_EPSILON ||
            Math.Abs(PercentBaseBonus) > COMPARE_EPSILON ||
            Math.Abs(FlatBonus) > COMPARE_EPSILON ||
            Math.Abs(PercentBonus) > COMPARE_EPSILON
        );
    }
}
