let globalassets = {
    // cursor (do not need to loadImage)
    normalCursor: "asset/image/cursor/normal.cur",
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
