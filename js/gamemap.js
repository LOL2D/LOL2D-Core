class GameMap {
    constructor(config) {
        // default value
        this.width = 1000;
        this.height = 1000;
        this.edgeColor = "gray";
        this.edgeWeight = 3;
        this.grid = true;
        this.gridSize = 300;
        this.gridColor = "gray";
        this.gridWeight = 3;

        // set value
        for (let c in config) {
            this[c] = config[c];
        }
    }

    drawEdge() {
        // Vẽ biên
        // dùng 4 đỉnh đê vẽ hình chữ nhât
        let topleft = createVector(0, 0); // đỉnh trên trái
        let topright = createVector(this.width, 0); // đỉnh trên phải
        let botleft = createVector(0, this.height); // đỉnh dưới trái
        let botright = createVector(this.width, this.height); // đỉnh dưới phải

        stroke(this.edgeColor);
        strokeWeight(this.edgeWeight);

        // Ve duong thang qua cac dinh
        line(topleft.x, topleft.y, topright.x, topright.y);
        line(topright.x, topright.y, botright.x, botright.y);
        line(botright.x, botright.y, botleft.x, botright.y);
        line(botleft.x, botleft.y, topleft.x, topleft.y);
    }

    drawGrid(camera) {
        stroke(this.gridColor);
        strokeWeight(this.gridWeight);
        let delta = 1;

        let { x: leftScreen, y: topScreen } = camera.convert(0, 0);
        let { x: rightScreen, y: bottomScreen } = camera.convert(width, height);

        let leftMap = max(leftScreen, 0);
        let rightMap = min(rightScreen, this.width);
        let topMap = max(topScreen, 0);
        let bottomMap = min(bottomScreen, this.height);

        for (let x = leftMap; x < rightMap; x += delta) {
            if (floor(x) % this.gridSize == 0) {
                /* while you find 1 x%this.gridSize==0 
                => delta will equal this.gridSize => shorter loop */
                delta = this.gridSize;
                line(x, topMap, x, bottomMap);
            }
        }

        // do the same thing to y axis
        delta = 1;
        for (let y = topMap; y < bottomMap; y += delta) {
            if (floor(y) % this.gridSize == 0) {
                delta = this.gridSize;
                line(leftMap, y, rightMap, y);
            }
        }
    }

    getBound() {
        return {
            top: 0,
            bottom: this.height,
            left: 0,
            right: this.width,
        };
    }
}
