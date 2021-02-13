import TeamId from "../Enums/TeamID.js";
import uuidv4 from "../Helpers/uuid.js";

export default class GameObject {
    constructor(
        game,
        position = createVector(0, 0),
        collisionRadius = 40,
        visionRadius = 0,
        id = uuidv4(),
        team = TeamId.TEAM_NEUTRAL
    ) {
        this.id = id;
        this.game = game;
        this.position = position;
        this.collisionRadius = collisionRadius;
        this.visionRadius = visionRadius;
        this.team = team;

        this.visibleByTeam = {};
        for (let key in TeamId) {
            this.visibleByTeam[TeamId[key]] = false;
        }

        this.toRemove = false;
    }

    // events
    onAdded() {}

    onRemoved() {}

    onCollision(collider, isTerrain) {}

    // update
    update() {}

    // draw
    draw() {
        fill(255);
        circle(this.position.x, this.position.y, this.collisionRadius * 2);
    }

    // others
    setPosition(x, y) {
        this.position.set(x, y);
    }

    isCollidingWith(o) {
        return (
            p5.Vector.dist(this.position, o.position) <
            this.collisionRadius + o.collisionRadius
        );
    }

    setTeam(team) {
        this._visibleByTeam[this.team] = false;
        this.team = team;
        this._visibleByTeam[this.team] = true;
    }

    isVisibleByTeam(team) {
        return team == this.team || this._visibleByTeam[team];
    }

    setVisibleByTeam(team, visible) {
        this._visibleByTeam[team] = visible;
    }

    isToRemove() {
        return this.toRemove;
    }

    setToRemove() {
        this.toRemove = true;
    }
}
