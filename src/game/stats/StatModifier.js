export default class StatModifier {
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
}
