import AssetManager from "../../../AssetManager.js";
import Spell from "../spells/Spell.js";
import { getChampionData } from "./ChampionData.js";

export default class Champion {
    constructor(game, champData, position = createVector(0, 0)) {
        this.game = game;
        this.championData = getChampionData(champData);
        this.position = position;
        this.destination = position.copy();

        this.spells = {
            Q: new Spell(game, this, this.championData.Q, 0),
        };

        console.log(this);
    }

    update() {
        this.move();
    }

    draw() {
        push();
        translate(this.position.x, this.position.y);
        image(
            AssetManager.getAsset(this.championData.model),
            0,
            0,
            this.championData.radius * 2,
            this.championData.radius * 2
        );

        let dir = this.getDirection().setMag(this.championData.radius);
        stroke(255);
        strokeWeight(5);
        line(0, 0, dir.x, dir.y);
        pop();
    }

    move() {
        let dir = this.getDirection();
        this.position.add(dir.setMag(min(this.championData.speed, dir.mag())));
    }

    getDirection() {
        return p5.Vector.sub(this.destination, this.position);
    }

    setDestination(x, y) {
        this.destination.set(x, y);
    }
}
