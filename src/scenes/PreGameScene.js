import { Scene } from "../managers/SceneManager.js";
import { preventRightClick } from "../utils/Helpers.js";
import GameScene from "./GameScene.js";

export default class PreGameScene extends Scene {
    setup() {
        this.preGameSceneDiv = document.querySelector("#pre-game-scene");
    }

    enter() {
        this.preGameSceneDiv.style.display = "block";
        // this.sceneManager.showScene(GameScene);

        let spellsContainer = document.querySelector(".spells-container");

        // https://leagueoflegends.fandom.com/wiki/List_of_champions
        let spells = [
            {
                title: "TỐC BIẾN",
                name: "Tốc biến",
                image: "https://static.wikia.nocookie.net/leagueoflegends/images/7/74/Flash.png",
                description:
                    "Đưa anh hùng của bạn đến vị trí con trỏ chỉ định.",
            },
            {
                name: "Ahri-Q",
                image: "https://static.wikia.nocookie.net/leagueoflegends/images/9/94/Ahri_Orb_of_Deception.png",
                title: "QUẢ CẦU MA THUẬT",
                description:
                    "Ahri phóng ra và thu lại quả cầu ma thuật của mình, gây sát thương phép trên đường phóng đi và sát thương chuẩn trên đường thu về.",
            },
            {
                name: "Ahri-W",
                image: "https://static.wikia.nocookie.net/leagueoflegends/images/c/cb/Ahri_Fox-Fire.png",
                title: "LỬA HỒ LY",
                description:
                    "Ahri nhận thêm Tốc độ Di chuyển và triệu hồi ra ba ngọn lửa hồ ly, tự động khóa mục tiêu và tấn công những kẻ địch ở gần.",
            },
            {
                name: "Ahri-E",
                image: "https://static.wikia.nocookie.net/leagueoflegends/images/1/17/Ahri_Charm.png",
                title: "HÔN GIÓ",
                description:
                    "Ahri hôn gió, gây sát thương và mê hoặc kẻ địch đầu tiên trúng chiêu, ngay lập tức ngắt quãng kỹ năng di chuyển và khiến chúng bước về phía cô một cách vô hại.",
            },
            {
                name: "Ahri-R",
                image: "https://static.wikia.nocookie.net/leagueoflegends/images/c/c5/Ahri_Spirit_Rush.png",
                title: "PHI HỒ",
                description:
                    "Ahri lướt đi và bắn ra những tia sét linh hồn, gây sát thương lên kẻ địch xung quanh. Phi Hồ có thể được sử dụng tối đa ba lần trước khi hồi chiêu, và nhận được thêm một lần tái sử dụng với mỗi mạng tham gia hạ gục tướng địch.",
            },
            // jinx
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/41/Jinx_Switcheroo%21.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/c/c3/Jinx_Zap%21.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/8/85/Jinx_Flame_Chompers%21.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/0/0b/Jinx_Flame_Chompers%21_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/3a/Jinx_Super_Mega_Death_Rocket%21.png",

            // aatrox
            "https://static.wikia.nocookie.net/leagueoflegends/images/c/cc/Aatrox_Deathbringer_Stance.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/a/a8/Aatrox_The_Darkin_Blade.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/5/59/Aatrox_The_Darkin_Blade_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/4f/Aatrox_The_Darkin_Blade_3.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/32/Aatrox_Infernal_Chains.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/2/2f/Aatrox_Umbral_Dash.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/7/72/Aatrox_World_Ender.png",

            // akali
            "https://static.wikia.nocookie.net/leagueoflegends/images/c/c0/Akali_Assassin%27s_Mark.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/b/b3/Akali_Five_Point_Strike.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/41/Akali_Twilight_Shroud.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/30/Akali_Shuriken_Flip.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/d/d1/Akali_Shuriken_Flip_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/34/Akali_Perfect_Execution.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/5/59/Akali_Perfect_Execution_2.png",

            // akshan
            "https://static.wikia.nocookie.net/leagueoflegends/images/d/dd/Akshan_Dirty_Fighting.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/44/Akshan_Avengerang.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/c/c6/Going_Rogue_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/e/e9/Akshan_Going_Rogue.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/6/69/Akshan_Heroic_Swing.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/4e/Akshan_Heroic_Swing_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/42/Akshan_Comeuppance.png",

            // alistar
            "https://static.wikia.nocookie.net/leagueoflegends/images/2/2d/Alistar_Triumphant_Roar.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/8/8b/Alistar_Pulverize.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/f/f6/Alistar_Headbutt.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/1/1c/Alistar_Trample.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/d/db/Trample_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/6/62/Alistar_Unbreakable_Will.png",

            // amumu
            "https://static.wikia.nocookie.net/leagueoflegends/images/5/51/Amumu_Cursed_Touch.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/40/Amumu_Bandage_Toss.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/e/e0/Amumu_Despair.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/2/2d/Amumu_Tantrum.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/a/af/Amumu_Curse_of_the_Sad_Mummy.png",

            // anivia
            "https://static.wikia.nocookie.net/leagueoflegends/images/7/79/Anivia_Rebirth.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/44/Anivia_Flash_Frost.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/f/fd/Anivia_Crystallize.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/e/e0/Anivia_Frostbite.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/35/Anivia_Glacial_Storm.png",

            // annie
            "https://static.wikia.nocookie.net/leagueoflegends/images/8/8d/Annie_Pyromania.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/b/bf/Annie_Disintegrate.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/e/ed/Annie_Incinerate.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/5/55/Annie_Molten_Shield.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/9/92/Annie_Summon-_Tibbers.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/2/23/Annie_Command-_Tibbers.png",
        ];

        for (let spell of spells) {
            let s = document.createElement("div");
            s.classList.add("spell");

            if (typeof spell == "string") {
                s.innerHTML = `
                    <img src="${spell}" alt="">
                    <p class="spell-name">?</p>
                `;
            } else {
                s.innerHTML = `
                    <img src="${spell.image}" alt="">
                    <p class="spell-name">${spell.name}</p>
                `;
                s.addEventListener("mouseover", () => {
                    let spellInfo = document.querySelector(".spell-info");
                    spellInfo.innerHTML = `
                    <div class="spell-info-header">
                        <img src="${spell.image}" alt="">
                        <div>
                            <p class="spell-title">${spell.title}</p>
                            <p class="spell-name">(${spell.name})</p>
                        </div>
                    </div>
                    <p class="spell-description">${spell.description}</p>
                `;
                });
            }
            spellsContainer.appendChild(s);
        }
    }

    exit() {}
}
