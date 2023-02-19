import StatModifier from "./StatModifier.js";

export default class StatsModifier {
    constructor() {
        this.healthPoints = new StatModifier(); // máu tối đa
        this.manaPoints = new StatModifier(); // mana tối đa
        this.healthRegen = new StatModifier(); // hồi máu
        this.manaRegen = new StatModifier(); // hồi năng lượng
        this.moveSpeed = new StatModifier(); // tốc chạy
        this.attackSpeed = new StatModifier(); // tốc đánh
        this.attackDamage = new StatModifier(); // sát thương vật lý
        this.magicDamage = new StatModifier(); // sát thương phép
        this.attackRange = new StatModifier(); // tầm đánh
        this.attackSpeedMult = new StatModifier(); // % tốc đánh cộng thêm
        this.cooldownReduction = new StatModifier(); // giảm thời gian hồi chiêu
        this.lifeSteal = new StatModifier(); // hút máu
        this.size = new StatModifier(); // kích thước
    }
}
