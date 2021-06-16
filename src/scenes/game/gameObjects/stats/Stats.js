import Stat from "./Stat.js";

export default class Stats {
    constructor() {
        this.spellCostReduction = 0;
        this.manaCost = []; // new float[64]()
        this.isTargetable = true;
        this.actionState =
            ActionState.CAN_ATTACK |
            ActionState.CAN_CAST |
            ActionState.CAN_MOVE |
            ActionState.UNKNOWN;

        this.abilityPower = new Stat();
        this.armor = new Stat();
        this.armorPenetration = new Stat();
        this.attackDamage = new Stat();
        this.attackSpeedMultiplier = new Stat(1, 0, 0, 0, 0);
        this.cooldownReduction = new Stat();
        this.criticalChance = new Stat();
        this.criticalDamage = new Stat(2, 0, 0, 0, 0);
        this.goldPerSecond = new Stat();
        this.healthPoints = new Stat();
        this.healthRegeneration = new Stat();
        this.lifeSteal = new Stat();
        this.magicResist = new Stat();
        this.magicPenetration = new Stat();
        this.manaPoints = new Stat();
        this.manaRegeneration = new Stat();
        this.moveSpeed = new Stat();
        this.attackRange = new Stat();
        this.size = new Stat(1, 0, 0, 0, 0);
        this.spellVamp = new Stat();
        this.tenacity = new Stat();
    }
}
