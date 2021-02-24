import TeamID from "./Enums/TeamID.js";
import Collision from "./Helpers/Collision.js";

export default class ObjectManager {
    constructor(game) {
        this.game = game;
        this.objects = {};
        this.champions = {};
        this.visionUnits = {};
        this.player = null;

        this.teams = { ...TeamID };
        for (let key in this.teams) {
            this.visionUnits[key] = {};
        }
    }

    update(diff) {
        let obj;

        for (let key in this.objects) {
            obj = this.objects[key];

            if (obj.isToRemove()) {
                this.removeObject(obj);
                continue;
            }

            obj.update(diff);
        }
    }

    draw() {
        this.game.camera.beginState();

        let objsInView = this.getObjectsInView();
        // text(Object.keys(objsInView), width / 2, 100);

        for (let key in objsInView) {
            // line(0, 0, objsInView[key].position.x, objsInView[key].position.y);
            objsInView[key].draw();
        }

        this.game.camera.endState();
    }

    addObject(o) {
        if (o == null) {
            return;
        }

        this.objects[o.id] = o;
        o.onAdded();
    }

    removeObject(o) {
        delete this.objects[o.id];
        o.onRemoved();
    }

    getObjectById(id) {
        if (this.objects[id] === null) {
            return null;
        }

        return this.objects[id];
    }

    getObjectsInView() {
        let result = {};
        let camx = this.game.camera.position.x,
            camy = this.game.camera.position.y,
            camw = width * this.game.camera.scale,
            camh = height * this.game.camera.scale;

        for (let key in this.objects) {
            let o = this.objects[key];
            let collided = Collision.rectRect(
                camx,
                camy,
                camw,
                camh,
                o.position.x,
                o.position.y,
                o.collisionRadius * 2,
                o.collisionRadius * 2
            );
            if (collided) result[key] = this.objects[key];
        }

        return result;
    }

    // Champions
    /*addChampion(champion) {
        this.champion[champion.id] = champion;
    }

    removeChampion(champion) {
        delete this.champion[champion.id];
    }

    getAllChampions() {
        let champs = [];
        for (let key in this.champion) {
            champs.push(this.champion[key]);
        }

        return champs;
    }

    getAllChampionsFromTeam(team) {
        let champs = [];
        for (let key in this.champion) {
            let c = this.champion[key];
            if (c.team == team) {
                champs.push(c);
            }
        }

        return champs;
    }

    getChampionsInRange(checkPos, range, onlyAlive = false) {
        let champs = [];
        for (let key in this.champion) {
            let c = this.champion[key];
            if (p5.Vector.dist(checkPos, c.position) <= range)
                if ((onlyAlive && !c.isDead) || !onlyAlive) champs.push(c);
        }

        return champs;
    }*/
}
