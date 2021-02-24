export default class ApiFunctionManager {
    static _game;

    static setGame(game) {
        this._game = game;
    }

    static setGameObjectVisibility(gameObject, visibility) {
        var teams = this.getTeams();
        for (let id in teams) {
            gameObject.setVisibleByTeam(id, visibility);
        }
    }

    static getTeams() {
        return this._game.objectManager.Teams;
    }

    static teleportTo(unit, x, y) {
        if (unit.isDashing) {
            this.cancelDash(unit);
        }
        unit.teleportTo(x, y);
    }

    // static isWalkable(x, y, checkRadius = 0) {
    //     return this._game.map.navigationGrid.isWalkable(x, y, checkRadius);
    // }

    static addBuff(
        buffName,
        duration,
        originalSpell,
        onto,
        from,
        infiniteDuration
    ) {
        let buff;

        try {
            buff = new Buff(
                this._game,
                buffName,
                duration,
                stacks,
                originalSpell,
                onto,
                from,
                infiniteDuration
            );
        } catch (err) {
            console.error(err);
            return null;
        }

        onto.addBuff(buff);
        return buff;
    }

    static hasBuff(unit, b) {
        // b : buff instance / buffName
        return unit.hasBuff(b);
    }

    static editBuff(buff, newStacks) {
        buff.setStacks(newStacks);
    }

    static removeBuff(buff) {
        buff.deactivateBuff();
    }

    static removeBuffFromTarget(target, buffName) {
        target.removeBuffsWithName(buffName);
    }

    static addParticle(
        unit,
        particle,
        position,
        size = 1,
        bone = "",
        direction = createVector(0, 0),
        lifetime = 0,
        reqVision = true
    ) {
        var p = new Particle(
            this._game,
            unit,
            position,
            particle,
            size,
            bone,
            0,
            direction,
            lifetime,
            reqVision
        );
        return p;
    }

    static addParticleTarget(
        unit,
        particle,
        target,
        size = 1,
        bone = "",
        direction = createVector(),
        lifetime = 0,
        reqVision = true
    ) {
        var p = new Particle(
            this._game,
            unit,
            target,
            particle,
            size,
            bone,
            0,
            direction,
            lifetime,
            reqVision
        );
        return p;
    }

    static removeParticle(p) {
        p.setToRemove();
    }

    static addMinion(
        owner,
        model,
        name,
        position,
        isVisible = true,
        aiPaused = true
    ) {
        var m = new Minion(_game, owner, position, model, name, 0, owner.Team);
        this._game.objectManager.addObject(m);
        m.setVisibleByTeam(owner.team, isVisible);
        m.pauseAi(aiPaused);
        return m;
    }

    static addMinionTarget(
        owner,
        model,
        name,
        target,
        isVisible = true,
        aiPaused = true
    ) {
        // TODO: Implement attachable Minions/GameObjects.
        return addMinion(
            owner,
            model,
            name,
            target.position,
            isVisible,
            aiPaused
        );
    }

    static getUnitsInRange(targetPos, range, isAlive) {
        return this._game.objectManager.getUnitsInRange(
            targetPos,
            range,
            isAlive
        );
    }

    static getChampionsInRange(targetPos, range, isAlive) {
        return _game.objectManager.getChampionsInRange(
            targetPos,
            range,
            isAlive
        );
    }

    static cancelDash(unit) {
        // Allow the user to move the champion
        unit.setDashingState(false);

        // Reset the default run animation
        // TODO add js code here
    }

    static dashToTarget(
        unit,
        target,
        dashSpeed,
        animation,
        leapGravity,
        keepFacingLastDirection,
        followTargetMaxDistance,
        backDistance,
        travelTime
    ) {
        unit.dashToTarget(
            target,
            dashSpeed,
            animation,
            leapGravity,
            keepFacingLastDirection,
            followTargetMaxDistance,
            backDistance,
            travelTime
        );
    }

    static dashToLocation(
        unit,
        endPos,
        dashSpeed,
        animation = "RUN",
        leapGravity = 0,
        keepFacingLastDirection = true
    ) {
        unit.dashToLocation(
            endPos,
            dashSpeed,
            animation,
            leapGravity,
            keepFacingLastDirection
        );
    }
}
