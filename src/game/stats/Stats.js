import Stat from "./Stat.js";
import StatsModifier from "./StatsModifier.js";

export default class Stats {
    constructor() {
        this.healthPoints = new Stat(700); // máu tối đa
        this.manaPoints = new Stat(500); // mana tối đa
        this.healthRegen = new Stat(); // hồi máu
        this.manaRegen = new Stat(); // hồi năng lượng
        this.moveSpeed = new Stat(3); // tốc chạy
        this.attackSpeed = new Stat(1); // tốc đánh
        this.attackDamage = new Stat(65); // sát thương vật lý
        this.magicDamage = new Stat(0); // sát thương phép
        this.attackRange = new Stat(150); // tầm đánh
        this.attackSpeedMult = new Stat(); // % tốc đánh cộng thêm
        this.cooldownReduction = new Stat(); // giảm thời gian hồi chiêu
        this.lifeSteal = new Stat(); // hút máu
        this.size = new Stat(65); // kích thước
    }

    get currentHealth() {
        return this.healthPoints.total();
    }

    get currentMana() {
        return this.manaPoints.total();
    }

    addModifier(statsModifier = new StatsModifier()) {
        this.healthPoints.addModifier(statsModifier.healthPoints);
        this.manaPoints.addModifier(statsModifier.manaPoints);
        this.healthRegen.addModifier(statsModifier.healthRegen);
        this.manaRegen.addModifier(statsModifier.manaRegen);
        this.moveSpeed.addModifier(statsModifier.moveSpeed);
        this.attackSpeed.addModifier(statsModifier.attackSpeed);
        this.attackDamage.addModifier(statsModifier.attackDamage);
        this.magicDamage.addModifier(statsModifier.magicDamage);
        this.attackRange.addModifier(statsModifier.attackRange);
        this.attackSpeedMult.addModifier(statsModifier.attackSpeedMult);
        this.cooldownReduction.addModifier(statsModifier.cooldownReduction);
        this.lifeSteal.addModifier(statsModifier.lifeSteal);
        this.size.addModifier(statsModifier.size);
        return this;
    }

    removeModifier(statsModifier = new StatsModifier()) {
        this.healthPoints.removeModifier(statsModifier.healthPoints);
        this.manaPoints.removeModifier(statsModifier.manaPoints);
        this.healthRegen.removeModifier(statsModifier.healthRegen);
        this.manaRegen.removeModifier(statsModifier.manaRegen);
        this.moveSpeed.removeModifier(statsModifier.moveSpeed);
        this.attackSpeed.removeModifier(statsModifier.attackSpeed);
        this.attackDamage.removeModifier(statsModifier.attackDamage);
        this.magicDamage.removeModifier(statsModifier.magicDamage);
        this.attackRange.removeModifier(statsModifier.attackRange);
        this.attackSpeedMult.removeModifier(statsModifier.attackSpeedMult);
        this.cooldownReduction.removeModifier(statsModifier.cooldownReduction);
        this.lifeSteal.removeModifier(statsModifier.lifeSteal);
        this.size.removeModifier(statsModifier.size);
        return this;
    }
}
