
    
    /// Class containing coordinate conversions usually used for packets.
    /// Most coordinates understandable by the League clients are oriented around an origin which is at the center of the map,
    /// however, LeagueSandbox has its origin at the bottom left corner of the map (behind blue fountain), so a conversion is needed.
    
    export default class MovementVector
    {
        x;
        y;

        constructor(game, x, y)
        {
            if(game == null) {
                this.x = x;
                this.y = y;
            } else {
                this.x = this.formatCoordinate(x, game.gameMap.navigationGrid.middleOfMap.y);
                this.y = this.formatCoordinate(y, game.gameMap.navigationGrid.middleOfMap.x);
            }
        }

        
        /// Converts the given coordinate by changing its origin to the given origin.
        /// <param name="coordinate">Coordinate to convert.</param>
        /// <param name="origin">New origin for the coordinate.</param>
        /// <returns>Converted coordinate.</returns>
        static formatCoordinate(coordinate, origin)
        {
            return (coordinate - origin) / 2;
        }

        
        /// Converts the given X coordinate to one which originates at the center of the map.
        /// <param name="navGrid">NavGrid of the current map.</param>
        /// <param name="value">Coordinate to convert.</param>
        /// <returns>Converted coordinate.</returns>
        static targetXToNormalFormatNavGrid(navGrid, value)
        {
            return this.formatCoordinate(value, navGrid.middleOfMap.x);
        }

        
        /// Converts the given X coordinate to one which originates at the center of the map.
        /// <param name="game">Current Game instance.</param>
        /// <param name="value">Coordinate to convert.</param>
        /// <returns>Converted coordinate.</returns>
                static targetXToNormalFormat(game, value)
        {
            return this.targetXToNormalFormatNavGrid(game.gameMap.navigationGrid, value);
        }

        
        /// Converts the given Y coordinate to one which originates at the center of the map.
        /// <param name="navGrid">NavGrid of the current map.</param>
        /// <param name="value">Coordinate to convert.</param>
        /// <returns>Converted coordinate.</returns>
        static targetYToNormalFormatNavGrid(navGrid, value)
        {
            return this.formatCoordinate(value, navGrid.middleOfMap.y);
        }

        
        /// Converts the given Y coordinate to one which originates at the center of the map.
        /// <param name="game">Current Game instance.</param>
        /// <param name="value">Coordinate to convert.</param>
        /// <returns>Converted coordinate.</returns>
        static targetYToNormalFormat(game, value)
        {
            return this.targetYToNormalFormatNavGrid(game.gameMap.navigationGrid, value);
        }

        
        /// Converts a 2D vector from normal coordinates to ones compatible with League (usually used in packets); origin at the center of the map.
        /// <param name="coords">Vector2 to convert.</param>
        /// <param name="navGrid">Current NavGrid.</param>
        /// <returns>Vector2 with origin at the middle of the map.</returns>
        static toCenteredScaledCoordinates(coords, navGrid)
        {
            let v = createVector(this.formatCoordinate(coords.x, navGrid.middleOfMap.x), this.formatCoordinate(coords.y, navGrid.middleOfMap.y));
            return v;
        }
    }

