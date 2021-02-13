import TeamId from "../Enums/TeamID.js";

/// Base class for all objects.
/// GameObjects normally follow these guidelines of functionality: Position, Direction, Collision, Vision, Team, and Networking.

export default class GameObject {
    static MOVEMENT_EPSILON = 5; //TODO: Verify if this should be changed

    /// Instantiation of an object which represents the base class for all objects in League of Legends.
    constructor(
        game,
        position,
        collisionRadius = 40,
        visionRadius = 0,
        team = TeamId.TEAM_NEUTRAL
    ) {
        this._game = game;
        this.position = position;
        this.collisionRadius = collisionRadius;
        this.visionRadius = visionRadius;

        this._visibleByTeam = {};
        for (let t in TeamId) {
            this._visibleByTeam[TeamId[t]] = false;
        }

        this.team = team;
        this._movementUpdated = false;
        this._direction = 0;
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
        // return this._game.gameMap.navigationGrid.getHeightAtLocation(
        //     this.position.X,
        //     this.position.Y
        // );
        return 0;
    }

    /// Gets the position of this GameObject in 3D space, where the Y value represents height.
    /// Mostly used for packets.
    /// <returns>Vector3 position.</returns>
    getPosition3D() {
        // return new Vector3(this.position.X, GetHeight(), this.position.Y);
        return this.position.copy(); // p5.Vector
    }

    /// Sets the server-sided position of this object.
    setPosition(x, y) {
        // this.position = new Vector2(x, y);
        this.position.set(x, y);
    }

    /// Returns the current direction (from 2D top-down perspective) used in movement.
    getDirection() {
        return this._direction;
    }

    /// Whether or not the specified object is colliding with this object.
    /// <param name="o">An object that could be colliding with this object.</param>
    isCollidingWith(o) {
        return (
            p5.Vector.dist(this.position, o.position) <
            this.collisionRadius + o.collisionRadius
        );
    }

    /// Called by ObjectManager when the object is ontop of another object or when the object is inside terrain.
    onCollision(collider, isTerrain = false) {
        if (isTerrain) {
            // Escape functionality should be moved to GameObject.OnCollision.
            // only time we would collide with terrain is if we are inside of it, so we should teleport out of it.
            // let exit = this._game.gameMap.navigationGrid.getClosestTerrainExit(
            //     this.position,
            //     this.collisionRadius + 1.0
            // );
            // this.teleportTo(exit.x, exit.y);
            console.log("collide");
        }
    }

    /// Sets the object's team.
    /// <param name="team">TeamId.BLUE/PURPLE/NEUTRAL</param>
    setTeam(team) {
        this._visibleByTeam[this.team] = false;
        this.team = team;
        this._visibleByTeam[this.team] = true;
        // if (this._game.isRunning) {
        //     this._game.packetNotifier.notifySetTeam(this);
        // }
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

        // if (this instanceof IAttackableUnit) {
        //     // TODO: send this in one place only
        //     this._game.packetNotifier.notifyUpdatedStats(this, false);
        // }
    }

    /// Sets the position of this GameObject to the specified position.
    /// <param name="x">X coordinate to set.</param>
    /// <param name="y">Y coordinate to set.</param>
    teleportTo(x, y) {
        // if (
        //     !this._game.gameMap.navigationGrid.isWalkable(
        //         x,
        //         y,
        //         this.collisionRadius
        //     )
        // ) {
        //     let walkableSpot = this._game.gameMap.navigationGrid.getClosestTerrainExit(
        //         [x, y],
        //         this.collisionRadius + 1.0
        //     );
        //     this.setPosition(walkableSpot.x, walkableSpot.y);

        // } else {
        this.setPosition(x, y);
        // }
    }
}
