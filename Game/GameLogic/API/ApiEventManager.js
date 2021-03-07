/*
 * Possible Events:
[OnActivate]
[OnAddPAR]
[OnAllowAdd]
[OnAssist]
[OnAssistUnit]
[OnBeingDodged]
[OnBeingHit]
[OnBeingSpellHit]
[OnCollision]
[OnCollisionTerrain]
[OnDeactivate]
[OnDealDamage]
[OnDeath]
[OnDodge]
[OnHeal]
[OnHitUnit]
[OnKill]
[OnKillUnit]
[OnLaunchAttack]
[OnLaunchMissile]
[OnLevelUp]
[OnLevelUpSpell]
[OnMiss]
[OnMissileEnd]
[OnMissileUpdate]
[OnMoveEnd]
[OnMoveFailure]
[OnMoveSuccess]
[OnNearbyDeath]
[OnPreAttack]
[OnPreDamage]
[OnPreDealDamage]
[OnPreMitigationDamage]
[OnResurrect]
[OnSpellCast]
[OnSpellHit]
[OnTakeDamage]
[OnUpdateActions]
[OnUpdateAmmo]
[OnUpdateStats]
[OnZombie]
 */

export default class ApiEventManager {
    static _game;

    static onUpdate;
    static onChampionDamageTaken;
    static onUnitDamageTaken;
    static onChampionMove;
    static onHitUnit;
    static onUnitCrowdControlled;
    static onChampionCrowdControlled;

    static setGame(game) {
        this._game = game;

        this.onUpdate = new EventOnUpdate();
        this.onChampionDamageTaken = new EventOnChampionDamageTaken();
        this.onUnitDamageTaken = new EventOnUnitDamageTaken();
        this.onChampionMove = new EventOnChampionMove();
        this.onHitUnit = new EventOnHitUnit();
        this.onUnitCrowdControlled = new EventOnUnitCrowdControlled();
        this.onChampionCrowdControlled = new EventOnChampionCrowdControlled();
    }

    static removeAllListenersForOwner(owner) {
        this.onChampionDamageTaken.removeListener(owner);
        this.onUpdate.removeListener(owner);
        this.onChampionMove.removeListener(owner);
    }
}

export class EventOnUpdate {
    _listeners = [];

    addListener(owner, callback) {
        let listenerTuple = { owner, callback };
        this._listeners.push(listenerTuple);
    }

    removeListener(owner) {
        this._listeners = this._listeners.filter(
            (listener) => listener.owner !== owner
        );
    }

    publish(diff) {
        this._listeners = this._listeners.forEach((listener) =>
            listener.callback(diff)
        );
    }
}

class EventOnUnitDamageTaken {
    _listeners = [];

    addListener(owner, unit, callback) {
        let listenerTuple = { owner, unit, callback };
        this._listeners.push(listenerTuple);
    }

    removeListener(owner, unit) {
        if (unit) {
            this._listeners = this._listeners.filter(
                (listener) => listener.owner !== owner || listener.unit !== unit
            );
        } else {
            this._listeners = this._listeners.filter(
                (listener) => listener.owner == owner
            );
        }
    }

    publish(unit) {
        this._listeners.forEach((listener) => listener.callback());
        if (unit instanceof Champion)
            ApiEventManager.onChampionDamageTaken.publish(unit);
    }
}

class EventOnChampionDamageTaken {
    _listeners = [];

    addListener(owner, champion, callback) {
        let listenerTuple = { owner, champion, callback };
        this._listeners.push(listenerTuple);
    }

    removeListener(owner, champion) {
        if (champion) {
            this._listeners = this._listeners.filter(
                (listener) =>
                    listener.owner !== owner || listener.champion !== champion
            );
        } else {
            this._listeners = this._listeners.filter(
                (listener) => listener.owner !== owner
            );
        }
    }

    publish(champion) {
        this._listeners.forEach((listener) => {
            if (listener.champion == champion) {
                listener.callback();
            }
        });
    }
}

class EventOnChampionMove {
    _listeners = [];

    addListener(owner, champion, callback) {
        let listenerTuple = { owner, champion, callback };
        this._listeners.push(listenerTuple);
    }

    removeListener(owner, champion) {
        if (champion) {
            this._listeners = this._listeners.filter(
                (listener) =>
                    listener.owner !== owner || listener.champion !== champion
            );
        } else {
            this._listeners = this._listeners.filter(
                (listener) => listener.owner !== owner
            );
        }
    }

    publish(champion) {
        _listeners.forEach((listener) => {
            if (listener.champion == champion) {
                listener.callback();
            }
        });
    }
}

class EventOnHitUnit {
    _listeners = [];

    addListener(owner, unit, callback) {
        let listenerTuple = { owner, unit, callback };
        this._listeners.push(listenerTuple);
    }

    removeListener(owner, unit) {
        if (unit) {
            this._listeners = this._listeners.filter(
                (listener) => listener.owner !== owner || listener.unit !== unit
            );
        } else {
            this._listeners = this._listeners.filter(
                (listener) => listener.owner == owner
            );
        }
    }

    publish(unit, target, isCrit) {
        this._listeners.forEach((listener) => {
            if (listener.unit == unit) {
                listener.callback(target, isCrit);
            }
        });
    }
}

class EventOnUnitCrowdControlled {
    _listeners = [];

    addListener(owner, unit, callback) {
        let listenerTuple = {owner, unit, callback};
        this._listeners.push(listenerTuple);
    }

    removeListener(owner, unit) {
        if (unit) {
            this._listeners = this._listeners.filter(
                (listener) => listener.owner !== owner || listener.unit !== unit
            );
        } else {
            this._listeners = this._listeners.filter(
                (listener) => listener.owner == owner
            );
        }
    }

    publish(unit) {
        this._listeners.forEach((listener) => listener.callback());
        if (unit instanceof Champion)
            ApiEventManager.onChampionCrowdControlled.publish(unit);
    }
}

class EventOnChampionCrowdControlled {
    _listeners = [];

    addListener(owner, champion, callback) {
        let listenerTuple = { owner, champion, callback };
        this._listeners.add(listenerTuple);
    }

    removeListener(owner, champion) {
        if (champion) {
            this._listeners = this._listeners.filter(
                (listener) =>
                    listener.owner !== owner || listener.champion !== champion
            );
        } else {
            this._listeners = this._listeners.filter(
                (listener) => listener.owner !== owner
            );
        }
    }

    publish(champion) {
        this._listeners.forEach((listener) => {
            if (listener.champion == champion) {
                listener.callback();
            }
        });
    }
}
