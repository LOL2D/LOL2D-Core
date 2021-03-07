const FormatHelper = {
    addZero(n) {
        return n < 10 ? "0" + n : n;
    },
    abilityCountDown(cd) {
        if (cd < 1000) {
            return (cd / 1000).toFixed(1);
        }

        if (cd < 60000) {
            return (cd / 1000).toFixed(0);
        }

        let m = ~~(cd / 60000);
        let s = this.addZero(~~((cd / 1000) % 60));

        return `${m}:${s}`;
    },
};

export default FormatHelper;
