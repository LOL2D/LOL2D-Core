const CollideHelper = {
    collidePointCircle(px, py, cx, cy, cr) {
        return dist(px, py, cx, cy) <= cr;
    },
};
