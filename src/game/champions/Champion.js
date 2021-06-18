import AssetManager from "../../AssetManager.js";
import { HasFlag } from "../../utils/Helpers.js";
import StatusFlags from "../enums/StatusFlags.js";
import Stats from "../stats/Stats.js";

export default class Champion {
    constructor(
        game,
        position = createVector(),
        skin = "",
        stats = new Stats(),
        spells = {}
    ) {
        this.game = game;
        this.position = position;
        this.skin = skin;
        this.stats = stats;
        this.status =
            StatusFlags.CanCast | StatusFlags.CanMove | StatusFlags.CanAttack;
        this.spells = spells;

        this.wayPoints = [];
    }

    update(diff) {
        this.move();
    }

    draw() {
        image(
            AssetManager.getAsset(this.skin),
            this.position.x,
            this.position.y,
            this.stats.size.baseValue,
            this.stats.size.baseValue
        );
    }

    move() {
        if (this.canMove()) {
        }
    }

    setStatus(statusFlag, enabled) {
        if (enabled) this.status |= statusFlag;
        else this.status &= ~statusFlag;
    }

    canMove() {
        return HasFlag(this.status, StatusFlags.CanMove);
    }

    canCast() {
        return HasFlag(this.status, StatusFlags.CanCast);
    }

    canAttack() {
        return HasFlag(this.status, StatusFlags.CanAttack);
    }
}
