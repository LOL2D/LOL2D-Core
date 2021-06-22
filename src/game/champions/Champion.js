import AssetManager from "../../managers/AssetManager.js";
import { HasFlag } from "../../utils/Helpers.js";
import StatusFlags from "../enums/StatusFlags.js";
import Game from "../Game.js";
import GroundMap from "../maps/GroundMap.js";
import Stats from "../stats/Stats.js";

export default class Champion {
    constructor(
        /** @type Game */ game,
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
        if (!this.isDead() && this.canMove() && this.wayPoints.length > 0) {
            this.move();
        }
    }

    draw() {
        image(
            AssetManager.getAsset(this.skin),
            this.position.x,
            this.position.y,
            this.stats.size.total(),
            this.stats.size.total()
        );
    }

    move() {
        let direction = p5.Vector.sub(this.wayPoints[0], this.position);
        let distance = direction.mag();
        let speed = this.stats.moveSpeed.total();
        if (distance > 0) {
            let d = min(speed, distance);
            let v = direction.setMag(d);

            this.position.add(v);
        } else {
            this.wayPoints.shift();
        }
    }

    bound(/** @type GroundMap */ groundMap) {
        let radius = this.stats.size.total() / 2;
        let { top, bottom, left, right } = groundMap.getBound();

        if (this.position.x < left + radius) {
            this.position.x = left + radius;
        } else if (this.position.x > right - radius) {
            this.position.x = right - radius;
        }

        if (this.position.y < top + radius) {
            this.position.y = top + radius;
        } else if (this.position.y > bottom - radius) {
            this.position.y = bottom - radius;
        }
    }

    setStatus(statusFlag, enabled) {
        if (enabled) this.status |= statusFlag;
        else this.status &= ~statusFlag;
    }

    isDead() {
        return this.stats.currentHealth <= 0;
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
