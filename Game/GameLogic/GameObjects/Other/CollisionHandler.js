export default class CollisionHandler {

        _gameMap;

          _objects = [];
        // This is the 'dynamic map', updated every update of the game.
          _quadDynamic;
          _objectBounds = new CollisionObject();

         constructor(gameMap)
        {
            _gameMap = gameMap;

            // Initializes a dynamic map using NavigationGrid properties and a CollisionObject which takes into account an object's CollisionRadius (+1 for insurance).
            // It will contain all GameObjects that should be able to collide with eachother, refer to IsCollisionObject.
            _quadDynamic = new QuadTree<IGameObject>(
                _gameMap.NavigationGrid.MinGridPosition.X,
                _gameMap.NavigationGrid.MinGridPosition.Z,
                // Subtract one cell's size from the max so we never reach the CellCountX/Y (since Cells is an array).
                _gameMap.NavigationGrid.MaxGridPosition.X + System.MathF.Abs(_gameMap.NavigationGrid.MinGridPosition.X),
                _gameMap.NavigationGrid.MaxGridPosition.Z + System.MathF.Abs(_gameMap.NavigationGrid.MinGridPosition.Z),
                _objectBounds
            );

            //Pathfinder.setMap(map);
            // Initialise the pathfinder.
        }

        /// <summary>
        /// Whether or not the specified GameObject is able to collide with other GameObjects.
        /// </summary>
        /// <param name="obj">GameObject to check.</param>
        /// <returns>True/False.</returns>
         bool IsCollisionObject(IGameObject obj)
        {
            // CollisionObjects can be any AI units, ObjBuildings, pure AttackableUnits, missiles, and pure GameObjects.
            // TODO: Implement static navgrid updates for turrets so we don't have to count them as collision objects.
            return !(obj.IsToRemove() || obj is ILevelProp || obj is IParticle);
        }

        /// <summary>
        /// Whether or not the specified GameObject is affected by collisions with other GameObjects.
        /// Used to determine if OnCollision functions should be called.
        /// </summary>
        /// <param name="obj">GameObject to check.</param>
        /// <returns>True/False.</returns>
         bool IsCollisionAffected(IGameObject obj)
        {
            // Collision affected GameObjects are non-turret AI units, AttackableUnits, missiles, and pure GameObjects.
            return !(obj.IsToRemove() || obj is ILevelProp || obj is IParticle || obj is IObjBuilding || obj is IBaseTurret);
        }

        /// <summary>
        /// Adds the specified GameObject to the list of GameObjects to check for collisions. *NOTE*: Will fail to fully add the GameObject if it is out of the map's bounds.
        /// </summary>
        /// <param name="obj">GameObject to add.</param>
         void AddObject(IGameObject obj)
        {
            _objects.Add(obj);

            // Add dynamic objects
            if (IsCollisionObject(obj))
            {
                // Returns false when out of bounds and fails.
                _quadDynamic.Insert(obj);
            }
        }

        /// <summary>
        /// GameObject to remove from the list of GameObjects to check for collisions.
        /// </summary>
        /// <param name="obj">GameObject to remove.</param>
         void RemoveObject(IGameObject obj)
        {
            _objects.Remove(obj);

            // Remove dynamic objects
            if (IsCollisionObject(obj))
            {
                _quadDynamic.Remove(obj);
            }
        }

        /// <summary>
        /// Function called every tick of the game by Map.cs.
        /// </summary>
         void Update()
        {
            // we iterate over a copy of _objects because the original gets modified
            var objectsCopy = new List<IGameObject>(_objects);
            foreach (var obj in objectsCopy)
            {
                if (!IsCollisionAffected(obj))
                {
                    continue;
                }

                if (!_gameMap.NavigationGrid.IsWalkable(obj.Position.X, obj.Position.Y))
                {
                    obj.OnCollision(null, true);
                }

                var nearest = _quadDynamic.GetNearestObjects(obj);
                foreach (var obj2 in nearest)
                {
                    if (obj == obj2 || !IsCollisionObject(obj2))
                    {
                        continue;
                    }

                    // TODO: Implement interpolation (or hull tracing) to account for fast moving gameobjects that may go past other gameobjects within one tick, which bypasses collision.
                    if (obj.IsCollidingWith(obj2))
                    {
                        obj.OnCollision(obj2);
                    }

                    // TODO: Implement repathing if our position within the next few ticks intersects with another GameObject (assuming we are moving; !IsPathEnded).
                }
            }

            UpdateQuadTree();
        }

        /// <summary>
        /// Used to reinitialize a QuadTree's sectors when objects may have moved out of sectors, which makes them unable to be removed.
        /// </summary>
         void UpdateQuadTree()
        {
            _quadDynamic = new QuadTree<IGameObject>(
                _quadDynamic.MainRect.Left,
                _quadDynamic.MainRect.Top,
                _quadDynamic.MainRect.Width,
                _quadDynamic.MainRect.Height,
                _objectBounds
            );
            _quadDynamic.InsertRange(_objects.FindAll(o => IsCollisionObject(o)));
        }
}