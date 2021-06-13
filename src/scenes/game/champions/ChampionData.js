const ChampionData = {
    Default: {
        radius: 35,
        speed: 3,
        Q: "AhriQ",
    },
    Ahri: {
        extends: "Default",
        model: "asset/image/champion/ahri/Ahri.avatar.circle.png",
        Q: "AhriQ",
    },
    Jinx: {
        extends: "Default",
        model: "asset/image/champion/jinx/Jinx.avatar.circle.png",
    },
};

Object.freeze(ChampionData);

export function getChampionData(_data) {
    if (_data.extends !== undefined) {
        return {
            ...ChampionData[_data.extends],
            ..._data,
        };
    }

    return {
        ..._data,
    };
}

export default ChampionData;
