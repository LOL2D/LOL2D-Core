function preventRightClick() {
    document.getElementsByTagName("canvas")[0].addEventListener(
        "contextmenu",
        function (evt) {
            evt.preventDefault();
        },
        false
    );
}
