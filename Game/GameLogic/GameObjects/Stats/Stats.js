import ActionState from "../../Enums/ActionState.js";
import SpellFlags from "../../Enums/SpellFlags.js";
import Stat from "./Stat.js";

export default class Stats {
    spellsEnabled; //// { get; private set; }
    summonerSpellsEnabled; // { get; private set; }

    actionState; // { get; private set; }
    parType; // { get; private set; }

    //  bool
    isMagicImmune; // { get; set; }
    isInvulnerable; // { get; set; }
    isPhysicalImmune; // { get; set; }
    isLifestealImmune; // { get; set; }
    isTargetable; // { get; set; }
    isTargetableToTeam; // { get; set; }

    // float
    attackSpeedFlat; // { get; set; }
    healthPerLevel; // { get; set; }
    manaPerLevel; // { get; set; }
    adPerLevel; // { get; set; }
    armorPerLevel; // { get; set; }
    magicResistPerLevel; // { get; set; }
    healthRegenerationPerLevel; // { get; set; }
    manaRegenerationPerLevel; // { get; set; }
    growthAttackSpeed; // { get; set; }
    manaCost; // { get; }

    //  IStat
    bilityPower; // { get; }
    armor; // { get; }
    armorPenetration; // { get; }
    attackDamage; // { get; }
    attackSpeedMultiplier; // { get; }
    cooldownReduction; // { get; }
    criticalChance; // { get; }
    criticalDamage; // { get; }
    goldPerSecond; // { get; }
    healthPoints; // { get; }
    healthRegeneration; // { get; }
    lifeSteal; // { get; }
    magicResist; // { get; }
    magicPenetration; // { get; }
    manaPoints; // { get; }
    manaRegeneration; // { get; }
    moveSpeed; // { get; }
    range; // { get; }
    size; // { get; }
    spellVamp; // { get; }
    tenacity; // { get; }

    gold; // { get; set; }
    level; // { get; set; }
    experience; // { get; set; }

    _currentHealth;
    get currentHealth() {
        return Math.min(this.healthPoints.total, this._currentHealth);
    }
    set currentHealth(value) {
        this._currentHealth = value;
    }

    _currentMana;
    get currentMana() {
        return Math.min(this.manaPoints.total, this._currentMana);
    }
    set currentMana() {
        this._currentMana = value;
    }

    isGeneratingGold; // { get; set; } // Used to determine if the Stats update should include generating gold. Changed in Champion.h
    spellCostReduction; // { get; set; } //URF Buff/Lissandra's passive

    Stats() {
        this.spellCostReduction = 0;
        this.manaCost = [];
        this.actionState =
            ActionState.CAN_ATTACK |
            ActionState.CAN_CAST |
            ActionState.CAN_MOVE |
            ActionState.UNKNOWN;
        this.isTargetable = true;
        this.isTargetableToTeam = SpellFlags.TargetableToAll;

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
        this.range = new Stat();
        this.size = new Stat(1, 0, 0, 0, 0);
        this.spellVamp = new Stat();
        this.tenacity = new Stat();
    }

    loadStats(charData) {
        this.adPerLevel = charData.damagePerLevel;
        this.armor.baseValue = charData.armor;
        this.armorPerLevel = charData.armorPerLevel;
        this.attackDamage.baseValue = charData.baseDamage;
        this.attackSpeedFlat = 0.625 / (1 + charData.attackDelayOffsetPercent);
        this.growthAttackSpeed = charData.attackSpeedPerLevel;
        this.healthPerLevel = charData.hpPerLevel;
        this.healthRegeneration.baseValue = charData.baseStaticHpRegen;
        this.healthRegenerationPerLevel = charData.hpRegenPerLevel;
        this.magicResist.baseValue = charData.spellBlock;
        this.magicResistPerLevel = charData.spellBlockPerLevel;
        this.manaPerLevel = charData.mpPerLevel;
        this.manaPoints.baseValue = charData.baseMp;
        this.manaRegeneration.baseValue = charData.baseStaticMpRegen;
        this.manaRegenerationPerLevel = charData.mpRegenPerLevel;
        this.moveSpeed.baseValue = charData.moveSpeed;
        this.parType = charData.parType;
        this.range.baseValue = charData.attackRange;
        this.healthPoints.baseValue = charData.baseHp;
    }

    addModifier(modifier) {
        this.abilityPower.applyStatModifier(modifier.abilityPower);
        this.armor.applyStatModifier(modifier.armor);
        this.armorPenetration.applyStatModifier(modifier.armorPenetration);
        this.attackDamage.applyStatModifier(modifier.attackDamage);
        this.attackSpeedMultiplier.applyStatModifier(modifier.attackSpeed);
        this.criticalChance.applyStatModifier(modifier.criticalChance);
        this.criticalDamage.applyStatModifier(modifier.criticalDamage);
        this.goldPerSecond.applyStatModifier(modifier.goldPerSecond);
        this.healthPoints.applyStatModifier(modifier.healthPoints);
        this.healthRegeneration.applyStatModifier(modifier.healthRegeneration);
        this.lifeSteal.applyStatModifier(modifier.lifeSteal);
        this.magicResist.applyStatModifier(modifier.magicResist);
        this.magicPenetration.applyStatModifier(modifier.magicPenetration);
        this.manaPoints.applyStatModifier(modifier.manaPoints);
        this.manaRegeneration.applyStatModifier(modifier.manaRegeneration);
        this.moveSpeed.applyStatModifier(modifier.moveSpeed);
        this.range.applyStatModifier(modifier.range);
        this.size.applyStatModifier(modifier.size);
        this.spellVamp.applyStatModifier(modifier.spellVamp);
        this.tenacity.applyStatModifier(modifier.tenacity);
    }

    removeModifier(modifier) {
        this.abilityPower.removeStatModifier(modifier.abilityPower);
        this.armor.removeStatModifier(modifier.armor);
        this.armorPenetration.removeStatModifier(modifier.armorPenetration);
        this.attackDamage.removeStatModifier(modifier.attackDamage);
        this.attackSpeedMultiplier.removeStatModifier(modifier.attackSpeed);
        this.criticalChance.removeStatModifier(modifier.criticalChance);
        this.criticalDamage.removeStatModifier(modifier.criticalDamage);
        this.goldPerSecond.removeStatModifier(modifier.goldPerSecond);
        this.healthPoints.removeStatModifier(modifier.healthPoints);
        this.healthRegeneration.removeStatModifier(modifier.healthRegeneration);
        this.lifeSteal.removeStatModifier(modifier.lifeSteal);
        this.magicResist.removeStatModifier(modifier.magicResist);
        this.magicPenetration.removeStatModifier(modifier.magicPenetration);
        this.manaPoints.removeStatModifier(modifier.manaPoints);
        this.manaRegeneration.removeStatModifier(modifier.manaRegeneration);
        this.moveSpeed.removeStatModifier(modifier.moveSpeed);
        this.range.removeStatModifier(modifier.range);
        this.size.removeStatModifier(modifier.size);
        this.spellVamp.removeStatModifier(modifier.spellVamp);
        this.tenacity.removeStatModifier(modifier.tenacity);
    }

    getTotalAttackSpeed() {
        return this.attackSpeedFlat * this.attackSpeedMultiplier.total;
    }

    update() {
        if (
            this.healthRegeneration.total > 0 &&
            this.currentHealth < this.healthPoints.total &&
            this.currentHealth > 0
        ) {
            let newHealth = this.currentHealth + this.healthRegeneration.total;
            newHealth = Math.min(this.healthPoints.total, newHealth);
            this.currentHealth = newHealth;
        }

        if (this.isGeneratingGold && this.goldPerSecond.total > 0) {
            let newGold = this.gold + this.goldPerSecond.total;
            this.gold = newGold;
        }

        if (this.parType > 1) {
            return;
        }

        if (
            this.manaRegeneration.total > 0 &&
            this.currentMana < this.manaPoints.total
        ) {
            let newMana = this.currentMana + this.manaRegeneration.total;
            newMana = Math.min(this.manaPoints.total, newMana);
            this.currentMana = newMana;
        }
    }

    levelUp() {
        this.level++;

        this.healthPoints.baseValue += this.healthPerLevel;
        this.currentHealth =
            (this.healthPoints.total /
                (this.healthPoints.total - this.healthPerLevel)) *
            this.currentHealth;
        this.manaPoints.baseValue = this.manaPoints.total + this.manaPerLevel;
        this.currentMana =
            (this.manaPoints.total /
                (this.manaPoints.total - this.manaPerLevel)) *
            this.currentMana;
        this.attackDamage.baseValue =
            this.attackDamage.baseValue + this.adPerLevel;
        this.armor.baseValue = this.armor.baseValue + this.armorPerLevel;
        this.magicResist.baseValue =
            this.magicResist.total + this.magicResistPerLevel;
        this.healthRegeneration.baseValue =
            this.healthRegeneration.baseValue + this.healthRegenerationPerLevel;
        this.manaRegeneration.baseValue =
            this.manaRegeneration.baseValue + this.manaRegenerationPerLevel;
    }

    // không hiểu gì hết ???!
    getSpellEnabled(id) {
        return (this.spellsEnabled & (1 << id)) != 0;
    }

    setSpellEnabled(id, enabled) {
        if (enabled) {
            this.spellsEnabled |= 1 << id;
        } else {
            this.spellsEnabled &= ~(1 << id);
        }
    }

    getSummonerSpellEnabled(id) {
        return (this.summonerSpellsEnabled & (16 << id)) != 0;
    }

    setSummonerSpellEnabled(id, enabled) {
        if (enabled) {
            this.summonerSpellsEnabled |= 16 << id;
        } else {
            this.summonerSpellsEnabled &= ~(16 << id);
        }
    }

    getActionState(state) {
        return this.actionState.hasFlag(state);
    }

    setActionState(state, enabled) {
        if (enabled) {
            this.actionState |= state;
        } else {
            this.actionState &= ~state;
        }
    }
}
