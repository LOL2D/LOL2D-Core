const DistanceHelper = {
    /* 
        parameters: {
            rootPosition: ,
            champions: array of champions,
            inRange: range to check,
            addChampRadiusToRange: true / false,
            allyWithPlayer: true / false / null(get all),
            excludes: array of champions want to exclude,
        }
    */
    getClosestChampionInRange(config = {}) {
        const enemiesInRange = this.getChampionsInRange(config);
        return this.getClosestChampion(config.rootPosition, enemiesInRange);
    },

    getChampionsInRange(config = {}) {
        const {
            rootPosition,
            champions = [],
            inRange = Infinity,
            addChampRadiusToRange = false,
            allyWithPlayer = null,
            excludes = [],
        } = config;

        let champsInRange = [];

        for (let champ of champions) {
            if (allyWithPlayer != null) {
                if (champ.isAllyWithPlayer != allyWithPlayer) continue;
            }

            if (excludes.indexOf(champ) >= 0) continue;

            let distance = p5.Vector.dist(rootPosition, champ.position);
            let range = addChampRadiusToRange
                ? inRange + champ.radius
                : inRange;

            if (distance < range) {
                champsInRange.push(champ);
            }
        }

        return champsInRange;
    },

    getClosestChampion(rootPosition, champions) {
        let closestChamp = null;
        let closestDistance = Infinity;

        for (let champ of champions) {
            let distance = p5.Vector.dist(champ.position, rootPosition);
            if (distance < closestDistance) {
                closestChamp = champ;
                closestDistance = distance;
            }
        }

        return closestChamp;
    },
};
