import StatModifier from "./StatModifier.js";

export default class StatsModifier {
    healthPoints = new StatModifier();
    healthRegeneration = new StatModifier();
    attackDamage = new StatModifier();
    abilityPower = new StatModifier();
    criticalChance = new StatModifier();
    criticalDamage = new StatModifier();
    armor = new StatModifier();
    magicResist = new StatModifier();
    attackSpeed = new StatModifier();
    armorPenetration = new StatModifier();
    magicPenetration = new StatModifier();
    manaPoints = new StatModifier();
    manaRegeneration = new StatModifier();
    lifeSteal = new StatModifier();
    spellVamp = new StatModifier();
    tenacity = new StatModifier();
    size = new StatModifier();
    range = new StatModifier();
    moveSpeed = new StatModifier();
    goldPerSecond = new StatModifier();
}
