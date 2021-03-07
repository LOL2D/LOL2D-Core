const ColorHelper = {
    applyColorAlpha(colorCode, alpha) {
        let c = color(colorCode);
        c.setAlpha(alpha);
        return c;
    },

    createLinearGradient(canvas, x, y, w, colorStops) {
        let g = canvas.drawingContext.createLinearGradient(x, y, x + w, y);
        for (let i = 0; i < colorStops.length; i++) {
            g.addColorStop(colorStops[i].stop, colorStops[i].color);
        }
        canvas.drawingContext.fillStyle = g;
    },

    createRadialGradient(canvas, x, y, r1, r2, colorStops) {
        let g = canvas.drawingContext.createRadialGradient(x, y, r1, x, y, r2);
        for (let i = 0; i < colorStops.length; i++) {
            g.addColorStop(colorStops[i].stop, colorStops[i].color);
        }
        canvas.drawingContext.fillStyle = g;
    },
};

export default ColorHelper;
