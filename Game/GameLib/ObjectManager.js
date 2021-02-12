import TeamID from "../GameCore/Enums/TeamID.js";
// import Particle from "../GameLib/GameObjects/Particle.js";
// import LevelProp from "../GameLib/GameObjects/LevelProp.js";
import AttackableUnit from "../GameLib/GameObjects/AttackableUnits/AttackableUnit.js";
// import ObjAiBase from "../GameLib/GameObjects/AttackableUnits/AI/ObjAIBase.js";
// import BaseTurret from "../GameLib/GameObjects/AttackableUnits/AI/BaseTurret.js";
// import ObjBuilding from "../GameLib/GameObjects/AttackableUnits/Buildings/ObjBuilding.js";

export default class ObjectManager {
    /// <summary>
    /// Instantiates all GameObject Dictionaries in ObjectManager.
    /// </summary>
    /// <param name="game">Game instance.</param>
    constructor(game) {
        this._game = game;
        this._objects = {};
        this._turrets = {};
        this._inhibitors = {};
        this._champions = {};
        this._visionUnits = {};

        this.teams = { ...TeamID };

        for (let key in this.teams) {
            this._visionUnits[key] = {};
        }
    }

    /// <summary>
    /// Function called every tick of the game.
    /// </summary>
    /// <param name="diff">Number of milliseconds since this tick occurred.</param>
    update(diff) {
        let temp = this.getObjects();
        for (let key in temp) {
            let obj = temp[key];

            if (obj.isToRemove()) {
                this.removeObject(obj);
                continue;
            }

            obj.update(diff);

            //TODO: Implement visibility checks for projectiles here (should be similar to particles below)
            //Make sure to account for server only projectiles, globally visible (everyone sees it) projectiles, and normal projectiles:
            //1. Nidalee Q is affected by visibility checks, but is server only
            //2. Ezreal R is globally visible, and is server only
            //3. Every other projectile that is not server only, and is affected by visibility checks (normal projectiles)

            // let particle = obj;
            // if (particle instanceof Particle) {
            //     for (let team in this.teams) {
            //         let visionUnitsTeam = this.getVisionUnits(particle.team);
            //         if (particle.netId in visionUnitsTeam) {
            //             if (this.teamHasVisionOn(team, particle)) {
            //                 particle.setVisibleByTeam(team, true);
            //                 this._game.packetNotifier.notifyFXEnterTeamVisibility(
            //                     particle,
            //                     team
            //                 );
            //                 continue;
            //             }
            //         }

            //         if (
            //             !particle.isVisibleByTeam(team) &&
            //             this.teamHasVisionOn(team, particle)
            //         ) {
            //             particle.setVisibleByTeam(team, true);
            //             this._game.packetNotifier.notifyFXEnterTeamVisibility(
            //                 particle,
            //                 team
            //             );
            //         } else if (
            //             particle.isVisibleByTeam(team) &&
            //             !this.teamHasVisionOn(team, particle)
            //         ) {
            //             particle.setVisibleByTeam(team, false);
            //             this._game.packetNotifier.notifyFXLeaveTeamVisibility(
            //                 particle,
            //                 team
            //             );
            //         }
            //     }
            // }

            // if (!(obj instanceof AttackableUnit)) continue;

            // let u = obj;
            // for (let key in this.teams) {
            //     let team = this.teams[key];

            //     if (u.team == team || team == TeamID.TEAM_NEUTRAL) continue;

            //     let visionUnitsTeam = this.getVisionUnits(u.team);
            //     if (u.netId in visionUnitsTeam) {
            //         if (this.teamHasVisionOn(team, u)) {
            //             u.setVisibleByTeam(team, true);
            //             // Might not be necessary, but just for good measure.
            //             this._game.packetNotifier.notifyEnterVisibilityClient(
            //                 u
            //             );
            //             this.removeVisionUnit(u);
            //             // TODO: send this in one place only
            //             this._game.packetNotifier.notifyUpdatedStats(u, false);
            //             continue;
            //         }
            //     }

            //     if (
            //         !u.isVisibleByTeam(team) &&
            //         this.teamHasVisionOn(team, u) &&
            //         !u.isDead
            //     ) {
            //         u.setVisibleByTeam(team, true);
            //         this._game.packetNotifier.notifyEnterVisibilityClient(u);
            //         // TODO: send this in one place only
            //         this._game.packetNotifier.notifyUpdatedStats(u, false);
            //     } else if (
            //         u.isVisibleByTeam(team) &&
            //         (u.isDead || !this.teamHasVisionOn(team, u)) &&
            //         !(
            //             // u instanceof BaseTurret ||
            //             (u instanceof LevelProp || u instanceof ObjBuilding)
            //         )
            //     ) {
            //         u.setVisibleByTeam(team, false);
            //         this._game.packetNotifier.notifyLeaveVisibilityClient(
            //             u,
            //             team
            //         );
            //     }
            // }

            // let ai = u;
            // if (ai instanceof ObjAiBase) {
            //     let tempBuffs = ai.getBuffs();
            //     for (let i = tempBuffs.length - 1; i >= 0; i--) {
            //         if (tempBuffs[i].elapsed()) {
            //             ai.removeBuff(tempBuffs[i]);
            //         } else {
            //             tempBuffs[i].update(diff);
            //         }
            //     }
            // }

            // TODO: send this in one place only
            this._game.packetNotifier.notifyUpdatedStats(u, false);

            if (u.isModelUpdated) {
                this._game.packetNotifier.notifyModelUpdate(u);
                u.isModelUpdated = false;
            }

            if (u.isMovementUpdated()) {
                this._game.packetNotifier.notifyMovement(u);
                u.clearMovementUpdated();
            }
        }
    }

    /// <summary>
    /// Adds a GameObject to the dictionary of GameObjects in ObjectManager.
    /// </summary>
    /// <param name="o">GameObject to add.</param>
    addObject(o) {
        if (o == null) {
            return;
        }

        // If it crashes here the problem is most likely somewhere else
        this._objects[o.netId] = o;

        o.onAdded();
    }

    /// <summary>
    /// Removes a GameObject from the dictionary of GameObjects in ObjectManager.
    /// </summary>
    /// <param name="o">GameObject to remove.</param>
    removeObject(o) {
        delete this._objects[o.netId];

        o.onRemoved();
    }

    /// <summary>
    /// Gets a new Dictionary of all NetID,GameObject pairs present in the dictionary of objects in ObjectManager.
    /// </summary>
    /// <returns>Dictionary of NetIDs and the GameObjects that they refer to.</returns>
    getObjects() {
        let ret = {}; //new Dictionary<ulet, IGameObject>();

        for (let key in this._objects) {
            ret[key] = this._objects[key];
        }

        return ret;
    }

    /// <summary>
    /// Gets a GameObject from the list of objects in ObjectManager that is identified by the specified NetID.
    /// </summary>
    /// <param name="netId">NetID to check.</param>
    /// <returns>GameObject instance that has the specified NetID.</returns>
    getObjectById(id) {
        if (this._objects[id] === null) {
            return null;
        }

        return this._objects[id];
    }

    /// <summary>
    /// Whether or not a specified GameObject is being networked to the specified team.
    /// </summary>
    /// <param name="team">TeamId.BLUE/PURPLE/NEUTRAL</param>
    /// <param name="o">GameObject to check.</param>
    /// <returns>true/false; networked or not.</returns>
    teamHasVisionOn(team, o) {
        if (o == null) {
            return false;
        }

        if (o.team == team) {
            return true;
        }

        for (let key in this._objects) {
            let value = this._objects[key];
            if (
                value.team == team &&
                p5.Vector.dist(value.position, o.position) <
                    value.visionRadius &&
                !this._game.gameMap.navigationGrid.isAnythingBetween(
                    value,
                    o,
                    true
                )
            ) {
                // let unit = value; //as IAttackableUnit;
                if (unit instanceof AttackableUnit && unit.isDead) {
                    continue;
                }

                return true;
            }
        }

        return false;
    }

    /// <summary>
    /// Adds a GameObject of type AttackableUnit to the list of Vision Units in ObjectManager. *NOTE*: Naming conventions of VisionUnits will change to AttackableUnits.
    /// </summary>
    /// <param name="unit">AttackableUnit to add.</param>
    addVisionUnit(unit) {
        this._visionUnits[unit.team][unit.netId] = unit;
    }

    /// <summary>
    /// Removes a GameObject of type AttackableUnit from the list of Vision Units in ObjectManager. *NOTE*: Naming conventions of VisionUnits will change to AttackableUnits.
    /// </summary>
    /// <param name="unit">AttackableUnit to remove.</param>
    removeVisionUnit(unit) {
        this.removeVisionUnitByNetID(unit.team, unit.netId);
    }

    /// <summary>
    /// Removes a GameObject of type AttackableUnit from the list of Vision Units in ObjectManager via the AttackableUnit's NetID and team.
    /// </summary>
    /// <param name="team">Team of the AttackableUnit.</param>
    /// <param name="netId">NetID of the AttackableUnit.</param>
    removeVisionUnitByNetID(team, netId) {
        delete this._visionUnits[team][netId];
    }

    /// <summary>
    /// Gets a new Dictionary containing all GameObjects of type AttackableUnit of the specified team contained in the list of Vision Units in ObjectManager.
    /// </summary>
    /// <param name="team">TeamId.BLUE/PURPLE/NEUTRAL</param>
    /// <returns>Dictionary of NetID,AttackableUnit pairs that belong to the specified team.</returns>
    getVisionUnits(team) {
        let ret = {}; //new Dictionary<ulet, IAttackableUnit>();

        let visionUnitsTeam = this._visionUnits[team];
        for (let key in visionUnitsTeam) {
            ret[key] = visionUnitsTeam[key];
        }

        return ret;
    }

    /// <summary>
    /// Gets a list of all GameObjects of type AttackableUnit that are within a certain distance from a specified position.
    /// </summary>
    /// <param name="checkPos">Vector2 position to check.</param>
    /// <param name="range">Distance to check.</param>
    /// <param name="onlyAlive">Whether dead units should be excluded or not.</param>
    /// <returns>List of all AttackableUnits within the specified range and of the specified alive status.</returns>
    getUnitsInRange(checkPos, range, onlyAlive = false) {
        let units = []; //new List<IAttackableUnit>();

        for (let key in this._objects) {
            let value = this._objects[key];
            if (
                value instanceof AttackableUnit &&
                p5.Vector.dist(checkPos, u.position) <= range &&
                ((onlyAlive && !u.isDead) || !onlyAlive)
            ) {
                units.push(u);
            }
        }

        return units;
    }

    /// <summary>
    /// Counts the number of units attacking a specified GameObject of type AttackableUnit.
    /// </summary>
    /// <param name="target">AttackableUnit potentially being attacked.</param>
    /// <returns>Number of units attacking target.</returns>
    countUnitsAttackingUnit(target) {
        let ret = {};
        let objs = this.getObjects();

        for (let key in objs) {
            let aiBase = objs[key];

            if (
                // aiBase instanceof ObjAiBase &&
                aiBase.team == target.team.getEnemyTeam() &&
                !aiBase.isDead &&
                aiBase.targetUnit != null &&
                aiBase.targetUnit == target
            )
                ret[key] = aiBase;
        }

        return ret;
    }

    /// <summary>
    /// Forces all GameObjects of type ObjAIBase to stop targeting the specified AttackableUnit.
    /// </summary>
    /// <param name="target">AttackableUnit that should be untargeted.</param>
    stopTargeting(target) {
        for (let key in this._objects) {
            let u = this._objects[key];
            if (u == null) {
                continue;
            }

            let ai = u;
            if (ai != null) {
                if (ai.targetUnit == target) {
                    ai.setTargetUnit(null);
                    this._game.packetNotifier.notifySetTarget(u, null);
                }
            }
        }
    }

    /// <summary>
    /// Adds a GameObject of type BaseTurret to the list of BaseTurrets in ObjectManager.
    /// </summary>
    /// <param name="turret">BaseTurret to add.</param>
    addTurret(turret) {
        this._turrets[turret.netId] = turret;
    }

    /// <summary>
    /// Gets a GameObject of type BaseTurret from the list of BaseTurrets in ObjectManager who is identified by the specified NetID.
    /// Unused.
    /// </summary>
    /// <param name="netId"></param>
    /// <returns>BaseTurret instance identified by the specified NetID.</returns>
    getTurretById(netId) {
        if (!(netId in this._turrets)) {
            return null;
        }

        return _turrets[netId];
    }

    /// <summary>
    /// Removes a GameObject of type BaseTurret from the list of BaseTurrets in ObjectManager.
    /// Unused.
    /// </summary>
    /// <param name="turret">BaseTurret to remove.</param>
    removeTurret(turret) {
        delete this._turrets[turret.netId];
    }

    /// <summary>
    /// How many turrets of a specified team are destroyed in the specified lane.
    /// Used for building protection, specifically for cases where new turrets are added after map turrets.
    /// Unused.
    /// </summary>
    /// <param name="team">Team of the BaseTurrets to check.</param>
    /// <param name="lane">Lane to check.</param>
    /// <returns>Number of turrets in the lane destroyed.</returns>
    /// TODO: Implement AzirTurrets so this can be used.
    getTurretsDestroyedForTeam(team, lane) {
        let destroyed = 0;
        for (let turret of Object.values(this._turrets)) {
            if (turret.team == team && turret.lane == lane && turret.isDead) {
                destroyed++;
            }
        }

        return destroyed;
    }

    /// <summary>
    /// Adds a GameObject of type Inhibitor to the list of Inhibitors in ObjectManager.
    /// </summary>
    /// <param name="inhib">Inhibitor to add.</param>
    addInhibitor(inhib) {
        this._inhibitors[inhib.netId] = inhib;
    }

    /// <summary>
    /// Gets a GameObject of type Inhibitor from the list of Inhibitors in ObjectManager who is identified by the specified NetID.
    /// </summary>
    /// <param name="netId"></param>
    /// <returns>Inhibitor instance identified by the specified NetID.</returns>
    getInhibitorById(id) {
        if (!(id in this._inhibitors)) {
            return null;
        }

        return this._inhibitors[id];
    }

    /// <summary>
    /// Removes a GameObject of type Inhibitor from the list of Inhibitors in ObjectManager.
    /// </summary>
    /// <param name="inhib">Inhibitor to remove.</param>
    removeInhibitor(inhib) {
        delete this._inhibitors[inhib.netId];
    }

    /// <summary>
    /// Whether or not all of the Inhibitors of a specified team are destroyed.
    /// </summary>
    /// <param name="team">Team of the Inhibitors to check.</param>
    /// <returns>true/false; destroyed or not</returns>
    allInhibitorsDestroyedFromTeam(team) {
        for (let inhibitor of Object.values(this._inhibitors)) {
            if (
                inhibitor.team == team &&
                inhibitor.inhibitorState == InhibitorState.ALIVE
            ) {
                return false;
            }
        }

        return true;
    }

    /// <summary>
    /// Adds a GameObject of type Champion to the list of Champions in ObjectManager.
    /// </summary>
    /// <param name="champion">Champion to add.</param>
    addChampion(champion) {
        this._champions[champion.netId] = champion;
    }

    /// <summary>
    /// Removes a GameObject of type Champion from the list of Champions in ObjectManager.
    /// </summary>
    /// <param name="champion">Champion to remove.</param>
    removeChampion(champion) {
        delete this._champions[champion.netId];
    }

    /// <summary>
    /// Gets a new list of all Champions found in the list of Champions in ObjectManager.
    /// </summary>
    /// <returns>List of all valid Champions.</returns>
    getAllChampions() {
        let champs = [];
        for (let kv in this._champions) {
            let c = this._champions[kv];
            if (c != null) {
                champs.push(c);
            }
        }

        return champs;
    }

    /// <summary>
    /// Gets a new list of all Champions of the specified team found in the list of Champios in ObjectManager.
    /// </summary>
    /// <param name="team">TeamId.BLUE/PURPLE/NEUTRAL</param>
    /// <returns>List of valid Champions of the specified team.</returns>
    getAllChampionsFromTeam(team) {
        let champs = [];
        for (let kv in this._champions) {
            let c = this._champions[kv];
            if (c.team == team) {
                champs.push(c);
            }
        }

        return champs;
    }

    /// <summary>
    /// Gets a list of all GameObjects of type Champion that are within a certain distance from a specified position.
    /// </summary>
    /// <param name="checkPos">Vector2 position to check.</param>
    /// <param name="range">Distance to check.</param>
    /// <param name="onlyAlive">Whether dead Champions should be excluded or not.</param>
    /// <returns>List of all Champions within the specified range of the position and of the specified alive status.</returns>
    getChampionsInRange(checkPos, range, onlyAlive = false) {
        let champs = [];
        for (let kv in this._champions) {
            let c = this._champion[kv];
            if (Vector2.distanceSquared(checkPos, c.Position) <= range * range)
                if ((onlyAlive && !c.isDead) || !onlyAlive) champs.push(c);
        }

        return champs;
    }
}
