import TeamId from "../../GameCore/Enums/TeamID.js";

/// Base class for all objects.
/// GameObjects normally follow these guidelines of functionality: Position, Direction, Collision, Vision, Team, and Networking.

export default class GameObject {
    // Crucial lets (keep in mind Game is everywhere, which could be an issue for the future)
    _game;
    _networkIdManager;

    // Function lets
    _toRemove;
    _movementUpdated;
    _direction;
    _visibleByTeam;

    /// Comparison letiable for small distance movements.

    static MOVEMENT_EPSILON = 5; //TODO: Verify if this should be changed

    /// Whether or not this object counts as a single point target. *NOTE*: Will be depricated once Target class is removed.
    ///  Identifier unique to this game object.
    netId; ////{ get; }

    /// Radius of the circle which is used for collision detection between objects or terrain.
    collisionRadius; //{ get; set; }

    /// Position of this GameObject from a top-down view.
    position; //{ get;  set; }

    /// Used to synchronize movement between client and server. Is currently assigned Env.TickCount.
    syncId; //{ get; }

    /// Team identifier, refer to TeamId enum.
    team; //{ get;  set; }

    /// Radius of the circle which is used for vision; detecting if objects are visible given terrain, and if so, networked to the player (or team) that owns this game object.
    visionRadius; //{ get;  set; }

    /// Instantiation of an object which represents the base class for all objects in League of Legends.
    constructor(
        game,
        position,
        collisionRadius = 40,
        visionRadius = 0,
        netId = 0,
        team = TeamId.TEAM_NEUTRAL
    ) {
        this._game = game;
        this._networkIdManager = game.networkIdManager;
        if (netId != 0) {
            this.netId = netId; // Custom netId
        } else {
            this.netId = _networkIdManager.getNewnetId(); // base class assigns a netId
        }
        this.position = position;
        this.syncId = Environment.TickCount; // TODO: use movement manager to generate this
        this.collisionRadius = collisionRadius;
        this.visionRadius = visionRadius;

        this._visibleByTeam = {};
        for (let t in TeamId) {
            this._visibleByTeam[TeamId[t]] = false;
        }

        this.team = team;
        this._movementUpdated = false;
        this._toRemove = false;
    }

    /// Called by ObjectManager after AddObject (usually right after instatiation of GameObject).
    onAdded() {
        this._game.gameMap.collisionHandler.addObject(this);
    }

    /// Called by ObjectManager every tick.
    /// <param name="diff">Number of milliseconds that passed before this tick occurred.</param>
    update(diff) {}

    /// Whether or not the object should be removed from the game (usually both server and client-side). Refer to ObjectManager.
    isToRemove() {
        return this._toRemove;
    }

    /// Will cause ObjectManager to remove the object (usually) both server and client-side next update.
    setToRemove() {
        this._toRemove = true;
    }

    /// Called by ObjectManager after the object has been setToRemove.
    onRemoved() {
        this._game.gameMap.collisionHandler.removeObject(this);
    }

    /// Refers to the height that the object is at in 3D space.
    getHeight() {
        return this._game.gameMap.navigationGrid.getHeightAtLocation(
            this.position.X,
            this.position.Y
        );
    }

    /// Gets the position of this GameObject in 3D space, where the Y value represents height.
    /// Mostly used for packets.
    /// <returns>Vector3 position.</returns>
    getPosition3D() {
        return new Vector3(this.position.X, GetHeight(), this.position.Y);
    }

    /// Sets the server-sided position of this object.
    setPosition(x, y) {
        this.position = new Vector2(x, y);
    }

    /// Returns the current direction (from 2D top-down perspective) used in movement.
    getDirection() {
        return this._direction;
    }

    /// Whether or not the specified object is colliding with this object.
    /// <param name="o">An object that could be colliding with this object.</param>
    isCollidingWith(o) {
        return (
            Vector2.distanceSquared(
                new Vector2(this.position.x, this.position.y),
                o.position
            ) <
            (this.collisionRadius + o.collisionRadius) *
                (this.collisionRadius + o.collisionRadius)
        );
    }

    /// Called by ObjectManager when the object is ontop of another object or when the object is inside terrain.
    onCollision(collider, isTerrain = false) {
        if (isTerrain) {
            // Escape functionality should be moved to GameObject.OnCollision.
            // only time we would collide with terrain is if we are inside of it, so we should teleport out of it.
            let exit = this._game.gameMap.navigationGrid.getClosestTerrainExit(
                this.position,
                this.collisionRadius + 1.0
            );
            this.teleportTo(exit.x, exit.y);
        }
    }

    /// Sets the object's team.
    /// <param name="team">TeamId.BLUE/PURPLE/NEUTRAL</param>
    setTeam(team) {
        this._visibleByTeam[this.team] = false;
        this.team = team;
        this._visibleByTeam[this.team] = true;
        if (this._game.isRunning) {
            this._game.packetNotifier.notifySetTeam(this);
        }
    }

    /// Whether or not the object is networked to a specified team.
    /// <param name="team">A team which could have vision of this object.</param>
    isVisibleByTeam(team) {
        return team == this.team || this._visibleByTeam[team];
    }

    /// Sets the object to be networked or not to a specified team.
    /// <param name="team">A team which could have vision of this object.</param>
    /// <param name="visible">true/false; networked or not</param>
    setVisibleByTeam(team, visible) {
        this._visibleByTeam[team] = visible;

        if (this instanceof IAttackableUnit) {
            // TODO: send this in one place only
            this._game.packetNotifier.notifyUpdatedStats(this, false);
        }
    }

    /// Sets the position of this GameObject to the specified position.
    /// <param name="x">X coordinate to set.</param>
    /// <param name="y">Y coordinate to set.</param>
    teleportTo(x, y) {
        if (
            !this._game.gameMap.navigationGrid.isWalkable(
                x,
                y,
                this.collisionRadius
            )
        ) {
            let walkableSpot = this._game.gameMap.navigationGrid.getClosestTerrainExit(
                new Vector2(x, y),
                this.collisionRadius + 1.0
            );
            this.setPosition(walkableSpot);

            x = MovementVector.targetXToNormalFormat(
                this._game.gameMap.navigationGrid,
                walkableSpot.x
            );
            y = MovementVector.targetYToNormalFormat(
                this._game.gameMap.navigationGrid,
                walkableSpot.y
            );
        } else {
            this.setPosition(x, y);

            x = MovementVector.targetXToNormalFormat(
                this._game.gameMap.navigationGrid,
                x
            );
            y = MovementVector.targetYToNormalFormat(
                this._game.gameMap.navigationGrid,
                y
            );
        }

        this._game.packetNotifier.notifyTeleport(this, new Vector2(x, y));
    }
}
