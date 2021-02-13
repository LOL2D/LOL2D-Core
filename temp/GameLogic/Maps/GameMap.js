import SummonersRift from "./SummonersRift.js";
import CollisionHandler from "../GameObjects/Other/CollisionHandler.js";

export default class GameMap {
    constructor(game) {
        this._game = game;
        this._id = 1; //this._game.config.gameConfig.map;
        // this._announcerEvents = [];
        this._mapProperties = this.getMapProperties(this._id);
        this._collisionHandler = new CollisionHandler(this);
    }

    /**
     * Function called every tick of the game. Updates CollisionHandler, MapProperties, and executes AnnouncerEvents.
     * @param  {Number} diff - Number of milliseconds since this tick occurred.
     */
    update(diff) {
        this._collisionHandler.update();

        // for (let announce of this._announcerEvents) {
        //     if (
        //         !announce.isAnnounced &&
        //         this._game.gameTime >= announce.eventTime
        //     ) {
        //         announce.execute();
        //     }
        // }

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
            // [0] = FlatTestMap,
            [1]: SummonersRift,
            // [2] = HarrowingRift,
            // [3] = ProvingGrounds,
            // [4] = TwistedTreeline,
            // [6] = WinterRift,
            // [8] = CrystalScar,
            // [10] = NewTwistedTreeline,
            // [11] = NewSummonersRift,
            // [12] = HowlingAbyss,
            // [14] = ButchersBridge
        };

        if (!(mapId in dict)) {
            return new SummonersRift(this._game);
        }

        return new dict[mapId](this._game);
    }
}
