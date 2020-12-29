import Helper from "../helper/index.js";
import GroundMapCore from "./ground-map.core.js";
import TerrainMapCore from "./terrain-map.core.js";
import CameraCore from "./camera.core.js";
import SightCore from "./sight.core.js";
import TurretCore from "./turret.core.js";
import AICore from "./ai.core.js";
import HUDCore from "./hud.core.js";

export default class WorldCore {
    constructor(config = {}) {
        this.championsClassName = {
            player: null,
            allies: [],
            enemies: [],
        };

        this.size = 500;
        this.accumulator = 0;

        // set value from config
        Helper.Other.setValueFromConfig(this, config);

        // setup
        this.setup();
    }

    setup() {
        // ----- default value -----
        this.groundMap = null;
        this.terrainMap = null;
        this.camera = null;

        this.abilityObjects = [];
        this.champions = [];
        this.turrets = [];

        this.listAI = [];

        // ----- setup value -----
        this.groundMap = new GroundMapCore({
            width: this.size,
            height: this.size,
        });
        this.terrainMap = new TerrainMapCore({
            jsonData: this.terrainMapData,
            width: this.size,
            height: this.size,
        });
        this.camera = new CameraCore();
        this.sight = new SightCore({ world: this });
        this.hud = new HUDCore({ world: this });

        // ---- demo gameplay -----
        this.playerBase = createVector(300, this.groundMap.height - 300);
        this.enemyBase = createVector(this.groundMap.height - 300, 300);
        // ------------------------

        // turrets
        this.turrets.push(
            new TurretCore({
                position: this.enemyBase.copy(),
                fillColor: "red",
                isAllyWithPlayer: false,
                world: this,
            })
        );

        let allyTurrets = [
            [300, this.groundMap.height - 300],
            [1590, 4788],
            [521, 4450],
            [1942, 5850],
            [2995, 5775],
            [4558, 5962],
            [2153, 4346],
            [2543, 3687],
            [604, 3557],
            [410, 1859],
        ];
        for (let pos of allyTurrets) {
            this.turrets.push(
                new TurretCore({
                    position: createVector(pos[0], pos[1]),
                    fillColor: "green",
                    isAllyWithPlayer: true,
                    world: this,
                })
            );
        }

        let enemyTurrets = [
            [this.groundMap.height - 300, 300],
            [5454, 779],
            [5646, 967],
            [4517, 518],
            [4790, 1617],
            [5898, 1922],
        ];
        for (let pos of enemyTurrets) {
            this.turrets.push(
                new TurretCore({
                    position: createVector(pos[0], pos[1]),
                    fillColor: "red",
                    isAllyWithPlayer: false,
                    world: this,
                })
            );
        }

        // my champion
        if (this.championsClassName.player) {
            this.player = new this.championsClassName.player({
                name: "You",
                isAllyWithPlayer: true,
                world: this,
                position: this.playerBase.copy(),
                bound: this.groundMap.getBound(),
            });
            this.champions.push(this.player);
            this.camera.follow(this.player.position, true);
        }

        // ally champions
        let nameIndex = 0;
        for (let champClass of this.championsClassName.allies) {
            let champ = new champClass({
                name: "Ally " + nameIndex++,
                isAllyWithPlayer: true,
                world: this,
                position: this.playerBase.copy(),
                bound: this.groundMap.getBound(),
            });

            this.champions.push(champ);

            // add AI control
            this.listAI.push(
                new AICore({
                    champion: champ,
                    world: this,
                })
            );
        }

        // enemy champions
        nameIndex = 0;
        for (let champClass of this.championsClassName.enemies) {
            let champ = new champClass({
                name: "Enemy " + nameIndex++,
                isAllyWithPlayer: false,
                world: this,
                position: this.enemyBase.copy(),
                bound: this.groundMap.getBound(),
            });

            this.champions.push(champ);

            // add AI control
            this.listAI.push(
                new AICore({
                    champion: champ,
                    world: this,
                })
            );
        }
    }

    // https://medium.com/@tglaiel/how-to-make-your-game-run-at-60fps-24c61210fe75
    fixedUpdate() {
        this.accumulator += min(deltaTime, 250);
        while (this.accumulator > 1000 / 61) {
            this.update();
            this.accumulator -= 1000 / 60;

            if (this.accumulator < 1000 / 59 - 1000 / 60) this.accumulator = 0;
        }
    }

    update() {
        this.camera.update();

        for (let champ of this.champions) {
            if (this.terrainMap.effect(champ)) {
                // TODO this is test, remove later
                if (champ != this.player) champ.removeDestination();
            }
        }

        for (let turret of this.turrets) {
            turret.update();
        }

        for (let ai of this.listAI) {
            ai.update();
        }

        for (let champ of this.champions) {
            champ.update();

            if (champ.isDead()) {
                // heal for killer
                if (champ.killedBy && champ.killedBy.owner) {
                    champ.killedBy.owner.heal(200);
                    champ.killedBy.owner.addMana(200);
                }

                // spawn at base
                champ.spawn({
                    position: champ.isAllyWithPlayer
                        ? this.playerBase
                        : this.enemyBase,
                    health: 1,
                    mana: champ.mana,
                });

                // decrease level
                // if (champ.level > 0) champ.level--;

                // increase killer's level
                // if (champ.killedBy) champ.killedBy.level++;

                // restore some heal
                champ.heal(100);
            }
        }

        for (let i = this.abilityObjects.length - 1; i >= 0; i--) {
            this.abilityObjects[i].update();

            // effect
            this.abilityObjects[i].effectChampions(this.champions);

            // check finish
            if (this.abilityObjects[i].isFinished) {
                this.abilityObjects.splice(i, 1);
            }
        }
    }

    show(func) {
        background(30);

        // ================ begin state camera ================
        this.camera.beginState();

        this.groundMap.drawEdge();
        // this.groundMap.drawGrid(this.camera);

        for (let turret of this.turrets) {
            turret.show();
        }

        this.terrainMap.show(this.camera);

        this.camera.endState();
        // ================ END state camera ================

        // draw sight overlay to screen
        this.sight.draw();

        // ================ begin state camera ================
        this.camera.beginState();

        // func is something need to execute after world's camera beginState
        func && func();

        for (let champ of this.champions) {
            let { x, y, w, h } = this.camera.getViewBoundary();
            let r = champ.radius;
            let r2 = r * 2;

            let inview = Helper.Collide.pointRect(
                champ.position.x,
                champ.position.y,
                x - r,
                y - r,
                w + r2,
                h + r2
            );

            if (inview && this.sight.isChampionInSight(champ)) {
                champ.show();
            }
        }

        for (let ao of this.abilityObjects) {
            ao.show();
        }

        this.camera.endState();
        // ================ END state camera ================

        // draw hud
        this.hud.show();
    }

    addNewSpellObjects(something) {
        if (something) {
            if (Array.isArray(something))
                this.abilityObjects.push(...something);
            else this.abilityObjects.push(something);
        }
    }

    // ------------- utils -------------
    getMousePosition() {
        return this.camera.canvasToWorld(mouseX, mouseY);
    }

    resizeWindow(w, h) {
        this.sight.resize(w, h);
    }
}
