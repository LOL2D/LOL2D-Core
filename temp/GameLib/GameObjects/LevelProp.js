import GameObject from "./GameObject.js";

export default class LevelProp extends GameObject {
    constructor(
        game,
        position,
        z,
        direction,
        unk1,
        unk2,
        name,
        model,
        skin = 0,
        netId = 0
    ) {
        super(game, position, 0, 0, netId);

        this.Height = z;
        this.Direction = direction;
        this.Unk1 = unk1;
        this.Unk2 = unk2;
        this.Name = name;
        this.Model = model;
        this.SkinId = skin;
    }
}
