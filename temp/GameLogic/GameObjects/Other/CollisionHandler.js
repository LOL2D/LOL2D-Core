export default class CollisionHandler {
    constructor(gameMap) {
        this._gameMap = gameMap;
        this._objects = [];

        // This is the 'dynamic map', updated every update of the game.
        this._quadDynamic = new Quadtree({
            x: 0,
            y: 0,
            width: this._gameMap._mapProperties.width,
            height: this._gameMap._mapProperties.height,
        });

        console.log(this._gameMap);

        setTimeout(() => {console.log(this._quadDynamic)}, 2000) 
    }

    /// Whether or not the specified GameObject is able to collide with other GameObjects.
    /// <param name="obj">GameObject to check.</param>
    /// <returns>True/False.</returns>
    isCollisionObject(obj) {
        // CollisionObjects can be any AI units, ObjBuildings, pure AttackableUnits, missiles, and pure GameObjects.
        // TODO: Implement static navgrid updates for turrets so we don't have to count them as collision objects.
        return !(
            obj.isToRemove() //||
            // obj instanceof LevelProp ||
            // obj instanceof Particle
        );
    }

    /// Whether or not the specified GameObject is affected by collisions with other GameObjects.
    /// Used to determine if OnCollision functions should be called.
    /// <param name="obj">GameObject to check.</param>
    /// <returns>True/False.</returns>
    isCollisionAffected(obj) {
        // Collision affected GameObjects are non-turret AI units, AttackableUnits, missiles, and pure GameObjects.
        return !(
            obj.isToRemove() //||
            // obj instanceof LevelProp ||
            // obj instanceof Particle ||
            // obj instanceof ObjBuilding ||
            // obj instanceof BaseTurret
        );
    }

    /// Adds the specified GameObject to the list of GameObjects to check for collisions. *NOTE*: Will fail to fully add the GameObject if it is out of the map's bounds.
    /// <param name="obj">GameObject to add.</param>
    addObject(obj) {
        this._objects.push(obj);

        // Add dynamic objects
        if (this.isCollisionObject(obj)) {
            // Returns false when out of bounds and fails.
            this._quadDynamic.insert(this.getObjQuadInfo(obj));
        }
    }

    /// GameObject to remove from the list of GameObjects to check for collisions.
    /// <param name="obj">GameObject to remove.</param>
    removeObject(obj) {
        this._objects.remove(obj);

        // Remove dynamic objects
        if (this.isCollisionObject(obj)) {
            this._quadDynamic.remove(this.getObjQuadInfo(obj));
        }
    }

    getObjQuadInfo(obj) {
        return {
            x: obj.position.x,
            y: obj.position.y,
            width: obj.collisionRadius * 2,
            height: obj.collisionRadius * 2,
            ref: obj,
        };
    }

    /// Function called every tick of the game by Map.cs.
    update() {
        // we iterate over a copy of _objects because the original gets modified
        let objectsCopy = [...this._objects];
        for (let obj of objectsCopy) {
            if (!this.isCollisionAffected(obj)) {
                continue;
            }

            if (
                !this._gameMap.navigationGrid.isWalkable(
                    obj.position.x,
                    obj.position.y
                )
            ) {
                obj.onCollision(null, true);
            }

            let nearest = this._quadDynamic.getNearestObjects(obj);
            for (let obj2 of nearest) {
                if (obj == obj2 || !this.isCollisionObject(obj2)) {
                    continue;
                }

                // TODO: Implement interpolation (or hull tracing) to account for fast moving gameobjects that may go past other gameobjects within one tick, which bypasses collision.
                if (obj.isCollidingWith(obj2)) {
                    obj.onCollision(obj2);
                }

                // TODO: Implement repathing if our position within the next few ticks intersects with another GameObject (assuming we are moving; !IsPathEnded).
            }
        }

        this.updateQuadtree();
    }

    /// Used to reinitialize a Quadtree's sectors when objects may have moved out of sectors, which makes them unable to be removed.
    updateQuadtree() {
        this._quadDynamic.clear();
        this._objects
            .filter((o) => this.isCollisionObject(o))
            .forEach((o) => this._quadDynamic.insert(this.getObjQuadInfo(o)));
    }
}
