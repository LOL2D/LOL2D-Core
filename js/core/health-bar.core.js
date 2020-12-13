class HealthBarCore {
    constructor(config = {}) {
        this.champion = null;

        this.distanceFromChamp = 30;
        this.width = 150;
        this.height = 20;
        this.manaHeight = 5;
        this.border = 1;

        this.healthColor = "#43C41D";
        this.fakeHealthColor = "#C8C8CB";
        this.manaColor = "#6CB3D5";
        this.levelColor = "#3287B9";
        this.levelBg = "#101F26";
        this.borderColor = "black";

        this.position = createVector(0, 0);

        Utils.setValueFromConfig(this, config);
    }

    show() {
        let topleft = {
            x: this.champion.position.x - this.width / 2,
            y:
                this.champion.position.y -
                this.champion.radius -
                this.distanceFromChamp -
                this.height,
        };

        this.position.set(
            topleft.x + this.width / 2,
            topleft.y + this.height / 2
        );

        noStroke();

        // background
        fill(this.borderColor);
        rect(
            topleft.x - this.border,
            topleft.y - this.border,
            this.width + this.border * 2,
            this.height + this.border * 2
        );

        // health
        const { health, fakeHealth, maxHealth } = this.champion;
        const totalHealth = maxHealth + fakeHealth;
        const healthContainerW = this.width - this.height;
        const healthW = map(health, 0, totalHealth, 0, healthContainerW);

        fill(this.healthColor);
        rect(
            topleft.x + this.height,
            topleft.y,
            healthW,
            this.height - this.manaHeight - this.border
        );

        // fake health
        const fakeHW = map(fakeHealth, 0, totalHealth, 0, healthContainerW);

        fill(this.fakeHealthColor);
        rect(
            topleft.x + this.height + healthW,
            topleft.y,
            fakeHW,
            this.height - this.manaHeight - this.border
        );

        // mana
        const { mana, maxMana } = this.champion;
        const manaW = map(mana, 0, maxMana, 0, this.width - this.height);

        fill(this.manaColor);
        rect(
            topleft.x + this.height,
            topleft.y + this.height - this.manaHeight,
            manaW,
            this.manaHeight
        );

        // level
        fill(this.levelBg);
        rect(topleft.x, topleft.y, this.height, this.height);

        fill(this.levelColor);
        stroke(this.levelColor);
        strokeWeight(1);
        text(
            this.champion.level,
            topleft.x + this.height / 2,
            topleft.y + this.height / 2
        );
    }
}
