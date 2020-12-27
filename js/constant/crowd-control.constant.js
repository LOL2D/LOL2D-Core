// crowd control https://leagueoflegends.fandom.com/wiki/Types_of_Crowd_Control

const ALLOWED = 1;
const DISABLED = 2;
const UNCONTROLLABLE = 3;
const PARTIAL = 4;
const REDUCED = 5;
const YES = 6;
const NO = 7;
const SEENOTE = 8;

const ListCrowdControls = {
    Airborne: {
        // hất tung
        movement: DISABLED,
        attacking: DISABLED,
        abilities: DISABLED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Blind: {
        // mù
        movement: ALLOWED,
        attacking: PARTIAL,
        abilities: ALLOWED,
        interruptsChannels: NO,
        disabledSummonerSpells: [],
        removal: [],
    },
    Cripple: {
        // tàn tật (giảm tốc đánh)
        movement: ALLOWED,
        attacking: REDUCED,
        abilities: ALLOWED,
        interruptsChannels: NO,
        disabledSummonerSpells: [],
        removal: [],
    },
    Disarm: {
        // giải giới (không thể đánh thường)
        movement: ALLOWED,
        attacking: DISABLED,
        abilities: ALLOWED,
        interruptsChannels: NO,
        disabledSummonerSpells: [],
        removal: [],
    },
    Disrupt: {
        // gián đoạn (hủy kỹ năng nếu đang niệm)
        movement: ALLOWED,
        attacking: ALLOWED,
        abilities: ALLOWED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Drowsy: {
        // buồn ngủ (chậm dần, rồi rơi vào trạng thái sleep)
        movement: REDUCED,
        attacking: ALLOWED,
        abilities: ALLOWED,
        interruptsChannels: NO,
        disabledSummonerSpells: [],
        removal: [],
    },
    Sleep: {
        // ngủ
        movement: DISABLED,
        attacking: DISABLED,
        abilities: DISABLED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Charm: {
        // mê hoặc
        movement: UNCONTROLLABLE,
        attacking: DISABLED,
        abilities: DISABLED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Flee: {
        // hoảng loạn
        movement: UNCONTROLLABLE,
        attacking: DISABLED,
        abilities: DISABLED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Taunt: {
        // khiêu khích
        movement: UNCONTROLLABLE,
        attacking: DISABLED,
        abilities: UNCONTROLLABLE,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Ground: {
        // sa lầy
        movement: PARTIAL,
        attacking: ALLOWED,
        abilities: PARTIAL,
        interruptsChannels: NO, // ?
        disabledSummonerSpells: [],
        removal: [],
    },
    Knockdown: {
        // ném xuống
        movement: DISABLED,
        attacking: DISABLED,
        abilities: DISABLED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Nearsight: {
        // giảm tầm nhìn
        movement: ALLOWED,
        attacking: PARTIAL,
        abilities: PARTIAL,
        interruptsChannels: NO,
        disabledSummonerSpells: [],
        removal: [],
    },
    Root: {
        // trói chân
        movement: DISABLED,
        attacking: ALLOWED,
        abilities: PARTIAL,
        interruptsChannels: NO,
        disabledSummonerSpells: [],
        removal: [],
    },
    Silence: {
        // câm lặng
        movement: ALLOWED,
        attacking: ALLOWED,
        abilities: DISABLED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Polymorph: {
        // hóa thú
        movement: DISABLED,
        attacking: DISABLED,
        abilities: DISABLED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Slow: {
        // làm chậm
        movement: REDUCED,
        attacking: ALLOWED,
        abilities: ALLOWED,
        interruptsChannels: NO,
        disabledSummonerSpells: [],
        removal: [],
    },
    Stasis: {
        // tĩnh lặng
        movement: DISABLED,
        attacking: DISABLED,
        abilities: DISABLED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Stun: {
        // choáng
        movement: DISABLED,
        attacking: DISABLED,
        abilities: DISABLED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Suspension: {
        // ngưng trệ (choáng + hất tung)
        movement: DISABLED,
        attacking: DISABLED,
        abilities: DISABLED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
    Suppression: {
        // áp chế
        movement: DISABLED,
        attacking: DISABLED,
        abilities: DISABLED,
        interruptsChannels: YES,
        disabledSummonerSpells: [],
        removal: [],
    },
};

export {
    ALLOWED,
    DISABLED,
    UNCONTROLLABLE,
    PARTIAL,
    REDUCED,
    YES,
    NO,
    SEENOTE,
    ListCrowdControls,
};
