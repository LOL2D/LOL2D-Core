class WorldCore {
    constructor(config = {}) {
        this.championsClassName = {
            player: null,
            allies: [],
            enemies: [],
        };

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
            width: 2000,
            height: 2000,
        });
        this.terrainMap = new TerrainMapCore({
            map: TERRAIN_MAP.SUMMORNER_RIFT,
        });
        this.camera = new CameraCore();
        this.sight = new SightCore({ world: this });

        // ---- demo gameplay -----
        let playerBase = createVector(250, this.groundMap.height - 250);
        let enemyBase = createVector(this.groundMap.height - 250, 250);
        // ------------------------

        // turrets
        this.turrets.push(
            new TurretCore({
                position: playerBase.copy(),
                fillColor: "green",
                isAllyWithPlayer: true,
                world: this,
            })
        );

        this.turrets.push(
            new TurretCore({
                position: enemyBase.copy(),
                fillColor: "red",
                isAllyWithPlayer: false,
                world: this,
            })
        );

        // my champion
        if (this.championsClassName.player) {
            this.player = new this.championsClassName.player({
                isAllyWithPlayer: true,
                world: this,
                position: playerBase.copy(),
                bound: this.groundMap.getBound(),
            });
            this.champions.push(this.player);
            this.camera.follow(this.player.position);
        }

        // ally champions
        for (let champClass of this.championsClassName.allies) {
            let champ = new champClass({
                isAllyWithPlayer: true,
                world: this,
                position: playerBase.copy(),
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
        for (let champClass of this.championsClassName.enemies) {
            let champ = new champClass({
                isAllyWithPlayer: false,
                world: this,
                position: enemyBase.copy(),
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

    run(func) {
        // ----------- begin camera -----------
        this.camera.beginState();

        this.groundMap.drawEdge();
        this.groundMap.drawGrid(this.camera);

        this.terrainMap.show();

        for (let turret of this.turrets) {
            turret.run();
        }

        // func is something need to execute after world's camera beginState
        func && func();

        // champions AI
        for (let ai of this.listAI) {
            ai.run();
        }
        for (let champ of this.champions) {
            champ.run();
        }

        // ability objects
        for (let i = this.abilityObjects.length - 1; i >= 0; i--) {
            this.abilityObjects[i].run();

            // effect
            this.abilityObjects[i].effectChampions(this.champions);

            // check finish
            if (this.abilityObjects[i].checkFinished()) {
                this.abilityObjects.splice(i, 1);
            }
        }

        this.camera.endState();
        // ----------- end camera -----------

        // draw sight overlay to screen
        this.sight.draw();
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
