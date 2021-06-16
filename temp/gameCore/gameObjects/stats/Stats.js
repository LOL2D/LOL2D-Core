import Stat from "./Stat.js";

export default class Stats {
    constructor() {
        //this.spellCostReduction = 0; // giảm sử dụng mana???
        //this.manaCost = []; // new float[64]() // idk
        this.isTargetable = true; // có thể chọn làm mục tiêu hay không
        this.actionState =
            ActionState.CAN_ATTACK |
            ActionState.CAN_CAST |
            ActionState.CAN_MOVE |
            ActionState.UNKNOWN;

        this.abilityPower = new Stat(); // sức mạnh phép thuật
        this.armor = new Stat(); // giáp
        this.attackDamage = new Stat(); // sức mạnh vật lý
        this.healthPoints = new Stat(); // máu
        this.magicResist = new Stat(); // kháng phép
        this.manaPoints = new Stat(); // năng lượng
        this.moveSpeed = new Stat(); // tốc độ di chuyển
        this.attackRange = new Stat(); // tầm đánh
        this.size = new Stat(1, 0, 0, 0, 0); // kích thước

        this.currentHealth = this.healthPoints.total(); // máu hiện tại
        this.currentMana = this.manaPoints.total(); // năng lượng hiện tại

        this.level = 1;

        // this.manaRegeneration = new Stat(); // hồi năng lượng
        // this.magicPenetration = new Stat(); // xuyên phép
        // this.healthRegeneration = new Stat(); // hồi máu
        // this.lifeSteal = new Stat(); // hút máu
        // this.armorPenetration = new Stat(); // xuyên giáp
        // this.attackSpeedMultiplier = new Stat(1, 0, 0, 0, 0); // % tốc đánh cộng thêm
        // this.cooldownReduction = new Stat(); // giảm thời gian hồi chiêu
        // this.criticalChance = new Stat(); // tỉ lệ chí mạng
        // this.criticalDamage = new Stat(2, 0, 0, 0, 0); // sát thương chí mạng
        // this.goldPerSecond = new Stat(); // vàng/giây
        // this.spellVamp = new Stat(); // giảm thời gian hồi chiêu khi đánh thường???
        // this.tenacity = new Stat(); // kháng làm chậm ???
    }

    addModifier(modifier) {
        this.abilityPower.ApplyStatModifier(modifier.abilityPower);
        this.armor.ApplyStatModifier(modifier.armor);
        this.attackDamage.ApplyStatModifier(modifier.attackDamage);
        this.healthPoints.ApplyStatModifier(modifier.healthPoints);
        this.magicResist.ApplyStatModifier(modifier.magicResist);
        this.manaPoints.ApplyStatModifier(modifier.manaPoints);
        this.moveSpeed.ApplyStatModifier(modifier.moveSpeed);
        this.attackRange.ApplyStatModifier(modifier.attackRange);
        this.size.ApplyStatModifier(modifier.size);

        // this.manaRegeneration.ApplyStatModifier(modifier.manaRegeneration);
        // this.magicPenetration.ApplyStatModifier(modifier.magicPenetration);
        // this.healthRegeneration.ApplyStatModifier(modifier.healthRegeneration);
        // this.lifeSteal.ApplyStatModifier(modifier.lifeSteal);
        // this.armorPenetration.ApplyStatModifier(modifier.armorPenetration);
        // this.attackSpeedMultiplier.ApplyStatModifier(modifier.attackSpeedMultiplier);
        // this.criticalChance.ApplyStatModifier(modifier.criticalChance);
        // this.criticalDamage.ApplyStatModifier(modifier.criticalDamage);
        // this.goldPerSecond.ApplyStatModifier(modifier.goldPerSecond);
        // this.spellVamp.ApplyStatModifier(modifier.spellVamp);
        // this.tenacity.ApplyStatModifier(modifier.tenacity);
    }

    removeModifier(modifier) {
        this.abilityPower.removeModifier(modifier.abilityPower);
        this.armor.removeModifier(modifier.armor);
        this.attackDamage.removeModifier(modifier.attackDamage);
        this.healthPoints.removeModifier(modifier.healthPoints);
        this.magicResist.removeModifier(modifier.magicResist);
        this.manaPoints.removeModifier(modifier.manaPoints);
        this.moveSpeed.removeModifier(modifier.moveSpeed);
        this.attackRange.removeModifier(modifier.attackRange);
        this.size.removeModifier(modifier.size);

        // this.manaRegeneration.removeModifier(modifier.manaRegeneration);
        // this.magicPenetration.removeModifier(modifier.magicPenetration);
        // this.healthRegeneration.removeModifier(modifier.healthRegeneration);
        // this.lifeSteal.removeModifier(modifier.lifeSteal);
        // this.armorPenetration.removeModifier(modifier.armorPenetration);
        // this.attackSpeedMultiplier.removeModifier(modifier.attackSpeedMultiplier);
        // this.criticalChance.removeModifier(modifier.criticalChance);
        // this.criticalDamage.removeModifier(modifier.criticalDamage);
        // this.goldPerSecond.removeModifier(modifier.goldPerSecond);
        // this.spellVamp.removeModifier(modifier.spellVamp);
        // this.tenacity.removeModifier(modifier.tenacity);
    }

    // update() {
    //     // HealthRegeneration
    //     // Generating Gold
    //     // ManaRegeneration
    // }

    // levelUp() {
    //     this.level++;
    //     // TODO: upgrade stats
    // }
}
