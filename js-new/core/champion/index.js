import { OrbOfDeception } from "../ability/index.js";

export default {
    Ahri: {
        name: "Ahri - Hồ Li Chín Đuôi",
        avatar: "asset/image/champion/ahri/Ahri.avatar.circle.png",
        radius: 40,
        health: 700,
        mana: 500,
        abitities: {
            basicAttack: null,
            q: OrbOfDeception,
            w: null,
            e: null,
            r: null,
        },
    },
};
