let globalassets = {
    // cursor (do not need to loadImage)
    cursor: {
        normal: "asset/image/cursor/normal.cur",
        fight: "asset/image/cursor/alt.cur",
        ally: "asset/image/cursor/link.cur",
        enemy: "asset/image/cursor/unavailable.cur",
    },
    terrainMap: null,
};

const assetPaths = [
    // ahri
    "asset/image/champion/ahri/Ahri.avatar.circle.png",
    "asset/image/champion/ahri/Ahri.avatar.square.png",
    "asset/image/champion/ahri/Charm.ability.png",
    "asset/image/champion/ahri/Fox-Fire.ability.png",
    "asset/image/champion/ahri/Orb-of-Deception.ability.png",
    "asset/image/champion/ahri/Spirit-Rush.ability.png",

    // jinx
];

function loadAssets() {
    for (let path of assetPaths) {
        globalassets[path] = loadImage(path);
    }
}

function loadMap(mapName) {
    let path = "asset/map/" + mapName + ".json";
    globalassets[mapName] = loadJSON(path);
}
