// https://keycode.info/
const SHIFT = 16;
const CTRL = 17;
const ALT = 18;
const ENTER = 13;
const TAB = 9;
const ESCAPE = 27;

const DEFAULT_HOTKEYS = {
    // -------- primary --------
    // chiêu thức
    CastSpell1: 81, // Q
    CastSpell2: 87, // W
    CastSpell3: 69, // E
    CastSpell4: 82, // R

    /* 
    NOTE: phần này không dùng trên trình duyệt được
        có nhiều combine hotkeys bị trùng với những chức năng có sẵn của trình duyệt
    */
    // // nâng cấp chiêu thức
    // LevelSpell1: [CTRL, 81], // Ctrl Q
    // LevelSpell2: [CTRL, 87], // Ctrl W
    // LevelSpell3: [CTRL, 69], // Ctrl E
    // LevelSpell4: [CTRL, 82], // Ctrl R

    // // sử dụng chiêu thức lên bản thân
    // SelfCastSpell1: [ALT, 81], // Alt Q
    // SelfCastSpell2: [ALT, 87], // Alt W
    // SelfCastSpell3: [ALT, 69], // Alt E
    // SelfCastSpell4: [ALT, 82], // Alt R

    // phép bổ trợ
    CastAvatarSpell1: 70, // D
    CastAvatarSpell2: 71, // F

    // sử dụng trang bị có kích hoạt
    UseItem1: 49, // 1
    UseItem2: 50, // 2
    UseItem3: 51, // 3
    UseVisionItem: 52, // 4
    UseItem5: 53, // 5
    UseItem6: 54, // 6
    UseItem7: 56, // 7

    // -------- additional --------
    Recall: 66, // B
    ToogleLockCam: 89, // Y
    ToogleShop: 80, // P
    CreateChatCursor: ENTER, // Enter
};
