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

            // blitzcrank
            "https://static.wikia.nocookie.net/leagueoflegends/images/0/04/Blitzcrank_Mana_Barrier.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/a/ac/Blitzcrank_Rocket_Grab.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/e/e9/Blitzcrank_Overdrive.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/5/59/Blitzcrank_Power_Fist.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/7/7e/Blitzcrank_Static_Field.png",

            // brand
            "https://static.wikia.nocookie.net/leagueoflegends/images/a/aa/Brand_Blaze.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/6/6f/Brand_Blaze_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/43/Brand_Sear.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/4c/Brand_Pillar_of_Flame.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/b/b7/Brand_Conflagration.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/a/a3/Brand_Pyroclasm.png",

            // caitlyn
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/33/Caitlyn_Headshot.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/6/69/Headshot_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/b/b8/Caitlyn_Piltover_Peacemaker.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/1/12/Caitlyn_Yordle_Snap_Trap.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/e/e0/Caitlyn_90_Caliber_Net.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/c/c4/Caitlyn_Ace_in_the_Hole.png",

            // ezreal
            "https://static.wikia.nocookie.net/leagueoflegends/images/d/dc/Ezreal_Rising_Spell_Force.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/3e/Ezreal_Mystic_Shot.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/f/f6/Ezreal_Essence_Flux.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/d/da/Ezreal_Arcane_Shift.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/6/68/Ezreal_Trueshot_Barrage.png",

            // heimerdinger
            "https://static.wikia.nocookie.net/leagueoflegends/images/0/03/Heimerdinger_Hextech_Affinity.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/41/Heimerdinger_H-28G_Evolution_Turret.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/f/f0/Heimerdinger_H-28Q_Apex_Turret.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/8/8b/Heimerdinger_Hextech_Micro-Rockets.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/9/95/Heimerdinger_Hextech_Rocket_Swarm.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/6/67/Heimerdinger_CH-2_Electron_Storm_Grenade.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/b/b2/Heimerdinger_CH-3X_Lightning_Grenade.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/1/19/Heimerdinger_UPGRADE%21%21%21.png",

            // leblanc
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/4e/LeBlanc_Mirror_Image.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/9/93/LeBlanc_Sigil_of_Malice.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/0/05/LeBlanc_Distortion.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/9/9a/LeBlanc_Distortion_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/b/bd/LeBlanc_Ethereal_Chains.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/9/9b/LeBlanc_Mimic.png",

            // lux
            "https://static.wikia.nocookie.net/leagueoflegends/images/1/12/Lux_Illumination.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/5/54/Lux_Light_Binding.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/5/55/Lux_Prismatic_Barrier.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/a/a6/Lux_Lucent_Singularity.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/f/f1/Lux_Final_Spark.png",

            // morgana
            "https://static.wikia.nocookie.net/leagueoflegends/images/7/71/Morgana_Soul_Siphon.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/3b/Morgana_Dark_Binding.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/8/8f/Morgana_Tormented_Shadow.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/4/4c/Morgana_Black_Shield.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/6/61/Morgana_Soul_Shackles.png",

            // pyke
            "https://static.wikia.nocookie.net/leagueoflegends/images/b/b0/Pyke_Gift_of_the_Drowned_Ones.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/e/e0/Pyke_Bone_Skewer.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/0/02/Pyke_Ghostwater_Dive.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/1/1f/Pyke_Phantom_Undertow.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/1/19/Pyke_Death_from_Below.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/d/d8/Death_from_Below_2.png",

            // shaco
            "https://static.wikia.nocookie.net/leagueoflegends/images/7/7e/Shaco_Backstab.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/32/Shaco_Deceive.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/7/73/Shaco_Jack_in_the_Box.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/2/26/Shaco_Two-Shiv_Poison.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/6/65/Shaco_Hallucinate.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/d/d7/Shaco_Command-_Hallucinate.png",

            // thresh
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/34/Thresh_Damnation.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/38/Thresh_Death_Sentence.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/a/a7/Thresh_Deathly_Leap.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/f/f5/Thresh_Dark_Passage.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/d/d3/Thresh_Flay.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/f/fa/Thresh_The_Box.png",

            // yasuo
            "https://static.wikia.nocookie.net/leagueoflegends/images/2/2a/Yasuo_Way_of_the_Wanderer.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/0/09/Yasuo_Steel_Tempest.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/e/eb/Yasuo_Steel_Tempest_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/5/59/Yasuo_Steel_Tempest_3.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/2/2c/Yasuo_Wind_Wall.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/c/c9/Yasuo_Sweeping_Blade.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/f/f0/Yasuo_Last_Breath.png",

            // yone
            "https://static.wikia.nocookie.net/leagueoflegends/images/5/52/Yone_Way_of_the_Hunter.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/2/28/Yone_Mortal_Steel.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/0/05/Yone_Mortal_Steel_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/f/fc/Yone_Spirit_Cleave.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/3/3e/Yone_Soul_Unbound.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/1/10/Yone_Soul_Unbound_2.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/c/c7/Yone_Fate_Sealed.png",

            // lee sin
            "https://static.wikia.nocookie.net/leagueoflegends/images/f/f0/Lee_Sin_Flurry.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/b/b7/Lee_Sin_Sonic_Wave.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/2/29/Lee_Sin_Resonating_Strike.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/b/b7/Lee_Sin_Safeguard.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/e/e6/Lee_Sin_Iron_Will.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/1/19/Lee_Sin_Tempest.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/c/c5/Lee_Sin_Cripple.png",
            "https://static.wikia.nocookie.net/leagueoflegends/images/1/1a/Lee_Sin_Dragon%27s_Rage.png",
        ];

        for (let spell of spells) {
            let s = document.createElement("div");
            s.classList = "spell";

            let {
                name = "?",
                image = spell,
                title = "?",
                description = "?",
            } = spell;

            s.innerHTML = `
                <img src="${image}" alt="">
                <p class="spell-name">${name}</p>
            `;
            s.addEventListener("mouseover", () => {
                let spellInfo = document.querySelector(".spell-info");
                spellInfo.innerHTML = `
                    <div class="spell-info-header">
                        <img src="${image}" alt="">
                        <div>
                            <p class="spell-title">${title}</p>
                            <p class="spell-name">(${name})</p>
                        </div>
                    </div>
                    <p class="spell-description">${description}</p>
                `;
            });

            spellsContainer.appendChild(s);
        }
    }

    exit() {}
}
