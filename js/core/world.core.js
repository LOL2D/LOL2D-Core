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
        this.gamemap = null;
        this.camera = null;

        this.abilityObjects = [];
        this.champions = [];
        this.listAI = [];

        // ----- setup value -----
        this.gamemap = new GameMapCore();
        this.camera = new CameraCore();

        // my champion
        if (this.championsClassName.player) {
            this.player = new this.championsClassName.player({
                isAllyWithPlayer: true,
                world: this,
                position: createVector(random(1000), random(1000)),
                bound: this.gamemap.getBound(),
            });
            this.champions.push(this.player);
            this.camera.follow(this.player.position);
        }

        // ally champions
        for (let champClass of this.championsClassName.allies) {
            let champ = new champClass({
                isAllyWithPlayer: true,
                world: this,
                position: createVector(random(1000), random(1000)),
                bound: this.gamemap.getBound(),
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
                position: createVector(random(1000), random(1000)),
                bound: this.gamemap.getBound(),
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

        this.gamemap.drawEdge();
        this.gamemap.drawGrid(this.camera);

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
        return this.camera.convert(mouseX, mouseY);
    }
}
