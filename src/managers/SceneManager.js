// original source: Marian Veteanu - https://github.com/mveteanu/p5.SceneManager
// modified by Hoang Tran

const P5Events = [
    "mouseClicked",
    "mousePressed",
    "mouseReleased",
    "mouseMoved",
    "mouseDragged",
    "doubleClicked",
    "mouseWheel",
    "keyPressed",
    "keyReleased",
    "keyTyped",
    "touchStarted",
    "touchMoved",
    "touchEnded",
    "deviceMoved",
    "deviceTurned",
    "deviceShaken",
];

export class Scene {
    // inject sceneManager and p5_instant as a property of the scene
    constructor(sceneManager, p5) {
        /** @type SceneManager */
        this.sceneManager = sceneManager;
        this.p5 = p5;
    }

    /**
     * Được gọi khi scene được khởi tạo, chỉ gọi 1 lần.
     * Được dùng để khởi tạo các giá trị ban đầu cho scene
     */
    setup() {}

    /**
     * Được gọi khi scene được hiển thị (SceneManager.showScene).
     * Có thể được gọi nhiều lần, mỗi khi sceneManager chuyển tới scene này
     */
    enter() {}

    /**
     * Được gọi liên tục (max là 60 lần/s tương ứng 60fps).
     * Vòng lặp game sẽ được cho vào trong hàm này
     */
    draw() {}

    /**
     * Được gọi khi sceneManager đang từ scene này chuyển qua scene mới
     */
    exit() {}

    // p5 events
    mouseClicked() {}
    mousePressed() {}
    mouseReleased() {}
    mouseMoved() {}
    mouseDragged() {}
    doubleClicked() {}
    mouseWheel(e) {}
    keyPressed() {}
    keyReleased() {}
    keyTyped() {}
    touchStarted() {}
    touchMoved() {}
    touchEnded() {}
    deviceMoved() {}
    deviceTurned() {}
    deviceShaken() {}
}

export default class SceneManager {
    constructor(p5) {
        this.scenes = [];
        this.scene = null;
        this.p5 = p5;
    }

    // Wire relevant p5.js events, except setup()
    // If you don't call this method, you need to manually wire events
    wire() {
        let me = this;
        let p5 = this.p5 != null ? this.p5 : window;

        // Wire draw manually for speed reasons...
        p5.draw = function () {
            me.draw();
        };

        // This loop will wire automatically all P5 events to each scene like this:
        // p5.mouseClicked = function() { me.handleEvent("mouseClicked"); }
        for (let i = 0; i < P5Events.length; i++) {
            let sEvent = P5Events[i]; // let is necesary to set the scope at the level of for
            p5[sEvent] = function () {
                // https://github.com/mveteanu/p5.SceneManager/pull/8/commits
                me.handleEvent(sEvent, [].slice.call(arguments));
            };
        }

        return me;
    }

    // Add a scene to the collection
    // You need to add all the scenes if intend to call .showNextScene()
    addScene(fnScene) {
        let oScene = new fnScene(this, this.p5);

        // create scene container
        var o = {
            fnScene: fnScene,
            oScene: oScene,
            hasSetup: "setup" in oScene,
            hasEnter: "enter" in oScene,
            hasDraw: "draw" in oScene,
            hasExit: "exit" in oScene,
        };

        // trigger setup event on scene
        if (o.hasSetup) o.oScene.setup();

        // add scene container to array scenes
        this.scenes.push(o);
        return o;
    }

    // Return the index of a scene in the internal collection
    findSceneIndex(fnScene) {
        for (let i = 0; i < this.scenes.length; i++) {
            let o = this.scenes[i];
            if (o.fnScene == fnScene) return i;
        }

        return -1;
    }

    // Return a scene object wrapper
    findScene(fnScene) {
        let i = this.findSceneIndex(fnScene);
        return i >= 0 ? this.scenes[i] : null;
    }

    // Returns true if the current displayed scene is fnScene
    isCurrent(fnScene) {
        if (this.scene == null) return false;
        return this.scene.fnScene == fnScene;
    }

    // Show a scene based on the function name
    // Optionally you can send arguments to the scene
    // Arguments will be retrieved in the scene via .sceneArgs property
    showScene(fnScene, sceneArgs) {
        let o = this.findScene(fnScene);

        if (o == null) o = this.addScene(fnScene);

        // trigger exit event on current scene
        if (this.scene != null && this.scene.hasExit) this.scene.oScene.exit();

        // switch scene
        this.scene = o;

        // inject sceneArgs as a property of the scene
        o.oScene.sceneArgs = sceneArgs;

        // trigger enter event on new scene
        if (o.hasEnter) o.oScene.enter();
    }

    // Show the next scene in the collection
    // Useful if implementing demo applications
    // where you want to advance scenes automatically
    showNextScene(sceneArgs) {
        if (this.scenes.length == 0) return;

        let nextSceneIndex = 0;

        if (this.scene != null) {
            // search current scene...
            // can be optimized to avoid searching current scene...
            let i = this.findSceneIndex(this.scene.fnScene);
            nextSceneIndex = i < this.scenes.length - 1 ? i + 1 : 0;
        }

        let nextScene = this.scenes[nextSceneIndex];
        this.showScene(nextScene.fnScene, sceneArgs);
    }

    // This is the SceneManager .draw() method
    // This will dispatch the main draw() to the
    // current scene draw() method
    draw() {
        // take the current scene in a variable to protect it in case
        // it gets changed by the user code in the events such as setup()...
        let currScene = this.scene;
        if (currScene == null) return;

        if (currScene.hasDraw) currScene.oScene.draw();
    }

    // Handle a certain even for a scene...
    // It is used by the anonymous functions from the wire() function
    handleEvent(sEvent, args) {
        if (this.scene == null || this.scene.oScene == null) return;

        let fnSceneEvent = this.scene.oScene[sEvent];
        if (fnSceneEvent) fnSceneEvent.apply(this.scene.oScene, args);
    }

    // Legacy method... preserved for maintaining compatibility
    mousePressed() {
        this.handleEvent("mousePressed");
    }

    // Legacy method... preserved for maintaining compatibility
    keyPressed() {
        this.handleEvent("keyPressed");
    }
}
