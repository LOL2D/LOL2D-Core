const assetPaths = [
    // hud
    "asset/image/hud/ability.png",
    "asset/image/hud/item.png",
    "asset/image/hud/avatar.png",

    // spell
    "asset/image/spell/Flash.png",

    // ahri
    "asset/image/champion/ahri/Ahri.avatar.circle.png",
    "asset/image/champion/ahri/Ahri.avatar.square.png",
    "asset/image/champion/ahri/Charm.ability.png",
    "asset/image/champion/ahri/Fox-Fire.ability.png",
    "asset/image/champion/ahri/Orb-of-Deception.ability.png",
    "asset/image/champion/ahri/Spirit-Rush.ability.png",

    // jinx
];

let GlobalAssets = {
    // cursor (do not need to loadImage)
    cursor: {
        normal: "asset/image/cursor/normal.cur",
        fight: "asset/image/cursor/alt.cur",
        ally: "asset/image/cursor/link.cur",
        enemy: "asset/image/cursor/unavailable.cur",
    },
};

function loadAssets(callback) {
    let i = 0;

    for (let path of assetPaths) {
        loadImage(path, (data) => {
            GlobalAssets[path] = data;

            i++;
            if (i == assetPaths.length) {
                callback && callback();
            }
        });
    }
}

function loadMap(mapName, callback) {
    let path = "asset/map/" + mapName + ".json";
    loadJSON(path, (json) => {
        GlobalAssets[mapName] = json;
        callback && callback(json);
    });
}

export { GlobalAssets, loadAssets, loadMap };
export default GlobalAssets;
