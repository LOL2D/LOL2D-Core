class WorldCore {
    constructor(config = {}) {
        this.gamemap = null;
        this.camera = null;

        this.abilityObjects = [];
        this.champions = [];
        this.listAI = [];
        this.player = null;

        // setting
        this.AICount = 4;

        // setup
        this.setup();
    }

    setup() {
        this.gamemap = new GameMapCore();
        this.camera = new CameraCore();

        // my champion
        this.player = new Ahri({
            bound: this.gamemap.getBound(),
        });
        this.champions.push(this.player);
        this.camera.target = this.player.position;

        // AI champions
        for (let i = 0; i < this.AICount; i++) {
            let champ = new Ahri({
                position: createVector(random(1000), random(1000)),
                bound: this.gamemap.getBound(),
            });

            this.champions.push(champ);
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
        func();

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

    convertToWorldPosition() {}
}
