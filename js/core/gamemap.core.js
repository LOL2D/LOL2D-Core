class GameMapCore {
    constructor(config = {}) {
        // default value
        this.width = 2000;
        this.height = 2000;
        this.bgColor = "#555555";
        this.edgeColor = [200, 100];
        this.edgeWeight = 3;
        this.grid = true;
        this.gridSize = 300;
        this.gridColor = [130, 50];
        this.gridWeight = 3;

        Helper.Other.setValueFromConfig(this, config);
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
        let { x: leftScreen, y: topScreen } = camera.canvasToWorld(0, 0);
        let { x: rightScreen, y: bottomScreen } = camera.canvasToWorld(width, height);

        let leftMap = max(leftScreen - 50, 0);
        let rightMap = min(rightScreen + 50, this.width);
        let topMap = max(topScreen - 50, 0);
        let bottomMap = min(bottomScreen + 50, this.height);

        // fill bgcolor
        //fill(this.bgColor);
        //rect(leftMap, topMap, rightMap - leftMap, bottomMap - topMap);

        // draw grid
        stroke(this.gridColor);
        strokeWeight(this.gridWeight);

        let delta = 1;
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
