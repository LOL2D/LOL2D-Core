import TeamID from "../../enums/TeamID.js";

export default class GameObject {
    constructor(
        game,
        position = createVector(),
        collisionRadius = 40,
        visionRadius = 0,
        teamId = TeamID.TEAM_NEUTRAL,
    ) {
        this.game = game;
        this.position = position;
        this.direction = createVector();
        this.collisionRadius = collisionRadius;
        this.visionRadius = visionRadius;
        this.teamId = teamId;
        this.visibleByTeam = new Set();
        this.isToRemove = false;
    }

    // Sets the position of this object.
    setPosition(x, y) {
        if (x instanceof p5.Vector) this.position.set(x.x, x.y);
        else this.position.set(x, y);
    }

    // Sets this GameObject's current orientation
    faceDirection(newDirection, isInstant = true, turnTime = 0.083) {
        // TODO: implement isInstant and turnTime
        this.direction.set(newDirection.x, newDirection.y);
    }

    // Whether or not the specified object is colliding with this object.
    isCollidingWith(gameObject) {
        return (
            p5.Vector.dist(this.position, gameObject.position) <
            this.collisionRadius + this.gameObject.collisionRadius
        );
    }

    // Sets the object's team.
    setTeam(teamId) {
        this.visibleByTeam.delete(this.teamId);
        this.teamId = teamId;
        this.visibleByTeam.add(this.teamId);
    }

    display() {
        fill(255);
        circle(this.position.x, this.position.y, this.collisionRadius * 2);
    }
}
