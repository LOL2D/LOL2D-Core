const AssetPaths = [
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
    "asset/image/champion/jinx/Jinx.avatar.circle.png",
];

export default class AssetManager {
    static _asset = {};

    static getAsset(path) {
        return this._asset[path];
    }

    static loadAssets(onProgress, onSuccess, onFailed) {
        let loadedCount = 0;
        let hasError = false;

        for (let path of AssetPaths) {
            loadImage(
                path,
                // success
                (data) => {
                    this._asset[path] = data;
                    loadedCount++;

                    onProgress &&
                        onProgress({
                            index: loadedCount,
                            total: AssetPaths.length,
                            path: path,
                        });

                    if (loadedCount == AssetPaths.length && !hasError) {
                        onSuccess && onSuccess();
                    }
                },
                // failed
                (error) => {
                    hasError = true;
                    onFailed && onFailed(error);
                }
            );
        }
    }
}
