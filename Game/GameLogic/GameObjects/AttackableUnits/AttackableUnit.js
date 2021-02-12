import SpellFlags from "../../Enums/SpellFlags.js";
import DamageType from "../../Enums/DamageType.js";
import BuffAddType from "../../Enums/BuffAddType.js";
import ApiEventManager from "../../API/ApiEventManager.js.js.js";
import GameObject from "../GameObject.js";

/// Base class for all attackable units.
/// AttackableUnits normally follow these guidelines of functionality: Death state, forced movements, Crowd Control, stats (including modifiers and basic replication), Buffs (and their scripts), and Call for Help.
export default class AttackableUnit extends GameObject {
    // Crucial Vars.
    _statUpdateTimer;
    _buffsLock;

    // Utility Vars.
    static DETECT_RANGE = 475;
    static EXP_RANGE = 1400;

    /// Whether or not this Unit is dead. Refer to TakeDamage() and Die().
    isDead; //{ get; protected set; }
    /// Whether or not this Unit's model has been changeds this tick. Resets to False when the next tick update happens in objectManager.
    ismodelUpdated; //{ get; set; }
    /// The "score" of this Unit which increases as kills are gained and decreases as deaths are inflicted.
    /// Used in determining kill gold rewards.
    killDeathCounter; //{ get; set; }
    /// Number of minions this Unit has killed. Unused besides in replication which is used for packets, refer to NotifyUpdatestats in PacketNotifier.
    /// TODO: Verify if we want to move this to ObjAIBase since AttackableUnits cannot attack or kill anything.
    minionCounter; //{ get; protected set; }
    /// This Unit's current internally named model.
    model; //{ get; protected set; }
    /// stats used purely in networking the accompishments or status of units and their gameplay affecting stats.
    replication; //{ get; protected set; }
    /// Variable housing all of this Unit's stats such as health, mana, armor, magic resist, ActionState, etc.
    /// Currently these are only initialized manually by ObjAIBase and ObjBuilding.
    stats; //{ get; protected set; }
    /// Array of buff slots which contains all parent buffs (oldest buff of a given name) applied to this AI.
    /// Maximum of 256 slots, hard limit due to packets.
    /// TODO: Move to AttackableUnit.
    buffSlots; //{ get; }
    /// Dictionary containing all parent buffs (oldest buff of a given name). Used for packets and assigning stacks if a buff of the same name is added.
    /// TODO: Move to AttackableUnit.
    parentBuffs; //{ get; }
    /// List of all buffs applied to this AI. Used for easier indexing of buffs.

    /// TODO: Verify if we can remove this in favor of buffSlots while keeping the functions which allow for easy accessing of individual buff instances.
    /// TODO: Move to AttackableUnit.
    buffList; //{ get; }
    /// waypoints that make up the path a game object is walking in.
    waypoints; //{ get; protected set; }
    /// Index of the waypoint in the list of waypoints that the object is currently on.
    currentWaypoint; //{ get; protected set; }
    /// List of all crowd control (movement enhancing/dehancing) based effects applied to this unit.
    crowdControls; //{ get; protected set; }
    /// Speed of the unit's current dash.

    /// TODO: Implement a dash class so dash based variables and functions can be separate from units.
    dashSpeed; //{ get; set; }
    /// Amount of time passed since the unit started dashing.
    /// TODO: Implement a dash class so dash based variables and functions can be separate from units.
    dashElapsedTime; //{ get; set; }
    /// Total amount of time the unit will dash.
    /// TODO: Implement a dash class so dash based variables and functions can be separate from units.
    dashTime; //{ get; set; }
    /// Whether or not this unit is currently dashing.
    isDashing; //{ get; protected set; }
    
    constructor(
        game,
        model,
        stats,
        collisionRadius = 40,
        position = createVector(),
        visionRadius = 0,
        netId = 0,
        team = TeamId.TEAM_NEUTRAL
    ) {
        super(game, position, collisionRadius, visionRadius, netId, team);

        this.stats = stats;
        this.model = model;
        this.waypoints = [position.copy()];
        this.currentWaypoint = {
            index: 1,
            value: position,
        };
        this.crowdControls = [];
        this.isDashing = false;
        this.stats.attackSpeedMultiplier.baseValue = 1.0;

        this._buffsLock = {};
        this.buffSlots = [];
        this.parentBuffs = {};
        this.buffList = [];
    }
    // override
    onAdded() {
        super.onAdded();
        _game.objectManager.addVisionUnit(this);
    }
    /// Gets the HashString for this unit's model. Used for packets so clients know what data to load.
    /// <returns>Hashed string of this unit's model.</returns>
    getObjHash() {
        let gobj = "[Character]" + model;

        // TODO: Account for any other units that have skins (requires skins to be implemented for those units)
        if (this instanceof IChampion) {
            let szSkin = "";
            if (this.skin < 10) {
                szSkin = "0" + this.skin;
            } else {
                szSkin = this.skin.toString();
            }            gobj += szSkin;
        }
        return HashFunctions.hashStringNorm(gobj);
    }
    // override
    Update(diff) {
        // TODO: Rework stat management.
        this._statUpdateTimer += diff;

        while (_statUpdateTimer >= 500) {
            // update stats (hpregen, manaregen) every 0.5 seconds
            stats.Update(_statUpdateTimer);
            this._statUpdateTimer -= 500;
        }
        // TODO: Move this to AttackableUnit alongside the scriptengine variable.
        let onUpdate = this._game.scriptEngine.getStaticMethod(
            this.model,
            "Passive",
            "OnUpdate"
        );
        onUpdate?.invoke(this, diff);

        if (this.isMoving()) {
            this.move(diff);
        }
        for (let cc in this.crowdControls) {
            this.crowdControls[cc].update(diff);
        }
        this.crowdControls = this.crowdControls.filter((cc) => !cc.isRemoved);

        if (this.isDashing) {
            if (this.dashTime <= 0) {
                this.setDashingState(false);
                return;
            }
            this.dashElapsedTime += diff;
            if (this.dashElapsedTime >= this.dashTime) {
                this.setDashingState(false);
            }        }    }
    // override
    onRemoved() {
        super.onRemoved();
        this._game.objectManager.removeVisionUnit(this);
    }
    /// Sets the position of this unit to the specified position and stops its movements.
    /// <param name="x">X coordinate to set.</param>
    /// <param name="y">Y coordinate to set.</param>
    // override
    teleportTo(x, y) {
        this.stopMovement();
        super.teleportTo(x, y);
    }
    /// Called when this unit collides with the terrain or with another GameObject. Refer to CollisionHandler for exact cases.
    /// <param name="collider">GameObject that collided with this AI. Null if terrain.</param>
    /// <param name="isTerrain">Whether or not this AI collided with terrain.</param>
    // override
    onCollision(collider, isTerrain = false) {
        // TODO: Account for dashes that collide with terrain.
        if (this.isDashing) {
            return;
        }
        super.onCollision(collider, isTerrain);

        if (
            collider instanceof IObjMissile ||
            collider instanceof IObjBuilding
        ) {
            // TODO: Implement OnProjectileCollide/Hit here.
            return;
        }
        if (isTerrain) {
            let onCollideWithTerrain = this._game.scriptEngine.getStaticMethod(
                this.model,
                "Passive",
                "onCollideWithTerrain"
            );
            onCollideWithTerrain?.invoke(this);
        } else {
            let onCollide = this._game.scriptEngine.getStaticMethod(
                this.model,
                "Passive",
                "onCollide"
            );
            onCollide?.invoke(this, collider);

            // Teleport out of other objects (+1 for insurance).
            let exit = Extensions.getCircleEscapePoint(
                this.position,
                this.collisionRadius * 2,
                collider.position,
                collider.collisionRadius
            );
            this.teleportTo(exit.x, exit.y);
        }    }
    /// Returns whether or not this unit is targetable to the specified team.
    /// <param name="team">TeamId to check for.</param>
    /// <returns>True/False.</returns>
    getIsTargetableToTeam(team) {
        if (!this.stats.isTargetable) {
            return false;
        }
        if (this.team == team) {
            return !this.stats.isTargetableToTeam.hasFlag(
                SpellFlags.NonTargetableAlly
            );
        }
        return !this.stats.isTargetableToTeam.hasFlag(
            SpellFlags.NonTargetableEnemy
        );
    }
    /// Sets whether or not this unit should be targetable.
    /// <param name="targetable">True/False.</param>
    setIsTargetable(targetable) {
        this.stats.isTargetable = targetable;
    }
    /// Sets whether or not this unit is targetable to the specified team.
    /// <param name="team">TeamId to change.</param>
    /// <param name="targetable">True/False.</param>
    setIsTargetableToTeam(team, targetable) {
        this.stats.IsTargetableToTeam &= ~SpellFlags.TargetableToAll;
        if (team == this.team) {
            if (!targetable) {
                this.stats.isTargetableToTeam |= SpellFlags.NonTargetableAlly;
            } else {
                this.stats.isTargetableToTeam &= ~SpellFlags.NonTargetableAlly;
            }        } else {
            if (!targetable) {
                this.stats.isTargetableToTeam |= SpellFlags.NonTargetableEnemy;
            } else {
                this.stats.isTargetableToTeam &= ~SpellFlags.NonTargetableEnemy;
            }        }    }
    /// Adds a modifier to this unit's stats, ex: Armor, Attack Damage, Movespeed, etc.
    /// <param name="statModifier">Modifier to add.</param>
    addStatModifier(statModifier) {
        this.stats.addModifier(statModifier);
    }
    /// Removes the given stat modifier instance from this unit.
    /// <param name="statModifier">Stat modifier instance to remove.</param>
    removeStatModifier(statModifier) {
        this.stats.removeModifier(statModifier);
    }
    /// Applies damage to this unit.
    /// <param name="attacker">Unit that is dealing the damage.</param>
    /// <param name="damage">Amount of damage to deal.</param>
    /// <param name="type">Whether the damage is physical, magical, or true.</param>
    /// <param name="source">What the damage came from: attack, spell, summoner spell, or passive.</param>
    /// <param name="damageText">Type of damage the damage text should be.</param>
    takeDamageWithText(attacker, damage, type, source, damageText) {
        let defense = 0;
        let regain = 0;
        let attackerStats = attacker.stats;

        switch (type) {
            case DamageType.DAMAGE_TYPE_PHYSICAL:
                defense = this.stats.armor.total;
                defense =
                    (1 - attackerStats.armorPenetration.percentBonus) *
                        defense -
                    attackerStats.armorPenetration.flatBonus;

                break;
            case DamageType.DAMAGE_TYPE_MAGICAL:
                defense = stats.magicPenetration.total;
                defense =
                    (1 - attackerStats.magicPenetration.percentBonus) *
                        defense -
                    attackerStats.magicPenetration.flatBonus;
                break;
            case DamageType.DAMAGE_TYPE_TRUE:
                break;
            default:
                throw new Error("ArgumentOutOfRangeException." + type);
        }
        switch (source) {
            case DamageSource.DAMAGE_SOURCE_RAW:
                break;
            case DamageSource.DAMAGE_SOURCE_INTERNALRAW:
                break;
            case DamageSource.DAMAGE_SOURCE_PERIODIC:
                break;
            case DamageSource.DAMAGE_SOURCE_PROC:
                break;
            case DamageSource.DAMAGE_SOURCE_REACTIVE:
                break;
            case DamageSource.DAMAGE_SOURCE_ONDEATH:
                break;
            case DamageSource.DAMAGE_SOURCE_SPELL:
                regain = attackerStats.spellVamp.total;
                break;
            case DamageSource.DAMAGE_SOURCE_ATTACK:
                regain = attackerStats.lifeSteal.total;
                break;
            case DamageSource.DAMAGE_SOURCE_DEFAULT:
                break;
            case DamageSource.DAMAGE_SOURCE_SPELLAOE:
                break;
            case DamageSource.DAMAGE_SOURCE_SPELLPERSIST:
                break;
            case DamageSource.DAMAGE_SOURCE_PET:
                break;
            default:
                throw new Error("ArgumentOutOfRangeException." + source);
        }
        if (damage < 0) {
            damage = 0;
        } else {
            //Damage dealing. (based on leagueoflegends' wikia)
            damage =
                defense >= 0
                    ? (100 / (100 + defense)) * damage
                    : (2 - 100 / (100 - defense)) * damage;
        }
        ApiEventManager.onUnitDamageTaken.publish(this);

        this.stats.currentHealth = Math.max(
            0.0,
            this.stats.currentHealth - damage
        );
        if (!this.isDead && this.stats.currentHealth <= 0) {
            this.isDead = true;
            this.die(attacker);
        }
        let attackerId = 0,
            targetId = 0;

        // todo: check if damage dealt by disconnected players cause anything bad
        if (attacker instanceof IChampion) {
            attackerId = this._game.playerManager.getClientInfoByChampion(
                attacker
            ).playerId;
        }
        if (this instanceof IChampion) {
            targetId = this._game.playerManager.getClientInfoByChampion(
                attacker
            ).playerId;
        }
        // Show damage text for owner of pet
        if (
            attacker instanceof IMinion &&
            attacker.isPet &&
            attacker.owner instanceof IChampion
        ) {
            attackerId = this._game.playerManager.getClientInfoByChampion(
                attacker.owner
            ).playerId;
        }
        this._game.packetNotifier.notifyUnitApplyDamage(
            attacker,
            this,
            damage,
            type,
            damageText,
            this._game.config.isDamageTextGlobal,
            attackerId,
            targetId
        );

        // TODO: send this in one place only
        this._game.packetNotifier.notifyUpdatedstats(this, false);

        // Get health from lifesteal/spellvamp
        if (regain > 0) {
            attackerStats.currentHealth = Math.min(
                attackerStats.healthPoints.total,
                attackerStats.currentHealth + regain * damage
            );
            // TODO: send this in one place only (preferably a central EventHandler class)
            this._game.packetNotifier.notifyUpdatedstats(attacker, false);
        }    }
    /// Applies damage to this unit.
    /// <param name="attacker">Unit that is dealing the damage.</param>
    /// <param name="damage">Amount of damage to deal.</param>
    /// <param name="type">Whether the damage is physical, magical, or true.</param>
    /// <param name="source">What the damage came from: attack, spell, summoner spell, or passive.</param>
    /// <param name="isCrit">Whether or not the damage text should be shown as a crit.</param>
    takeDamage(attacker, damage, type, source, isCrit) {
        let text = DamageResultType.RESULT_NORMAL;

        if (isCrit) {
            text = DamageResultType.RESULT_CRITICAL;
        }
        this.takeDamageWithText(attacker, damage, type, source, text);
    }
    /// Whether or not this unit is currently calling for help. Unimplemented.
    /// <returns>True/False.</returns>
    /// TODO: Implement this.
    isInDistress() {
        return false; //return DistressCause;
    }
    /// Function called when this unit's health drops to 0 or less.
    /// <param name="killer">Unit which killed this unit.</param>
    die(killer) {
        this.setToRemove();
        this._game.objectManager.stopTargeting(this);

        this._game.packetNotifier.notifyNpcDie(this, killer);

        let onDie = this._game.scriptEngine.getStaticMethod(
            this.model,
            "Passive",
            "OnDie"
        );
        onDie?.invoke(this, killer);

        let exp = this._game.map.mapProperties.getExperienceFor(this);
        let champs = this._game.objectManager.getChampionsInRange(
            this.position,
            this.EXP_RANGE,
            true
        );

        //Cull allied champions
        // TODO: @HoangTran champs is Object {}, can not using filter here, create helper function instead
        champs = champs.filter((l) => l.team != this.team);

        if (champs.length > 0) {
            let expPerChamp = exp / champs.length;
            for (let key in champs) {
                let c = champs[key];
                c.stats.experience += expPerChamp;
                this._game.packetNotifier.notifyAddXp(c, expPerChamp);
            }        }
        if (killer != null && killer instanceof IChampion) killer.onKill(this);
    }
    /// Sets this unit's current model to the specified internally named model. *NOTE*: If the model is not present in the client files, all connected players will crash.
    /// <param name="model">Internally named model to set.</param>
    /// <returns></returns>
    /// TODO: Implement model verification (perhaps by making a list of all models in Content) so that clients don't crash if a model which doesn't exist in client files is given.
    changeModel(model) {
        if (model.equals(this.model)) {
            return false;
        }        this.ismodelUpdated = true;
        this.model = model;
        return true;
    }
    /// Adds the given buff instance to this unit.
    /// <param name="b">Buff instance to add.</param>
    /// TODO: Probably needs a refactor to lessen thread usage. Make sure to stick very closely to the current method; just optimize it.
    addBuff(b) {
        // If this is the first buff of this name to be added, then add it to the parent buffs list (regardless of its add type).
        if (!(b.name in this.parentBuffs)) {
            // If the parent buff has ended, make the next oldest buff the parent buff.
            if (this.hasBuff(b.name)) {
                let buff = this.getBuffsWithName(b.Name)[0];
                this.parentBuffs[b.name] = buff;
                return;
            }            // If there is no other buffs of this name, make it the parent and add it normally.
            this.parentBuffs[b.name] = b;
            this.buffList.push(b);
            // Add the buff to the visual hud.
            if (!b.isHidden) {
                this._game.packetNotifier.notifyNPC_BuffAdd2(b);
            }            // Activate the buff for BuffScripts
            b.activateBuff();
        }        // If the buff is supposed to replace any existing buff instances of the same name
        else if (b.buffAddType == BuffAddType.REPLACE_EXISTING) {
            // Removing the previous buff of the same name.
            let prevbuff = this.parentBuffs[b.name];

            prevbuff.deactivateBuff();
            this.removeBuff(b.name);
            this.buffList.splice(this.buffList.indexOf(prevbuff), 1);

            // Clear the newly given buff's slot since we will move it into the previous buff's slot.
            this.removeBuffSlot(b);

            // Adding the newly given buff instance into the slot of the previous buff.
            this.buffSlots[prevbuff.slot] = b;
            b.setSlot(prevbuff.slot);

            // Add the buff as a parent and normally.
            this.parentBuffs[b.name] = b;
            this.buffList.push(b);

            // Update the visual buff in-game (usually just resets the buff time of the visual icon).
            if (!b.isHidden) {
                this._game.packetNotifier.notifyNPC_BuffReplace(b);
            }            b.activateBuff();
        }        // If the buff is supposed to reset the timer on any existing buff instances of the same name.
        else if (b.buffAddType == BuffAddType.RENEW_EXISTING) {
            this.parentBuffs[b.name].resetTimeElapsed();

            if (!b.isHidden) {
                this._game.packetNotifier.notifyNPC_BuffReplace(
                    this.parentBuffs[b.name]
                );
            }            // Attempt to remove any stats or modifiers applied by the pre-existing buff instance's BuffScript.
            // TODO: Replace with a better method that unloads and reloads all data of a script
            this.removeStatModifier(
                this.parentBuffs[b.name].getstatsModifier()
            );
            // Re-activate the buff's BuffScript.
            this.parentBuffs[b.name].activateBuff();
        }        // If the buff is supposed to be applied alongside any existing buff instances of the same name.
        else if (b.buffAddType == BuffAddType.STACKS_AND_OVERLAPS) {
            // If we've hit the max stacks count for this buff add type (usually 254 for this BuffAddType).
            if (
                this.parentBuffs[b.name].stackCount >=
                this.parentBuffs[b.name].maxStacks
            ) {
                // Get and remove the oldest buff of the same name so we can free up space for the newly given buff instance.
                let tempbuffs = this.getBuffsWithName(b.name);
                let oldestbuff = tempbuffs[0];

                oldestbuff.deactivateBuff();
                this.removeBuff(b.name);
                this.buffList.splice(this.buffList.indexOf(oldestbuff), 1);
                this.removeBuffSlot(oldestbuff);

                // Move the next oldest buff of the same name into the position of the removed oldest buff.
                tempbuffs = this.getBuffsWithName(b.name);

                this.buffSlots[oldestbuff.slot] = tempbuffs[0];
                this.parentBuffs[oldestbuff.name] = tempbuffs[0];
                this.buffList.push(b);

                if (!b.isHidden) {
                    // If the buff is a counter buff (ex: Nasus Q stacks), then use a packet specialized for big buff stack counts (int.MaxValue).
                    if (this.parentBuffs[b.name].buffType == BuffType.COUNTER) {
                        this._game.packetNotifier.notifyNPC_BuffUpdateNumCounter(
                            this.parentBuffs[b.name]
                        );
                    }                    // Otherwise, use the normal buff stack (254) update (usually just adds one to the number on the icon and refreshes the time of the icon).
                    else {
                        this._game.packetNotifier.notifyNPC_BuffUpdateCount(
                            b,
                            b.duration,
                            b.timeElapsed
                        );
                    }                }                b.activateBuff();

                return;
            }            // If we haven't hit the max stack count (usually 254).
            this.buffList.push(b);

            // Increment the number of stacks on the parent buff, which is the buff instance which is used for packets.
            this.parentBuffs[b.name].incrementStackCount();

            // Increment the number of stacks on every buff of the same name (so if any of them become the parent, there is no problem).
            this.getBuffsWithName(b.name).forEach((buff) =>
                buff.setStacks(this.parentBuffs[b.name].stackCount)
            );

            if (!b.isHidden) {
                if (b.buffType == BuffType.COUNTER) {
                    this._game.packetNotifier.notifyNPC_BuffUpdateNumCounter(
                        parentBuffs[b.name]
                    );
                } else {
                    this._game.packetNotifier.notifyNPC_BuffUpdateCount(
                        b,
                        b.duration,
                        b.timeElapsed
                    );
                }            }            b.activateBuff();
        }        // If the buff is supposed to add a stack to any existing buffs of the same name and refresh their timer.
        // Essentially the method is: have one parent buff which has the stacks, and just refresh its time, this means no overlapping buff instances, but functionally it is the same.
        else if (
            this.parentBuffs[b.name].buffAddType ==
            BuffAddType.STACKS_AND_RENEWS
        ) {
            // Don't need the newly added buff instance as we already have a parent who we can add stacks to.
            this.removeBuffSlot(b);

            // Refresh the time of the parent buff and add a stack.
            this.parentBuffs[b.name].resetTimeElapsed();
            this.parentBuffs[b.name].incrementStackCount();

            if (!b.isHidden) {
                if (this.parentBuffs[b.name].buffType == BuffType.COUNTER) {
                    this._game.packetNotifier.notifyNPC_BuffUpdateNumCounter(
                        this.parentBuffs[b.name]
                    );
                } else {
                    this._game.packetNotifier.notifyNPC_BuffUpdateCount(
                        this.parentBuffs[b.name],
                        this.parentBuffs[b.name].Duration,
                        this.parentBuffs[b.name].TimeElapsed
                    );
                }            }            // Attempt to remove any stats or modifiers applied by the pre-existing buff instance's BuffScript.
            // TODO: Replace with a better method that unloads and reloads all data of a script
            this.removeStatModifier(
                this.parentBuffs[b.name].getstatsModifier()
            );
            this.parentBuffs[b.name].activateBuff();
        }    }
    /// Whether or not this unit has the given buff instance.
    /// <param name="buff">Buff instance to check.</param>
    /// <returns>True/False.</returns>
    hasBuff(buff) {
        return this.buffList.find((b) => b == buff) != null;
    }
    /// Whether or not this unit has a buff of the given name.
    /// <param name="buffName">Internal buff name to check for.</param>
    /// <returns>True/False.</returns>
    hasBuff(buffName) {
        return this.buffList.find((b) => b.isBuffSame(buffName)) != null;
    }
    /// Gets a new buff slot for the given buff instance.
    /// <param name="b">Buff instance to add.</param>
    /// <returns>Byte buff slot of the given buff.</returns>
    getNewBuffSlot(b) {
        let slot = this.getBuffSlot();
        this.buffSlots[slot] = b;
        return slot;
    }
    /// Gets the slot of the given buff instance, or an open slot if no buff is given.
    /// <param name="buffToLookFor">Buff to check. Leave empty to get an empty slot.</param>
    /// <returns>Slot of the given buff or an empty slot.</returns>
    getBuffSlot(buffToLookFor = null) {
        // Find the first open slot or the slot corresponding to buff
        for (let i = 1; i < this.buffSlots.length; i++) {
            if (this.buffSlots[i] == buffToLookFor) {
                return i;
            }        }
        throw new Exception("No slot found with requested value"); // If no open slot or no corresponding slot
    }
    /// Gets the parent buff instance of the buffs of the given name. Parent buffs control stack count for buffs of the same name.
    /// <param name="name">Internal buff name to check.</param>
    /// <returns>Parent buff instance.</returns>
    getBuffWithName(name) {
        if (name in this.parentBuffs) {
            return this.parentBuffs[name];
        }        return null;
    }
    /// Gets a list of all buffs applied to this unit (parent and children).
    /// <returns>List of buff instances.</returns>
    getBuffs() {
        return this.buffList;
    }
    /// Gets the number of parent buffs applied to this unit.
    /// <returns>Number of parent buffs.</returns>
    getBuffsCount() {
        return Object.keys(this.parentBuffs).length;
    }
    /// Gets a list of all buff instances of the given name (parent and children).
    /// <param name="buffName">Internal buff name to check.</param>
    /// <returns>List of buff instances.</returns>
    getBuffsWithName(buffName) {
        return this.buffList.filter((b) => b.isBuffSame(buffName));
    }
    /// Removes the given buff from this unit. Called automatically when buff timers have finished.
    /// Buffs with BuffAddType.STACKS_AND_OVERLAPS are removed incrementally, meaning one instance removed per RemoveBuff call.
    /// Other BuffAddTypes are removed entirely, regardless of stacks. DecrementStackCount can be used as an alternative.
    /// <param name="b">Buff to remove.</param>
    removeBuff(b) {
        // If the buff is supposed to be applied alongside other buffs of the same name, and their are more than one already present.
        if (
            b.buffAddType == BuffAddType.STACKS_AND_OVERLAPS &&
            b.stackCount > 1
        ) {
            // Remove one stack and update the other buff instances of the same name
            b.decrementStackCount();

            this.removeBuff(b.name);
            this.buffList.splice(this.buffList.indexOf(b), 1);
            this.removeBuffSlot(b);

            let tempbuffs = this.getBuffsWithName(b.name);

            tempbuffs.forEach((tempbuff) => tempbuff.setStacks(b.stackCount));

            // Next oldest buff takes the place of the removed oldest buff; becomes parent buff.
            this.buffSlots[b.slot] = tempbuffs[0];
            this.parentBuffs[b.name] = tempbuffs[0];

            // Used in packets to maintain the visual buff icon's timer, as removing a stack from the icon can reset the timer.
            let newestBuff = tempbuffs[tempbuffs.length - 1];

            if (!b.isHidden) {
                if (b.buffType == BuffType.COUNTER) {
                    this._game.packetNotifier.notifyNPC_BuffUpdateNumCounter(
                        this.parentBuffs[b.name]
                    );
                } else {
                    if (b.stackCount == 1) {
                        this._game.packetNotifier.notifyNPC_BuffUpdateCount(
                            newestBuff,
                            b.duration - newestBuff.timeElapsed,
                            newestBuff.timeElapsed
                        );
                    } else {
                        this._game.packetNotifier.notifyNPC_BuffUpdateCountGroup(
                            this,
                            tempbuffs,
                            b.duration - newestBuff.timeElapsed,
                            newestBuff.timeElapsed
                        );
                    }                }            }        }        // Only other case where RemoveBuff should be called is when there is one stack remaining on the buff.
        else {
            this.buffList = this.buffList.filter((buff) => !buff.elapsed());
            this.removeBuff(b.name);
            this.removeBuffSlot(b);
            if (!b.isHidden) {
                this._game.packetNotifier.notifyNPC_BuffRemove2(b);
            }        }    }
    /// Removes the given buff instance from the buff slots of this unit.
    /// Called automatically by RemoveBuff().
    /// <param name="b">Buff instance to check for.</param>
    removeBuffSlot(b) {
        let slot = this.getBuffSlot(b);
        // TODO: @HoangTran use array.splice instead ???
        this.buffSlots[slot] = null;
    }
    /// Removes the parent buff of the given internal name from this unit.
    /// <param name="b">Internal buff name to remove.</param>
    removeBuff(b) {
        delete this.parentBuffs[b];
    }
    /// Removes all buffs of the given internal name from this unit regardless of stack count.
    /// Intended mainly for buffs with BuffAddType.STACKS_AND_OVERLAPS.
    /// <param name="buffName">Internal buff name to remove.</param>
    removeBuffsWithName(buffName) {
        this.buffList = this.buffList.filter((b) => b.isBuffSame(buffName));
        this.buffList.forEach((b) => b.deactivateBuff());
    }
    /// Gets the movement speed stat of this unit (units/sec).
    /// <returns> units/sec.</returns>
    getMoveSpeed() {
        if (this.isDashing) {
            return this.dashSpeed;
        }
        return this.stats.moveSpeed.total;
    }
    /// Whether or not this unit can move itself.
    /// <returns></returns>
    canMove() {
        return false;
    }
    /// Moves this unit to its specified waypoints, updating its position along the way.
    /// <param name="diff">The amount of milliseconds the unit is supposed to move</param>
    /// TODO: Implement interpolation (assuming all other desync related issues are already fixed).
    move(diff) {
        // no waypoints remained - clear the waypoints
        if (this.currentWaypoint.index >= this.waypoints.length) {
            this.waypoints = this.waypoints.filter(
                (v) => v == this.waypoints[0]
            );
            this.currentWaypoint.value = this.waypoints[0];
            return false;
        }
        // current -> next positions
        let cur = this.position.copy();
        let next = this.currentWaypoint.value;

        let goingTo = p5.Vector.sub(next, cur);
        let _direction = goingTo.normalize();

        // usually doesn't happen
        if (isNaN(_direction.x) || isNaN(_direction.y)) {
            _direction = createVector(0, 0);
        }
        let moveSpeed = this.getMoveSpeed();

        let dist = p5.Vector.dist(cur, next);

        let deltaMovement = moveSpeed * 0.001 * diff;

        // Prevent moving past the next waypoint.
        if (deltaMovement > dist) {
            deltaMovement = dist;
        }
        let xx = _direction.x * deltaMovement;
        let yy = _direction.y * deltaMovement;

        let nextPos = createVector(this.position.x + xx, this.position.y + yy);
        // TODO: Implement ForceMovementType so this specifically applies to dashes that can't move past walls.
        if (!this.isDashing) {
            // Prevent moving past obstacles. TODO: Verify if works at high speeds.
            // TODO: Implement range based (CollisionRadius) pathfinding so we don't keep getting stuck because of IsAnythingBetween.
            let pathBlocked = this._game.gameMap.navigationGrid.isAnythingBetween(
                this.position,
                nextPos
            );
            if (pathBlocked != null) {
                nextPos = this._game.gameMap.navigationGrid.getClosestTerrainExit(
                    pathBlocked,
                    this.collisionRadius + 1.0
                );
            }        }
        this.position.set(nextPos.x, nextPos.y);

        // (X, Y) have now moved to the next position
        cur = this.position.copy();

        // Check if we reached the next waypoint
        // REVIEW (of previous code): (deltaMovement * 2) being used here is problematic; if the server lags, the diff will be much greater than the usual values
        if (
            p5.Vector.sub(cur, next).magSq() <
            MOVEMENT_EPSILON * MOVEMENT_EPSILON
        ) {
            let nextIndex = this.currentWaypoint.index + 1;
            // stop moving because we have reached our last waypoint
            if (nextIndex >= this.waypoints.length) {
                this.currentWaypoint.index = nextIndex;
                this.currentWaypoint.value = this.position.copy();
                return true;
            }            // start moving to our next waypoint
            else {
                this.currentWaypoint.index = nextIndex;
                this.currentWaypoint.value = this.waypoints[nextIndex];
            }        }
        return true;
    }
    /// Whether or not this unit's position is being updated towards its waypoints.

    /// <returns>True/False</returns>
    isMoving() {
        return this.waypoints.length > 1;
    }
    /// Returns the next waypoint. If all waypoints have been reached then this returns a -inf Vector2
    getNextWaypoint() {
        if (this.currentWaypoint.index < this.waypoints.length) {
            return this.currentWaypoint.value;
        }        return createVector(-Infinity, -Infinity);
    }
    /// Returns whether this unit has reached the last waypoint in its path of waypoints.
    isPathEnded() {
        return this.currentWaypoint.index >= this.waypoints.length;
    }
    /// Sets this unit's movement path to the given waypoints. *NOTE*: Requires current position to be prepended.

    /// <param name="newwaypoints">New path of Vector2 coordinates that the unit will move to.</param>
    /// <param name="networked">Whether or not clients should be notified of this change in waypoints at the next objectManager.Update.</param>
    setWaypoints(newwaypoints, networked = true) {
        // waypoints should always have an origin at the current position.
        // Can't set waypoints if we can't move. However, dashes override this.
        if (
            newwaypoints.length <= 1 ||
            !newwaypoints[0].equals(this.position) ||
            (!this.canMove() && !this.isDashing)
        ) {
            return;
        }
        if (networked) {
            this._movementUpdated = true;
        }        this.waypoints = newwaypoints;
        this.currentWaypoint.index = 1;
        this.currentWaypoint.value = this.waypoints[1];
    }
    /// Forces this unit to stop moving.
    stopMovement() {
        // Stop movements are always networked.
        this._movementUpdated = true;

        if (this.isDashing) {
            this.setDashingState(false);
            return;
        }
        this.waypoints = [this.position.copy()];
        this.currentWaypoint = {
            index: 1,
            value: this.position.copy(),
        };
    }
    /// Returns whether this unit's waypoints will be networked to clients the next update. Movement updates do not occur for dash based movements.

    /// <returns>True/False</returns>
    /// TODO: Refactor movement update logic so this can be applied to any kind of movement.
    isMovementUpdated() {
        return this._movementUpdated;
    }
    /// Used each object manager update after this unit has set its waypoints and the server has networked it.

    clearMovementUpdated() {
        this._movementUpdated = false;
    }
    /// Applies the specified crowd control to this unit, refer to CrowdControlType for examples.

    /// <param name="cc">Crowd control to apply.</param>
    /// <param name="applier">AI which applied the Crowd Control.</param>
    /// TODO: Replace CrowdControl with buffs of the same type and remove all of these CrowdControl based functions.
    applyCrowdControl(cc, applier) {
        if (applier != null) {
            ApiEventManager.onUnitCrowdControlled.publish(applier);
        }
        this.crowdControls.push(cc);
    }
    /// Whether or not this unit is affected by the given crowd control.
    /// <param name="ccType">Crowd control to check for.</param>
    /// <returns>True/False.</returns>
    /// TODO: Replace CrowdControl with buffs of the same type and remove all of these CrowdControl based functions.
    hasCrowdControl(ccType) {
        return this.crowdControls.find((cc) => cc.isTypeOf(ccType)) != null;
    }
    /// Removes the given crowd control instance from this unit.
    /// <param name="cc">Crowd control instance to remove.</param>
    /// TODO: Replace CrowdControl with buffs of the same type and remove all of these CrowdControl based functions.
    removeCrowdControl(cc) {
        this.crowdControls = this.crowdControls.filter((c) => c != cc);
    }
    /// Clears all crowd control from this unit.

    /// TODO: Replace CrowdControl with buffs of the same type and remove all of these CrowdControl based functions.
    clearAllCrowdControl() {
        this.crowdControls.length = 0;
    }
    /// Forces this unit to perform a dash which ends at the given position.
    /// <param name="endPos">position to end the dash at.</param>
    /// <param name="dashSpeed">Amount of units the dash should travel in a second (movespeed).</param>
    /// <param name="animation">Internal name of the dash animation.</param>
    /// <param name="leapGravity">Optionally how much gravity the unit will experience when above the ground while dashing.</param>
    /// <param name="keepFacingLastDirection">Whether or not the AI unit should face the direction they were facing before the dash.</param>
    /// TODO: Find a good way to grab these variables from spell data.
    /// TODO: Verify if we should count Dashing as a form of Crowd Control.
    /// TODO: Implement Dash class which houses these parameters, then have that as the only parameter to this function (and other Dash-based functions).
    dashToLocation(
        endPos,
        dashSpeed,
        animation = "RUN",
        leapGravity = 0.0,
        keepFacingLastDirection = true
    ) {
        let newCoords = this._game.gameMap.navigationGrid.getClosestTerrainExit(
            endPos,
            this.collisionRadius + 1.0
        );
        // TODO: Take into account the rest of the arguments
        this.isDashing = true;
        this.dashSpeed = dashSpeed;
        this.dashTime =
            p5.Vector.dist(endPos, this.position) / (dashSpeed * 0.001);
        this.dashElapsedTime = 0;

        // False because we don't want this to be networked as a normal movement.
        setWaypoints([this.position.copy(), newCoords.copy()], false);

        // Movement is networked this way instead.
        this._game.packetNotifier.notifyWaypointGroupWithSpeed(
            this,
            dashSpeed,
            leapGravity,
            keepFacingLastDirection
        );

        if (animation == null) {
            animation = "RUN";
        }
        let animList = ["RUN", animation];
        this._game.packetNotifier.notifySetAnimation(this, animList);
    }
    /// Sets this unit's current dash state to the given state.
    /// <param name="state">State to set. True = dashing, false = not dashing.</param>
    /// TODO: Implement ForcedMovement methods and enumerators to handle different kinds of dashes.
    setDashingState(state) {
        if (this.isDashing && state == false) {
            this.dashTime = 0;
            this.dashElapsedTime = 0;

            let animList = ["RUN"];
            this._game.packetNotifier.notifySetAnimation(this, animList);
        }
        this.isDashing = state;
    }}