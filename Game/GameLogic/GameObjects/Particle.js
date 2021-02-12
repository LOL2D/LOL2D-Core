import GameObject from "./GameObject.js";

export default class Particle extends GameObject {
    // Function Vars
    _currentTime;

    /// Object which spawned or caused the particle to be instanced
    Owner; //{ get; }

    /// Client-sided, internal name of the particle used in networking, usually always ends in .troy
    Name; //{ get; }

    /// GameObject this particle is currently attached to. Null when not attached to anything.
    TargetObject; //{ get; }

    /// Position this object is spawned at. *NOTE*: Does not update. Refer to TargetObject.GetPosition() if particle is supposed to be attached.
    TargetPosition; //{ get;  set; }

    /// Client-sided, internal name of the bone that this particle should be attached to for networking
    BoneName; //{ get; }

    /// Scale of the particle used in networking
    Scale; //{ get; }

    /// 3 dimensional forward vector (where the particle faces) used in networking
    Direction; //{ get; }

    /// Total game-time that this particle should exist for
    Lifetime; //{ get; }

    /// Whether or not the particle should be affected by vision,
    /// false = always visible,
    /// true = visibility can be obstructed
    VisionAffected; //{ get; }

    /// Prepares the Particle, setting up the information required for networking it to clients.
    /// This particle will spawn and stay on the specified GameObject target.
    /// <param name="game">Game instance.</param>
    /// <param name="owner">Owner of this Particle instance.</param>
    /// <param name="t">GameObject this particle should be attached to. Leave null if target is position.</param>
    /// <param name="particleName">Name used by League of Legends interally (ex: DebugCircle.troy).</param>
    /// <param name="scale">Scale of the Particle.</param>
    /// <param name="boneName">Name used by League of Legends internally where the Particle should be attached. Only useful when the target is a GameObject.</param>
    /// <param name="netId">NetID that should be forced onto the Particle. *NOTE*: Exceptions unhandled, expect crashes if NetID is already owned by a GameObject.</param>
    /// <param name="direction">3 dimensional vector representing the particle's orientation; unit vector forward.</param>
    /// <param name="lifetime">Number of seconds the Particle should exist.</param>
    /// <param name="reqVision">Whether or not the Particle is affected by vision checks.</param>
    /// <param name="autoSend">Whether or not to automatically send the Particle packet to clients.</param>
    // constructor(
    //     game,
    //     owner,
    //     t,
    //     particleName,
    //     scale = 1.0,
    //     boneName = "",
    //     netId = 0,
    //     direction = new Vector3(),
    //     lifetime = 0,
    //     reqVision = true,
    //     autoSend = true
    // ) {
    //     super(game, t.Position, 0, 0, netId);

    //     Owner = owner;
    //     TargetObject = t;
    //     TargetPosition = TargetObject.Position;
    //     Name = particleName;
    //     BoneName = boneName;
    //     Scale = scale;
    //     Direction = direction;
    //     Lifetime = lifetime;
    //     VisionAffected = reqVision;

    //     _game.ObjectManager.AddObject(this);

    //     if (autoSend) {
    //         _game.PacketNotifier.NotifyFXCreateGroup(this);
    //     }
    // }

    /// Prepares the Particle, setting up the information required for networking it to clients.
    /// This particle will spawn and stay as the specified position.
    /// <param name="game">Game instance.</param>
    /// <param name="owner">Owner of this Particle instance.</param>
    /// <param name="targetPos">Target position of this particle.</param>
    /// <param name="particleName">Name used by League of Legends interally (ex: DebugCircle.troy).</param>
    /// <param name="scale">Scale of the Particle.</param>
    /// <param name="boneName">Name used by League of Legends internally where the Particle should be attached. Only useful when the target is a GameObject.</param>
    /// <param name="netId">NetID that should be forced onto the Particle. *NOTE*: Exceptions unhandled, expect crashes if NetID is already owned by a GameObject.</param>
    /// <param name="direction">3 dimensional vector representing the particle's orientation; unit vector forward.</param>
    /// <param name="lifetime">Number of seconds the Particle should exist.</param>
    /// <param name="reqVision">Whether or not the Particle is affected by vision checks.</param>
    /// <param name="autoSend">Whether or not to automatically send the Particle packet to clients.</param>
    constructor(
        game,
        owner,
        targetPos,
        particleName,
        scale = 1.0,
        boneName = "",
        netId = 0,
        direction = new Vector3(),
        lifetime = 0,
        reqVision = true,
        autoSend = true
    ) {
        super(game, targetPos, 0, 0, netId);

        this.owner = owner;
        this.targetObject = null;
        this.targetPosition = targetPos;
        this.name = particleName;
        this.boneName = boneName;
        this.scale = scale;
        this.direction = direction;
        this.lifetime = lifetime;
        this.visionAffected = reqVision;

        this._game.objectManager.addObject(this);

        if (autoSend) {
            this._game.packetNotifier.notifyFXCreateGroup(this);
        }
    }

    /// Called by ObjectManager every tick.
    /// <param name="diff">Number of milliseconds since this tick occurred.</param>
    // override
    update(diff) {
        this._currentTime += diff / 1000.0;
        if (this._currentTime >= this.Lifetime && !this.isToRemove()) {
            this.setToRemove();
        }
    }

    /// Returns the total game-time passed since the particle was added to ObjectManager
    getTimeAlive() {
        return this._currentTime;
    }

    /// Actions that should be performed after the Particle is removed from ObjectManager.
    // override
    onRemoved() {
        super.onRemoved();
        this._game.packetNotifier.notifyFXKill(this);
    }
}
