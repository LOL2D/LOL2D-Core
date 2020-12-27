// docs http://www.jeffreythompson.org/collision-detection/table_of_contents.php
// TIPS https://gamedev.stackexchange.com/questions/22765/how-do-i-check-collision-when-firing-bullet

const CollideHelper = {
    // http://www.jeffreythompson.org/collision-detection/point-point.php
    pointPoint(x1, y1, x2, y2, buffer = 0) {
        return sqr(x1 - x2) <= buffer && sqr(y1 == y2) <= buffer;
    },

    // http://www.jeffreythompson.org/collision-detection/point-circle.php
    pointCircle(px, py, cx, cy, r) {
        let distX = px - cx;
        let distY = py - cy;
        let distance = sqrt(distX * distX + distY * distY);
        return distance <= r;
    },

    // http://www.jeffreythompson.org/collision-detection/circle-circle.php
    circleCircle(c1x, c1y, c1r, c2x, c2y, c2r) {
        let distX = c1x - c2x;
        let distY = c1y - c2y;
        let distance = sqrt(distX * distX + distY * distY);
        return distance <= c1r + c2r;
    },

    // http://www.jeffreythompson.org/collision-detection/point-rect.php
    pointRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    },

    // http://www.jeffreythompson.org/collision-detection/rect-rect.php
    rectRect(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
        return (
            r1x + r1w >= r2x &&
            r1x <= r2x + r2w &&
            r1y + r1h >= r2y &&
            r1y <= r2y + r2h
        );
    },

    // http://www.jeffreythompson.org/collision-detection/circle-rect.php
    circleRect(cx, cy, radius, rx, ry, rw, rh) {
        let testX = cx;
        let testY = cy;
        if (cx < rx) testX = rx;
        else if (cx > rx + rw) testX = rx + rw;
        if (cy < ry) testY = ry;
        else if (cy > ry + rh) testY = ry + rh;
        let distX = cx - testX;
        let distY = cy - testY;
        let distance = sqrt(distX * distX + distY * distY);
        return distance <= radius;
    },

    // http://www.jeffreythompson.org/collision-detection/line-point.php
    linePoint(x1, y1, x2, y2, px, py, buffer = 0.1) {
        let d1 = dist(px, py, x1, y1);
        let d2 = dist(px, py, x2, y2);
        let lineLen = dist(x1, y1, x2, y2);
        return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
    },

    // http://www.jeffreythompson.org/collision-detection/line-circle.php
    lineCircle(x1, y1, x2, y2, cx, cy, r) {
        let inside1 = this.pointCircle(x1, y1, cx, cy, r);
        let inside2 = this.pointCircle(x2, y2, cx, cy, r);
        if (inside1 || inside2) return true;
        let distX = x1 - x2;
        let distY = y1 - y2;
        let len = sqrt(distX * distX + distY * distY);
        let dot = ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / pow(len, 2);
        let closestX = x1 + dot * (x2 - x1);
        let closestY = y1 + dot * (y2 - y1);
        let onSegment = this.linePoint(x1, y1, x2, y2, closestX, closestY);
        if (!onSegment) return false;
        distX = closestX - cx;
        distY = closestY - cy;
        let distance = sqrt(distX * distX + distY * distY);
        return distance <= r;
    },

    // http://www.jeffreythompson.org/collision-detection/line-line.php
    lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        let uA =
            ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) /
            ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        let uB =
            ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) /
            ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
        return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
    },

    // http://www.jeffreythompson.org/collision-detection/line-rect.php
    lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {
        return (
            this.lineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh) ||
            this.lineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh) ||
            this.lineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry) ||
            this.lineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh)
        );
    },

    // http://www.jeffreythompson.org/collision-detection/poly-point.php
    polyPoint(vertices, px, py) {
        let collision = false;
        let next = 0;
        for (let current = 0; current < vertices.length; current++) {
            next = current + 1;
            if (next == vertices.length) next = 0;
            let vc = vertices[current];
            let vn = vertices[next];
            if (
                ((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
                px < ((vn.x - vc.x) * (py - vc.y)) / (vn.y - vc.y) + vc.x
            ) {
                collision = !collision;
            }
        }
        return collision;
    },

    // http://www.jeffreythompson.org/collision-detection/poly-circle.php
    polyCircle(vertices, cx, cy, r) {
        let next = 0;
        for (let current = 0; current < vertices.length; current++) {
            next = current + 1;
            if (next == vertices.length) next = 0;
            let vc = vertices[current];
            let vn = vertices[next];
            if (this.lineCircle(vc.x, vc.y, vn.x, vn.y, cx, cy, r)) return true;
        }
        return this.polyPoint(vertices, cx, cy);
    },

    // http://www.jeffreythompson.org/collision-detection/poly-rect.php
    polyRect(vertices, rx, ry, rw, rh, isCheckInside = false) {
        let next = 0;
        for (let current = 0; current < vertices.length; current++) {
            next = current + 1;
            if (next == vertices.length) next = 0;
            let vc = vertices[current];
            let vn = vertices[next];
            if (this.lineRect(vc.x, vc.y, vn.x, vn.y, rx, ry, rw, rh)) {
                return isCheckInside ? this.polyPoint(vertices, rx, ry) : true;
            }
        }

        return false;
    },

    // http://www.jeffreythompson.org/collision-detection/poly-line.php
    polyLine(vertices, x1, y1, x2, y2) {
        let next = 0;
        for (let current = 0; current < vertices.length; current++) {
            next = current + 1;
            if (next == vertices.length) next = 0;
            let x3 = vertices[current].x;
            let y3 = vertices[current].y;
            let x4 = vertices[next].x;
            let y4 = vertices[next].y;
            if (this.lineLine(x1, y1, x2, y2, x3, y3, x4, y4)) {
                return true;
            }
        }

        // never got a hit
        return false;
    },

    // http://www.jeffreythompson.org/collision-detection/poly-poly.php
    polyPoly(poly1, poly2) {
        let next = 0;
        for (let current = 0; current < poly1.length; current++) {
            next = current + 1;
            if (next == poly1.length) next = 0;
            let vc = poly1[current];
            let vn = poly1[next];
            if (this.polyLine(poly2, vc.x, vc.y, vn.x, vn.y)) return true;
            if (this.polyPoint(poly1, poly2[0].x, poly2[0].y)) return true;
        }

        return false;
    },

    // http://www.jeffreythompson.org/collision-detection/tri-point.php
    triPoint(x1, y1, x2, y2, x3, y3, px, py) {
        let areaOrig = abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
        let area1 = abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py));
        let area2 = abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py));
        let area3 = abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py));
        return area1 + area2 + area3 == areaOrig;
    },
};

export default CollideHelper;
