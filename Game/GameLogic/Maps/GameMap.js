export default class GameMap {
    _game;
    _collisionHandler;
    _mapProperties;
    _announcerEvents;

    constructor(game) {
        this._game = game;
        this.id = 1;//this._game.config.gameConfig.map;
        this._announcerEvents = [];
        this._collisionHandler = new CollisionHandler(this);
        this._mapProperties = this.getMapProperties(this.id);
    }

    /**
     * Function called every tick of the game. Updates CollisionHandler, MapProperties, and executes AnnouncerEvents.
     * @param  {Number} diff - Number of milliseconds since this tick occurred.
     */
    update(diff) {
        this._collisionHandler.update();
        
        for (let announce of this._announcerEvents) {
            if (!announce.isAnnounced && this._game.gameTime >= announce.eventTime) {
                announce.execute();
            }
        }

        this._mapProperties.update(diff);
    }

    /**
     * Initializes MapProperties. Usually only occurs once before players are added to Game.
     */
    init() {
        this._mapProperties.init();
    }

    getMapProperties(mapId) {
        var dict = {
            // [0] = typeof(FlatTestMap),
            [1]: typeof SummonersRift,
            // [2] = typeof(HarrowingRift),
            // [3] = typeof(ProvingGrounds),
            // [4] = typeof(TwistedTreeline),
            // [6] = typeof(WinterRift),
            // [8] = typeof(CrystalScar),
            // [10] = typeof(NewTwistedTreeline),
            // [11] = typeof(NewSummonersRift),
            // [12] = typeof(HowlingAbyss),
            // [14] = typeof(ButchersBridge)
        };

        if (!(mapId in dict)) {
            return new SummonersRift(this._game);
        }

        return null;
    }
}
