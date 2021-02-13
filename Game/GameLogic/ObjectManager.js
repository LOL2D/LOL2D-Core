import TeamID from "./Enums/TeamID.js";

export default class ObjectManager {
    constructor(game) {
        this.game = game;
        this.objects = {};
        this.champions = {};
        this.visionUnits = {};

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
        for (let key in this.objects) {
            this.objects[key].draw();
        }
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

    // Champions
    addChampion(champion) {
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
    }
}
