import Stat from "./Stat.js";

export default class Stats {
    constructor() {
        this.maxHealth = new Stat(700); // máu tối đa
        this.maxMana = new Stat(500); // mana tối đa
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
        this.size = new Stat(75); // kích thước

        this.currentHealth = this.maxHealth.total();
        this.currentMana = this.maxMana.total();
    }

    addModifier(statsModifier = new Stats()) {
        this.maxHealth.addModifier(statsModifier.maxHealth);
        this.maxMana.addModifier(statsModifier.maxMana);
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
    }

    removeModifier(statsModifier = new Stats()) {
        this.maxHealth.removeModifier(statsModifier.maxHealth);
        this.maxMana.removeModifier(statsModifier.maxMana);
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
    }
}
