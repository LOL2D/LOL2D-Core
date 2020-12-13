const ColorHelper = {
    applyColorAlpha(colorCode, alpha) {
        let c = color(colorCode);
        c.setAlpha(alpha);
        return c;
    },
};
