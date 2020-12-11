class AbilityObject extends MovementObject {
    constructor(config = {}) {
        super(config);

        // default value
        this.owner = null;
        this.isStarted = false;
        this.finished = false; // flag

        // set value
        for (let c in config) {
            this[c] = config[c];
        }
    }

    run() {
        if (!this.isStarted) {
            this.onStarted();
            this.isStarted = true;
        }

        this.move();
        this.show();

        if (this.checkFinished() || this.finished) {
            this.onFinished();
            this.finished = true;
        }
    }
    onStarted() {}
    onFinished() {}
    checkFinished() {}
}
