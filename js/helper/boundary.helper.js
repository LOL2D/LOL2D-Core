const BoundaryHelper = {
    polygon(polygon) {
        let left = Infinity;
        let bottom = -Infinity;
        let top = Infinity;
        let right = -Infinity;

        for (let p of polygon) {
            let pos = Array.isArray(p) ? { x: p[0], y: p[1] } : p;

            left = min(left, pos.x);
            right = max(right, pos.x);
            top = min(top, pos.y);
            bottom = max(bottom, pos.y);
        }

        return {
            x: left,
            y: top,
            w: right - left,
            h: bottom - top,
        };
    },
    cỉrcle(circle) {
        return {
            x: circle.x - circle.radius,
            y: circle.y - circle.radius,
            w: circle.radius,
            h: circle.radius,
        };
    },
};
