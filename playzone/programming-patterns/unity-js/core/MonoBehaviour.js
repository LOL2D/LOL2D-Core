// https://docs.unity3d.com/Manual/ExecutionOrder.html
// https://docs.unity3d.com/ScriptReference/MonoBehaviour.html

import Behaviour from "./Behaviour.js";

export default class MonoBehaviour extends Behaviour {
    constructor(gameObject) {
        super(gameObject);

        this.awake();
        this.start();
    }

    runLifeCycle() {
        // ---------------- Physics ----------------
        this.fixedUpdate();

        // -- State machine update
        // -- OnStateMachineEnter/Exit
        // -- ProcessGraph
        // -- Fire animation events
        // -- StateMachineBehaviour callbacks
        // -- OnAnimatorMove

        // -- Internal physics update

        // -- ProcessAnimation
        // -- OnAnimatorIK
        // -- WriteTransform
        // -- WriteProperties

        // -- OnTriggerXXX
        // -- OnCollisionXXX
        // -- yield WaitForFixedUpdate

        // ---------------- Input events ----------------
        // -- OnMouseXXX

        // ---------------- Game logic ----------------
        // -- Update
        // -- yield null
        // -- yield WaitForSeconds
        // -- yield WWW
        // -- yield StartCoroutine

        // -- State machine update
        // -- OnStateMachineEnter/Exit
        // -- ProcessGraph
        // -- Fire animation events
        // -- StateMachineBehaviour callbacks
        // -- OnAnimatorMove
        // -- ProcessAnimation
        // -- OnAnimatorIK
        // -- WriteTransform
        // -- WriteProperties

        // -- LateUpdate

        // ---------------- Scene rendering ----------------
        // -- OnWillRenderObject
        // -- OnPreCull
        // -- OnBecameInvisible
        // -- OnBecameVisible
        // -- OnPreRender
        // -- OnRenderObject
        // -- OnPostRender
        // -- OnRenderImage

        // ---------------- End of frame ----------------
        // -- yield WaitForEndOfFrame

        // ---------------- Pausing ----------------
        // -- OnApplicationPause

        // ---------------- Decommissioning ----------------
        // -- OnApplicationQuit
        // -- OnDisable
        // -- OnDestroy
    }

    // ---------------- Unity methods ----------------
    awake() {} //Awake is called when the script instance is being loaded.
    start() {} //Start is called on the frame when a script is enabled just before any of the Update methods are called the first time.
    update() {} //Update is called every frame, if the MonoBehaviour is enabled.
    fixedUpdate() {} //Frame-rate independent MonoBehaviour.FixedUpdate message for physics calculations.
    lateUpdate() {} //LateUpdate is called every frame, if the Behaviour is enabled.
    reset() {} //Reset to default values.

    cancelInvoke() {} //Cancels all Invoke calls on this MonoBehaviour.
    invoke() {} //Invokes the method methodName in time seconds.
    invokeRepeating() {} //Invokes the method methodName in time seconds, then repeatedly every repeatRate seconds.
    isInvoking() {} //Is any invoke on methodName pending?
    startCoroutine() {} //Starts a Coroutine.
    stopAllCoroutines() {} //Stops all coroutines running on this behaviour.
    stopCoroutine() {} //Stops the first coroutine named methodName, or the coroutine stored in routine running on this behaviour.

    onAnimatorIK() {} //Callback for setting up animation IK (inverse kinematics).
    onAnimatorMove() {} //Callback for processing animation movements for modifying root motion.
    onApplicationFocus() {} //Sent to all GameObjects when the player gets or loses focus.
    onApplicationPause() {} //Sent to all GameObjects when the application pauses.
    onApplicationQuit() {} //Sent to all GameObjects before the application quits.
    onAudioFilterRead() {} //If OnAudioFilterRead is implemented, Unity will insert a custom filter into the audio DSP chain.
    onBecameInvisible() {} //OnBecameInvisible is called when the renderer is no longer visible by any camera.
    onBecameVisible() {} //OnBecameVisible is called when the renderer became visible by any camera.
    onCollisionEnter() {} //OnCollisionEnter is called when this collider/rigidbody has begun touching another rigidbody/collider.
    onCollisionEnter2D() {} //Sent when an incoming collider makes contact with this object's collider (2D physics only).
    onCollisionExit() {} //OnCollisionExit is called when this collider/rigidbody has stopped touching another rigidbody/collider.
    onCollisionExit2D() {} //Sent when a collider on another object stops touching this object's collider (2D physics only).
    onCollisionStay() {} //:ref::OnCollisionStay is called once per frame for every collider/rigidbody that is touching rigidbody/collider.
    onCollisionStay2D() {} //Sent each frame where a collider on another object is touching this object's collider (2D physics only).
    onConnectedToServer() {} //Called on the client when you have successfully connected to a server.
    onControllerColliderHit() {} //OnControllerColliderHit is called when the controller hits a collider while performing a Move.
    onDestroy() {} //Destroying the attached Behaviour will result in the game or Scene receiving OnDestroy.
    onDisable() {} //This function is called when the behaviour becomes disabled.
    onDisconnectedFromServer() {} //Called on the client when the connection was lost or you disconnected from the server.
    onDrawGizmos() {} //Implement OnDrawGizmos if you want to draw gizmos that are also pickable and always drawn.
    onDrawGizmosSelected() {} //Implement OnDrawGizmosSelected to draw a gizmo if the object is selected.
    onEnable() {} //This function is called when the object becomes enabled and active.
    onFailedToConnect() {} //Called on the client when a connection attempt fails for some reason.
    onFailedToConnectToMasterServer() {} //Called on clients or servers when there is a problem connecting to the MasterServer.
    onGUI() {} //OnGUI is called for rendering and handling GUI events.
    onJointBreak() {} //Called when a joint attached to the same game object broke.
    onJointBreak2D() {} //Called when a Joint2D attached to the same game object breaks.
    onMasterServerEvent() {} //Called on clients or servers when reporting events from the MasterServer.
    onMouseDown() {} //OnMouseDown is called when the user has pressed the mouse button while over the Collider.
    onMouseDrag() {} //OnMouseDrag is called when the user has clicked on a Collider and is still holding down the mouse.
    onMouseEnter() {} //Called when the mouse enters the Collider.
    onMouseExit() {} //Called when the mouse is not any longer over the Collider.
    onMouseOver() {} //Called every frame while the mouse is over the Collider.
    onMouseUp() {} //OnMouseUp is called when the user has released the mouse button.
    onMouseUpAsButton() {} //OnMouseUpAsButton is only called when the mouse is released over the same Collider as it was pressed.
    onNetworkInstantiate() {} //Called on objects which have been network instantiated with Network.Instantiate.
    onParticleCollision() {} //OnParticleCollision is called when a particle hits a Collider.
    onParticleSystemStopped() {} //OnParticleSystemStopped is called when all particles in the system have died, and no new particles will be born. New particles cease to be created either after Stop is called, or when the duration property of a non-looping system has been exceeded.
    onParticleTrigger() {} //OnParticleTrigger is called when any particles in a Particle System meet the conditions in the trigger module.
    onParticleUpdateJobScheduled() {} //OnParticleUpdateJobScheduled is called when a Particle System's built-in update job has been scheduled.
    onPlayerConnected() {} //Called on the server whenever a new player has successfully connected.
    onPlayerDisconnected() {} //Called on the server whenever a player disconnected from the server.
    onPostRender() {} //Event function that Unity calls after a Camera renders the scene.
    onPreCull() {} //Event function that Unity calls before a Camera culls the scene.
    onPreRender() {} //Event function that Unity calls before a Camera renders the scene.
    onRenderImage() {} //Event function that Unity calls after a Camera has finished rendering, that allows you to modify the Camera's final image.
    onRenderObject() {} //OnRenderObject is called after camera has rendered the Scene.
    onSerializeNetworkView() {} //Used to customize synchronization of variables in a script watched by a network view.
    onServerInitialized() {} //Called on the server whenever a Network.InitializeServer was invoked and has completed.
    onTransformChildrenChanged() {} //This function is called when the list of children of the transform of the GameObject has changed.
    onTransformParentChanged() {} //This function is called when the parent property of the transform of the GameObject has changed.
    onTriggerEnter() {} //When a GameObject collides with another GameObject, Unity calls OnTriggerEnter.
    onTriggerEnter2D() {} //Sent when another object enters a trigger collider attached to this object (2D physics only).
    onTriggerExit() {} //OnTriggerExit is called when the Collider other has stopped touching the trigger.
    onTriggerExit2D() {} //Sent when another object leaves a trigger collider attached to this object (2D physics only).
    onTriggerStay() {} //OnTriggerStay is called once per physics update for every Collider other that is touching the trigger.
    onTriggerStay2D() {} //Sent each frame where another object is within a trigger collider attached to this object (2D physics only).
    onValidate() {} //This function is called when the script is loaded or a value is changed in the Inspector (Called in the editor only).
    onWillRenderObject() {} //OnWillRenderObject is called for each camera if the object is visible and not a UI element.
}
