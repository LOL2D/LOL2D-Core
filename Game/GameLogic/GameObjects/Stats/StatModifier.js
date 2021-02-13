const COMPARE_EPSILON = 0.0001;

export default class StatModifier {
    baseBonus = 0; //{ get; set; }
    percentBaseBonus = 0; //{ get; set; }
    flatBonus = 0; //{ get; set; }
    percentBonus = 0; //{ get; set; }

    get statModified() {
        return (
            Math.abs(this.baseBonus) > COMPARE_EPSILON ||
            Math.abs(this.percentBaseBonus) > COMPARE_EPSILON ||
            Math.abs(this.flatBonus) > COMPARE_EPSILON ||
            Math.abs(this.percentBonus) > COMPARE_EPSILON
        );
    }
}
