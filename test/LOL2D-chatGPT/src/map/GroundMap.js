export default class GroundMap {
    constructor({
        width = 1500,
        height = 1500,
        bgColor = "#555555",
        edgeColor = "#7779",
        edgeWeight = 3,
        showGrid = true,
        gridSize = 300,
        gridColor = "#5555",
        gridWeight = 3,
    } = {}) {
        this.width = width;
        this.height = height;
        this.bgColor = bgColor;
        this.edgeColor = edgeColor;
        this.edgeWeight = edgeWeight;
        this.showGrid = showGrid;
        this.gridSize = gridSize;
        this.gridColor = gridColor;
        this.gridWeight = gridWeight;
    }

    drawEdge(camera) {
        let { x, y, w, h } = camera.getViewport();

        x -= this.edgeWeight;
        y -= this.edgeWeight;
        w += this.edgeWeight * 2;
        h += this.edgeWeight * 2;

        let left = max(x, 0);
        let right = min(x + w, this.width);
        let top = max(y, 0);
        let bottom = min(y + h, this.height);

        stroke(this.edgeColor);
        strokeWeight(this.edgeWeight);
        noFill();

        rect(left, top, right - left, bottom - top);
    }

    drawGrid(camera) {
        let { x, y, w, h } = camera.getViewport();
        let leftScreen = x,
            rightScreen = x + w,
            topScreen = y,
            bottomScreen = y + h;

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
