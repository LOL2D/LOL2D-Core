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

        this.effectOnChampions = [];
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
                position: this.playerBase.copy(),
                fillColor: "#00A201",
                isAllyWithPlayer: true,
                world: this,
            })
        );
        this.turrets.push(
            new TurretCore({
                position: this.enemyBase.copy(),
                fillColor: "#F43E07",
                isAllyWithPlayer: false,
                world: this,
            })
        );

        for (let pos of this.terrainMapData.turret1) {
            this.turrets.push(
                new TurretCore({
                    position: createVector(pos[0], pos[1]),
                    fillColor: "#00A201",
                    isAllyWithPlayer: true,
                    world: this,
                })
            );
        }

        for (let pos of this.terrainMapData.turret2) {
            this.turrets.push(
                new TurretCore({
                    position: createVector(pos[0], pos[1]),
                    fillColor: "#F43E07",
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

        // sight visibility
        this.sight.calculateSight();
    }

    update() {
        this.camera.update();

        // turret
        for (let turret of this.turrets) {
            turret.update();
        }

        // effect on champion
        for (let i = this.effectOnChampions.length - 1; i >= 0; i--) {
            this.effectOnChampions[i].update();

            // effect
            this.effectOnChampions[i].onEffect();

            // check finish
            if (this.effectOnChampions[i].isFinished) {
                this.effectOnChampions.splice(i, 1);
            }
        }

        // terrain collision
        for (let champ of this.champions) {
            if (this.terrainMap.effect(champ)) {
                // TODO this is test, remove later
                if (champ != this.player) champ.removeDestination();
            }
        }

        // AI
        for (let ai of this.listAI) {
            ai.update();
        }

        // champions
        for (let champ of this.champions) {
            champ.update();

            if (champ.isDead()) {
                // heal for killer
                if (champ.lastDamageSource) {
                    champ.lastDamageSource.heal(200);
                    champ.lastDamageSource.addMana(100);
                }

                // spawn at base
                champ.spawn({
                    position: champ.isAllyWithPlayer
                        ? this.playerBase
                        : this.enemyBase,
                    health: 1,
                    mana: champ.mana,
                });

                // remove all effects
                for (let ef of this.effectOnChampions) {
                    if (ef.target == champ) {
                        ef.isFinished = true;
                    }
                }

                // decrease level
                champ.level--;

                // increase killer's level
                if (champ.lastDamageSource) champ.lastDamageSource.level++;

                // restore some heal
                champ.heal(100);
            }
        }

        // ability objects
        for (let i = this.abilityObjects.length - 1; i >= 0; i--) {
            this.abilityObjects[i].update();

            // effect
            this.abilityObjects[i].onEffect();

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

        // draw champion
        let visibleChampions = this.sight.getAllChampionsCanSeeOf(this.player);

        for (let champ of visibleChampions) {
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

            if (inview) {
                champ.show();
            }
        }

        for (let ao of this.abilityObjects) {
            ao.show();
        }

        for (let ef of this.effectOnChampions) {
            ef.show();
        }

        this.camera.endState();
        // ================ END state camera ================

        // draw hud
        this.hud.show();
    }

    addNewEffectOnChampion(effect) {
        if (effect) {
            if (Array.isArray(effect)) this.effectOnChampions.push(...effect);
            else this.effectOnChampions.push(effect);
        }
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

    /* 
        parameters: {
            rootPosition: ,
            champions: array of champions,
            inRange: range to check,
            addChampRadiusToRange: true / false,
            allyWithPlayer: true / false / null(get all),
            excludes: array of champions want to exclude,
        }
    */
    getClosestChampionInRange(config = {}) {
        const champs = this.getChampionsInRange(config);
        return this.getClosestChampion(config.rootPosition, champs);
    }

    getChampionsInRange(config = {}) {
        const {
            rootPosition,
            champions = this.champions,
            inRange = Infinity,
            addChampRadiusToRange = false,
            allyWithPlayer = null,
            excludes = [],
        } = config;

        let champsInRange = [];

        for (let champ of champions) {
            if (allyWithPlayer != null) {
                if (champ.isAllyWithPlayer != allyWithPlayer) continue;
            }

            if (excludes.indexOf(champ) >= 0) continue;

            let distance = p5.Vector.dist(rootPosition, champ.position);
            let range = addChampRadiusToRange
                ? inRange + champ.radius
                : inRange;

            if (distance < range) {
                champsInRange.push(champ);
            }
        }

        return champsInRange;
    }

    getClosestChampion(rootPosition, champions = this.champions) {
        let closestChamp = null;
        let closestDistance = Infinity;

        for (let champ of champions) {
            let distance = p5.Vector.dist(champ.position, rootPosition);
            if (distance < closestDistance) {
                closestChamp = champ;
                closestDistance = distance;
            }
        }

        return closestChamp;
    }
}
