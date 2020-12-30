const GlobalTime = {
    now: 0,
    updateTime() {
        this.now = millis();
    },
    getNow() {
        return this.now;
    },
};

export default GlobalTime;
