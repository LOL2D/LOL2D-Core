const OtherHelper = {
    setValueFromConfig(thisObject, config) {
        for (let c in config) {
            thisObject[c] = config[c];
        }
    },

    preventRightClick() {
        document.getElementsByTagName("canvas")[0].addEventListener(
            "contextmenu",
            function (evt) {
                evt.preventDefault();
            },
            false
        );
    },
};
