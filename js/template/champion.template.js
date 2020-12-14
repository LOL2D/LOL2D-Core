/* 
    ------- quy ước đặt tên class -------
    Đặt tên class theo tên tướng muốn tạo
    Bỏ đi các ký tự đặc biệt trong tên như dấu & " ' hoặc ký tự khoảng trắng
    Danh sách tướng <https://leagueoflegends.fandom.com/wiki/List_of_champions>

    Ví dụ: DrMundo, Nunu, RekSai, VelKoz, MasterYi, LeeSin, KogMaw, KhaZik, KaiSa, ChoGath
*/

class ChampionName extends ChampionCore {
    constructor(config = {}) {
        super(config);

        // override
        // NOTE: be sure to add assetPaths to /asset/index.js first
        this.avatarCirclePath = "asset-key-here";

        this.abilities = {
            spell1: null, // new OrbOfDeception({ owner: this }),
            spell2: null,
            spell3: null,
            spell4: null,

            avatarSpell1: null,
            avatarSpell2: null,
        };

        // custom attributes
    }
}
