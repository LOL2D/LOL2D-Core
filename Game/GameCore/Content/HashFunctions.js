const HashString = function (path) {
    let hash = 0;
    let mask = 0xf0000000;
    for (let i = 0; i < path.length; i++) {
        hash = path[i].toLowerCase() + 0x10 * hash;
        if ((hash & mask) > 0) {
            hash ^= (hash & mask) ^ ((hash & mask) >> 24);
        }
    }

    return hash;
};

const HashStringSdbm = function (section, name) {
    return HashStringNorm(section + "*" + name);
};

const HashStringNorm = function (str) {
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
        hash = str[i].toLowerCase() + 65599 * hash;
    }

    return hash;
};

const HashFunctions = {
    HashString,
    HashStringSdbm,
    HashStringNorm,
};

export default HashFunctions;
