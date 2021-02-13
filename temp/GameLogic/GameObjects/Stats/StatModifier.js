import Extensions from "../../../GameCore/Extensions.js";

export default class StatModifier {
    baseBonus = 0; //{ get; set; }
    percentBaseBonus = 0; //{ get; set; }
    flatBonus = 0; //{ get; set; }
    percentBonus = 0; //{ get; set; }

    get statModified() {
        return (
            Math.abs(this.baseBonus) > Extensions.COMPARE_EPSILON ||
            Math.abs(this.percentBaseBonus) > Extensions.COMPARE_EPSILON ||
            Math.abs(this.flatBonus) > Extensions.COMPARE_EPSILON ||
            Math.abs(this.percentBonus) > Extensions.COMPARE_EPSILON
        );
    }
}
