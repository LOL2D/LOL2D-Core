import LaneID from "../Enums/LaneID.js";
import TeamId from "../Enums/TeamID.js";
import Announces from "../Enums/Announces.js";
import TurretType from "../Enums/TurretType.js";
import MinionSpawnType from "../Enums/MinionSpawnType.js";

export default class SummonersRift {
    static blueTopWaypoints = [
        [917, 1725],
        [1170, 4041],
        [861, 6459],
        [880, 10180],
        [1268, 11675],
        [2806, 13075],
        [3907, 13243],
        [7550, 13407],
        [10244, 13238],
        [10947, 13135],
        [12511, 12776],
    ];
    static blueBotWaypoints = [
        [1487, 1302],
        [3789, 1346],
        [6430, 1005],
        [10995, 1234],
        [12841, 3051],
        [13148, 4202],
        [13249, 7884],
        [12886, 10356],
        [12511, 12776],
    ];
    static blueMidWaypoints = [
        [1418, 1686],
        [2997, 2781],
        [4472, 4727],
        [8375, 8366],
        [10948, 10821],
        [12511, 12776],
    ];
    static redTopWaypoints = [
        [12451, 13217],
        [10947, 13135],
        [10244, 13238],
        [7550, 13407],
        [3907, 13243],
        [2806, 13075],
        [1268, 11675],
        [880, 10180],
        [861, 6459],
        [1170, 4041],
        [1418, 1686],
    ];
    static redBotWaypoints = [
        [13062, 12760],
        [12886, 10356],
        [13249, 7884],
        [13148, 4202],
        [12841, 3051],
        [10995, 1234],
        [6430, 1005],
        [3789, 1346],
        [1418, 1686],
    ];
    static redMidWaypoints = [
        [12511, 12776],
        [10948, 10821],
        [8375, 8366],
        [4472, 4727],
        [2997, 2781],
        [1418, 1686],
    ];

    static regularMinionWave = [
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_CASTER,
        MinionSpawnType.MINION_TYPE_CASTER,
        MinionSpawnType.MINION_TYPE_CASTER,
    ];
    static cannonMinionWave = [
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_CANNON,
        MinionSpawnType.MINION_TYPE_CASTER,
        MinionSpawnType.MINION_TYPE_CASTER,
        MinionSpawnType.MINION_TYPE_CASTER,
    ];
    static superMinionWave = [
        MinionSpawnType.MINION_TYPE_SUPER,
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_CASTER,
        MinionSpawnType.MINION_TYPE_CASTER,
        MinionSpawnType.MINION_TYPE_CASTER,
    ];
    static doubleSuperMinionWave = [
        MinionSpawnType.MINION_TYPE_SUPER,
        MinionSpawnType.MINION_TYPE_SUPER,
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_MELEE,
        MinionSpawnType.MINION_TYPE_CASTER,
        MinionSpawnType.MINION_TYPE_CASTER,
        MinionSpawnType.MINION_TYPE_CASTER,
    ];

    static endGameCameraPosition = {
        [TeamId.TEAM_BLUE]: [1170, 1470, 188],
        [TeamId.TEAM_PURPLE]: [12800, 13100, 110],
    };

    static spawnsByTeam = {
        [TeamId.TEAM_BLUE]: [25.9, 280],
        [TeamId.TEAM_PURPLE]: [13948, 14202],
    };

    static turretItems = {
        [TurretType.OUTER_TURRET]: [1500, 1501, 1502, 1503],
        [TurretType.INNER_TURRET]: [1500, 1501, 1502, 1503, 1504],
        [TurretType.INHIBITOR_TURRET]: [1501, 1502, 1503, 1505],
        [TurretType.NEXUS_TURRET]: [1501, 1502, 1503, 1505],
    };

    _game;
    _cannonMinionCount;
    _minionNumber;
    _firstSpawnTime = 90 * 1000;
    _nextSpawnTime = 90 * 1000;
    _spawnInterval = 30 * 1000;
    _fountains; //  Dictionary<TeamId, Fountain>
    _surrenders; // Dictionary<TeamId, SurrenderHandler>

    expToLevelUp = [
        0,
        280,
        660,
        1140,
        1720,
        2400,
        3180,
        4060,
        5040,
        6120,
        7300,
        8580,
        9960,
        11440,
        13020,
        14700,
        16480,
        18360,
    ];

    goldPerSecond = 1.9;
    startingGold = 475;
    hasFirstBloodHappened = false;
    isKillGoldRewardReductionActive = true;
    bluePillId = 2001;
    firstGoldTime = 90 * 1000;
    spawnEnabled;
    
    width = 16000;
    height = 16000;

    //  List<LaneTurret>
    _blueOuterTurrets = [];
    _blueInnerTurrets = [];
    _blueInhibTurrets = [];
    _blueNexusTurrets = [];

    _purpleOuterTurrets = [];
    _purpleInnerTurrets = [];
    _purpleInhibTurrets = [];
    _purpleNexusTurrets = [];

    _blueInhibitors = [];
    _purpleInhibitors = [];

    //   Nexus
    _blueNexus;
    _purpleNexus;

    constructor(game) {
        this._game = game;
        // this._fountains = {
        //     [TeamId.TEAM_BLUE]: new Fountain(
        //         game,
        //         TeamId.TEAM_BLUE,
        //         [11, 250],
        //         1000
        //     ),
        //     [TeamId.TEAM_PURPLE]: new Fountain(
        //         game,
        //         TeamId.TEAM_PURPLE,
        //         [13950, 14200],
        //         1000
        //     ),
        // };
        // this._surrenders = {
        //     [TeamId.TEAM_BLUE]: new SurrenderHandler(
        //         game,
        //         TeamId.TEAM_BLUE,
        //         1200000,
        //         300000,
        //         30
        //     ),
        //     [TeamId.TEAM_PURPLE]: new SurrenderHandler(
        //         game,
        //         TeamId.TEAM_PURPLE,
        //         1200000,
        //         300000,
        //         30
        //     ),
        // };
        this.spawnEnabled = true; //game.config.minionSpawnsEnabled;
    }

    init() {
        // ----------------------- Announcer events -----------------------
        /*
        // Welcome to SR
        this._game.gameMap.announcerEvents.push(
            new Announce(this._game, 30 * 1000, Announces.WELCOME_TO_SR, true)
        );
        // 30 seconds until minions spawn
        if (this._firstSpawnTime - 30 * 1000 >= 0)
            this._game.gameMap.announcerEvents.push(
                new Announce(
                    this._game,
                    this._firstSpawnTime - 30 * 1000,
                    Announces.THIRY_SECONDS_TO_MINIONS_SPAWN,
                    true
                )
            );
        // Minions have spawned (90 * 1000)
        this._game.gameMap.announcerEvents.push(
            new Announce(
                this._game,
                this._firstSpawnTime,
                Announces.MINIONS_HAVE_SPAWNED,
                false
            )
        );
        // Minions have spawned [2] (90 * 1000)
        this._game.gameMap.announcerEvents.push(
            new Announce(
                this._game,
                this._firstSpawnTime,
                Announces.MINIONS_HAVE_SPAWNED2,
                false
            )
        );
        */

        // TODO: Generate & use exact positions from content files

        //TODO: Unhardcode everything (preferably by reading from content)
        // These only matter for projectile collisions.
        let inhibRadius = 214;
        let nexusRadius = 353;
        let sightRange = 1700;

        // ----------------------- BLUE TEAM -----------------------
        /*
        // Outer top - mid - bot turrets
        this._blueOuterTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T1_L_03_A",
                [574.66, 10220.47],
                TeamId.TEAM_BLUE,
                TurretType.OUTER_TURRET,
                this.getTurretItems(TurretType.OUTER_TURRET),
                0,
                LaneID.TOP
            )
        );
        this._blueOuterTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T1_C_05_A",
                [5448.02, 6169.1],
                TeamId.TEAM_BLUE,
                TurretType.OUTER_TURRET,
                this.getTurretItems(TurretType.OUTER_TURRET),
                0,
                LaneID.MIDDLE
            )
        );
        this._blueOuterTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T1_R_03_A",
                [10097.62, 808.73],
                TeamId.TEAM_BLUE,
                TurretType.OUTER_TURRET,
                this.getTurretItems(TurretType.OUTER_TURRET),
                0,
                LaneID.BOTTOM
            )
        );

        // Inner top - mid - bot turrets
        this._blueInnerTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T1_L_02_A",
                [1106.26, 6485.25],
                TeamId.TEAM_BLUE,
                TurretType.INNER_TURRET,
                this.getTurretItems(TurretType.INNER_TURRET),
                0,
                LaneID.TOP
            )
        );
        this._blueInnerTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T1_C_04_A",
                [4657.66, 4591.91],
                TeamId.TEAM_BLUE,
                TurretType.INNER_TURRET,
                this.getTurretItems(TurretType.INNER_TURRET),
                0,
                LaneID.MIDDLE
            )
        );
        this._blueInnerTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T1_R_02_A",
                [6512.53, 1262.62],
                TeamId.TEAM_BLUE,
                TurretType.INNER_TURRET,
                this.getTurretItems(TurretType.INNER_TURRET),
                0,
                LaneID.BOTTOM
            )
        );

        // Inhibitor top - mid - bot turrets
        this._blueInhibTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T1_C_06_A",
                [802.81, 4052.36],
                TeamId.TEAM_BLUE,
                TurretType.INHIBITOR_TURRET,
                this.getTurretItems(TurretType.INHIBITOR_TURRET),
                0,
                LaneID.TOP
            )
        );
        this._blueInhibTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T1_C_03_A",
                [3233.99, 3447.24],
                TeamId.TEAM_BLUE,
                TurretType.INHIBITOR_TURRET,
                this.getTurretItems(TurretType.INHIBITOR_TURRET),
                0,
                LaneID.MIDDLE
            )
        );
        this._blueInhibTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T1_C_07_A",
                [3747.26, 1041.04],
                TeamId.TEAM_BLUE,
                TurretType.INHIBITOR_TURRET,
                this.getTurretItems(TurretType.INHIBITOR_TURRET),
                0,
                LaneID.BOTTOM
            )
        );

        // Inhibitors
        this._blueInhibitors.push(
            new Inhibitor(
                this._game,
                "OrderInhibitor",
                TeamId.TEAM_BLUE,
                inhibRadius,
                [796.097, 3339.8077],
                sightRange,
                0xffd23c3e
            )
        );
        this._blueInhibitors.push(
            new Inhibitor(
                this._game,
                "OrderInhibitor",
                TeamId.TEAM_BLUE,
                inhibRadius,
                [2746.097, 2964.8077],
                sightRange,
                0xff4a20f1
            )
        );
        this._blueInhibitors.push(
            new Inhibitor(
                this._game,
                "OrderInhibitor",
                TeamId.TEAM_BLUE,
                inhibRadius,
                [2996.097, 1014.8077],
                sightRange,
                0xff9303e1
            )
        );

        // Nexus turrets
        this._blueNexusTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T1_C_01_A",
                [1271.097, 1989.8077],
                TeamId.TEAM_BLUE,
                TurretType.NEXUS_TURRET,
                this.getTurretItems(TurretType.NEXUS_TURRET)
            )
        );
        this._blueNexusTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T1_C_02_A",
                [1821.097, 1589.8077],
                TeamId.TEAM_BLUE,
                TurretType.NEXUS_TURRET,
                this.getTurretItems(TurretType.NEXUS_TURRET)
            )
        );

        // ----------------------- PURPLE TEAM ----------------------- 
        // Outer top - mid - bot turrets
        this._purpleOuterTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T2_L_03_A",
                [3911, 13654],
                TeamId.TEAM_PURPLE,
                TurretType.OUTER_TURRET,
                TurretItems[TurretType.OUTER_TURRET],
                0,
                LaneID.TOP
            )
        );
        this._purpleOuterTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T2_C_05_A",
                [8548, 8289],
                TeamId.TEAM_PURPLE,
                TurretType.OUTER_TURRET,
                this.getTurretItems(TurretType.OUTER_TURRET),
                0,
                LaneID.MIDDLE
            )
        );
        this._purpleOuterTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T2_R_03_A",
                [13459, 4284],
                TeamId.TEAM_PURPLE,
                TurretType.OUTER_TURRET,
                this.getTurretItems(TurretType.OUTER_TURRET),
                0,
                LaneID.BOTTOM
            )
        );

        // Inner top - mid - bot turrets
        this._purpleInnerTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T2_L_02_A",
                [7536, 13190],
                TeamId.TEAM_PURPLE,
                TurretType.INNER_TURRET,
                this.getTurretItems(TurretType.INNER_TURRET),
                0,
                LaneID.TOP
            )
        );
        this._purpleInnerTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T2_C_04_A",
                [9361, 9892],
                TeamId.TEAM_PURPLE,
                TurretType.INNER_TURRET,
                this.getTurretItems(TurretType.INNER_TURRET),
                0,
                LaneID.MIDDLE
            )
        );
        this._purpleInnerTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T2_R_02_A",
                [12920, 8005],
                TeamId.TEAM_PURPLE,
                TurretType.INNER_TURRET,
                this.getTurretItems(TurretType.INNER_TURRET),
                0,
                LaneID.BOTTOM
            )
        );

        // Inhibitor top - mid - bot turrets
        this._purpleInhibTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T2_L_01_A",
                [10261, 13465],
                TeamId.TEAM_PURPLE,
                TurretType.INHIBITOR_TURRET,
                this.getTurretItems(TurretType.INHIBITOR_TURRET),
                0,
                LaneID.TOP
            )
        );
        this._purpleInhibTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T2_C_03_A",
                [10743, 11010],
                TeamId.TEAM_PURPLE,
                TurretType.INHIBITOR_TURRET,
                this.getTurretItems(TurretType.INHIBITOR_TURRET),
                0,
                LaneID.MIDDLE
            )
        );
        this._purpleInhibTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T2_R_01_A",
                [13205, 10474],
                TeamId.TEAM_PURPLE,
                TurretType.INHIBITOR_TURRET,
                this.getTurretItems(TurretType.INHIBITOR_TURRET),
                0,
                LaneID.BOTTOM
            )
        );

        // Inhibitors
        this._purpleInhibitors.push(
            new Inhibitor(
                this._game,
                "ChaosInhibitor",
                TeamId.TEAM_PURPLE,
                inhibRadius,
                [10946.097, 13414.8077],
                sightRange,
                0xff6793d0
            )
        );
        this._purpleInhibitors.push(
            new Inhibitor(
                this._game,
                "ChaosInhibitor",
                TeamId.TEAM_PURPLE,
                inhibRadius,
                [11196.097, 11439.8077],
                sightRange,
                0xffff8f1f
            )
        );
        this._purpleInhibitors.push(
            new Inhibitor(
                this._game,
                "ChaosInhibitor",
                TeamId.TEAM_PURPLE,
                inhibRadius,
                [13196.097, 11164.8077],
                sightRange,
                0xff26ac0f
            )
        );

        // Nexus turrets
        this._purpleNexusTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T2_C_01_A",
                [12621.097, 12364.8077],
                TeamId.TEAM_PURPLE,
                TurretType.NEXUS_TURRET,
                this.getTurretItems(TurretType.NEXUS_TURRET)
            )
        );
        this._purpleNexusTurrets.push(
            new LaneTurret(
                this._game,
                "Turret_T2_C_02_A",
                [12171.097, 12789.8077],
                TeamId.TEAM_PURPLE,
                TurretType.NEXUS_TURRET,
                this.getTurretItems(TurretType.NEXUS_TURRET)
            )
        );

        // Fountain turrets
        this._game.objectManager.addObject(
            new LaneTurret(
                this._game,
                "Turret_OrderTurretShrine_A",
                [-236.05, -53.32],
                TeamId.TEAM_BLUE,
                TurretType.FOUNTAIN_TURRET,
                this.getTurretItems(TurretType.FOUNTAIN_TURRET)
            )
        );
        this._game.objectManager.addObject(
            new LaneTurret(
                this._game,
                "Turret_ChaosTurretShrine_A",
                [14157, 14456],
                TeamId.TEAM_PURPLE,
                TurretType.FOUNTAIN_TURRET,
                this.getTurretItems(TurretType.FOUNTAIN_TURRET)
            )
        );

        // ----------------------- PROTECTIONS ----------------------- 
        // TODO: Decide if we want to let ObjectManager handle protection automatically.
        for (let i = 0; i < this._blueOuterTurrets.length; i++) {
            this._game.protectionManager.addProtection(
                this._purpleInhibitors[i],
                false,
                this._purpleInhibTurrets[i]
            );
            this._game.protectionManager.addProtection(
                this._purpleInhibTurrets[i],
                false,
                this._purpleInnerTurrets[i]
            );
            this._game.protectionManager.addProtection(
                this._purpleInnerTurrets[i],
                false,
                this._purpleOuterTurrets[i]
            );

            this._game.protectionManager.addProtection(
                this._blueInhibitors[i],
                false,
                this._blueInhibTurrets[i]
            );
            this._game.protectionManager.addProtection(
                this._blueInhibTurrets[i],
                false,
                this._blueInnerTurrets[i]
            );
            this._game.protectionManager.addProtection(
                this._blueInnerTurrets[i],
                false,
                this._blueOuterTurrets[i]
            );
        }

        this._game.protectionManager.addProtection(
            this._blueNexusTurrets[0],
            false,
            [
                this._blueInhibitors[0],
                this._blueInhibitors[1],
                this._blueInhibitors[2],
            ]
        );
        this._game.protectionManager.addProtection(
            this._blueNexusTurrets[1],
            false,
            [
                this._blueInhibitors[0],
                this._blueInhibitors[1],
                this._blueInhibitors[2],
            ]
        );

        this._game.protectionManager.addProtection(
            this._purpleNexusTurrets[0],
            false,
            [
                this._purpleInhibitors[0],
                this._purpleInhibitors[1],
                this._purpleInhibitors[2],
            ]
        );
        this._game.protectionManager.addProtection(
            this._purpleNexusTurrets[1],
            false,
            [
                this._purpleInhibitors[0],
                this._purpleInhibitors[1],
                this._purpleInhibitors[2],
            ]
        );

        this._blueOuterTurrets.forEach((element) =>
            this._game.objectManager.addObject(element)
        );
        this._blueInnerTurrets.forEach((element) =>
            this._game.objectManager.addObject(element)
        );
        this._blueInhibTurrets.forEach((element) =>
            this._game.objectManager.addObject(element)
        );
        this._blueInhibitors.forEach((element) =>
            this._game.objectManager.addObject(element)
        );
        this._blueNexusTurrets.forEach((element) =>
            this._game.objectManager.addObject(element)
        );

        this._purpleOuterTurrets.forEach((element) =>
            this._game.objectManager.addObject(element)
        );
        this._purpleInnerTurrets.forEach((element) =>
            this._game.objectManager.addObject(element)
        );
        this._purpleInhibTurrets.forEach((element) =>
            this._game.objectManager.addObject(element)
        );
        this._purpleInhibitors.forEach((element) =>
            this._game.objectManager.addObject(element)
        );
        this._purpleNexusTurrets.forEach((element) =>
            this._game.objectManager.addObject(element)
        );

        this._game.objectManager.addObject(
            new LevelProp(
                this._game,
                [12465, 14422.257],
                101,
                [0, 0],
                0,
                0,
                "LevelProp_Yonkey",
                "Yonkey"
            )
        );
        this._game.objectManager.addObject(
            new LevelProp(
                this._game,
                [-76, 1769.1589],
                94,
                [0, 0, 0],
                0,
                0,
                "LevelProp_Yonkey1",
                "Yonkey"
            )
        );
        this._game.objectManager.addObject(
            new LevelProp(
                this._game,
                [13374.17, 14245.673],
                194.9741,
                [224, 33.33],
                0,
                -44.44,
                "LevelProp_ShopMale",
                "ShopMale"
            )
        );
        this._game.objectManager.addObject(
            new LevelProp(
                this._game,
                [-99.5613, 855.6632],
                191.4039,
                [158, 0],
                0,
                0,
                "LevelProp_ShopMale1",
                "ShopMale"
            )
        );

        this._blueNexus = new Nexus(
            this._game,
            "OrderNexus",
            TeamId.TEAM_BLUE,
            nexusRadius,
            [1146.097, 1414.8077],
            sightRange,
            0xfff97db5
        );
        this._purpleNexus = new Nexus(
            this._game,
            "ChaosNexus",
            TeamId.TEAM_PURPLE,
            nexusRadius,
            [12771.097, 13014.8077],
            sightRange,
            0xfff02c0f
        );

        this._game.protectionManager.addProtection(
            this._blueNexus,
            [this._blueNexusTurrets[0], this._blueNexusTurrets[1]],
            [
                this._blueInhibitors[0],
                this._blueInhibitors[1],
                this._blueInhibitors[2],
            ]
        );
        this._game.protectionManager.addProtection(
            this._purpleNexus,
            [this._purpleNexusTurrets[0], this._purpleNexusTurrets[1]],
            [
                this._purpleInhibitors[0],
                this._purpleInhibitors[1],
                this._purpleInhibitors[2],
            ]
        );

        this._game.objectManager.addObject(this._blueNexus);
        this._game.objectManager.addObject(this._purpleNexus);
        */
    }

    update(diff) {
        if (this._game.gameTime >= 120 * 1000) {
            this.isKillGoldRewardReductionActive = false;
        }

        /*if (this.spawnEnabled) {
            if (this._minionNumber > 0) {
                if (
                    this._game.gameTime >=
                    this._nextSpawnTime + this._minionNumber * 8 * 100
                ) {
                    // Spawn new wave every 0.8s
                    if (this.spawn()) {
                        this._minionNumber = 0;
                        this._nextSpawnTime =
                            this._game.gameTime + this._spawnInterval;
                    } else {
                        this._minionNumber++;
                    }
                }
            } else if (this._game.gameTime >= this._nextSpawnTime) {
                this.spawn();
                this._minionNumber++;
            }
        }

        for (let key in this._fountains) {
            this._fountains[key].update(diff);
        }

        for (let key in this._surrenders) this._surrender[key].update(diff);
        */
    }

    getTurretItems(type) {
        if (!(type in this.turretItems)) {
            return null;
        }

        return this.turretItems[type];
    }

    getRespawnLocation(team) {
        if (!(team in this.spawnsByTeam)) {
            return [25.9, 280];
        }

        return this.spawnsByTeam[team];
    }

    /*getMinionModel(team, minionType) {
        let teamDictionary = {
            [TeamId.TEAM_BLUE]: "Blue",
            [TeamId.TEAM_PURPLE]: "Red",
        };

        let typeDictionary = {
            [MinionSpawnType.MINION_TYPE_MELEE]: "Basic",
            [MinionSpawnType.MINION_TYPE_CASTER]: "Wizard",
            [MinionSpawnType.MINION_TYPE_CANNON]: "MechCannon",
            [MinionSpawnType.MINION_TYPE_SUPER]: "MechMelee",
        };

        if (!(team in teamDictionary) || !(minionType in typeDictionary)) {
            return "";
        }

        return `${teamDictionary[team]}_Minion_${typeDictionary[type]}`;
    }

    getGoldFor(u) {
        if (!(u instanceof LaneMinion)) {
            if (!(u instanceof Champion)) {
                return 0;
            }

            let gold = 300; //normal gold for a kill
            if (u.killDeathCounter < 5 && u.killDeathCounter >= 0) {
                if (u.killDeathCounter == 0) {
                    return gold;
                }

                for (let i = u.killDeathCounter; i > 1; --i) {
                    gold += gold * 0.165;
                }

                return gold;
            }

            if (u.killDeathCounter >= 5) {
                return 500;
            }

            if (c.killDeathCounter >= 0) return 0;

            let firstDeathGold = gold - gold * 0.085;

            if (u.killDeathCounter == -1) {
                return firstDeathGold;
            }

            for (let i = c.killDeathCounter; i < -1; ++i) {
                firstDeathGold -= firstDeathGold * 0.2;
            }

            if (firstDeathGold < 50) {
                firstDeathGold = 50;
            }

            return firstDeathGold;
        }

        let dic =
            //new Dictionary<MinionSpawnType, float>
            {
                [MinionSpawnType.MINION_TYPE_MELEE]:
                    19.8 + 0.2 * (this._game.gameTime / (90 * 1000)),
                [MinionSpawnType.MINION_TYPE_CASTER]:
                    16.8 + 0.2 * (this._game.gameTime / (90 * 1000)),
                [MinionSpawnType.MINION_TYPE_CANNON]:
                    40 + 0.5 * (this._game.gameTime / (90 * 1000)),
                [MinionSpawnType.MINION_TYPE_SUPER]:
                    40 + 1 * (this._game.gameTime / (180 * 1000)),
            };

        if (!(u.minionSpawnType in dic)) {
            return 0;
        }

        return dic[u.minionSpawnType];
    }

    getExperienceFor(u) {
        if (!(u instanceof LaneMinion)) {
            return 0;
        }

        let dic =
            //new Dictionary<MinionSpawnType, float>
            {
                [MinionSpawnType.MINION_TYPE_MELEE]: 64,
                [MinionSpawnType.MINION_TYPE_CASTER]: 32,
                [MinionSpawnType.MINION_TYPE_CANNON]: 92,
                [MinionSpawnType.MINION_TYPE_SUPER]: 97,
            };

        if (!(m.minionSpawnType in dic)) {
            return 0;
        }

        return dic[m.MinionSpawnType];
    }

    // Tuple<TeamId, Vector2>
    getMinionSpawnPosition(spawnPosition) {
        switch (spawnPosition) {
            case Barracks.SPAWN_BLUE_TOP:
                return { teamId: TeamId.TEAM_BLUE, position: [907, 1715] };
            case Barracks.SPAWN_BLUE_BOT:
                return { teamId: TeamId.TEAM_BLUE, position: [1533, 1321] };
            case Barracks.SPAWN_BLUE_MID:
                return { teamId: TeamId.TEAM_BLUE, position: [1443, 1663] };
            case Barracks.SPAWN_RED_TOP:
                return { teamId: TeamId.TEAM_PURPLE, position: [12384, 13109] };
            case Barracks.SPAWN_RED_BOT:
                return { teamId: TeamId.TEAM_PURPLE, position: [12967, 12695] };
            case Barracks.SPAWN_RED_MID:
                return { teamId: TeamId.TEAM_PURPLE, position: [12433, 12623] };
        }
        return { teamId: 0, position: [] };
    }

    setMinionStats(m) {
        // Same for all minions
        m.stats.moveSpeed.baseValue = 325;

        switch (m.minionSpawnType) {
            case MinionSpawnType.MINION_TYPE_MELEE:
                m.stats.currentHealth =
                    475 + 20 * (this._game.gameTime / (180 * 1000));
                m.stats.healthPoints.baseValue =
                    475 + 20 * (this._game.gameTime / (180 * 1000));
                m.stats.attackDamage.baseValue =
                    12 + 1 * (this._game.gameTime / (180 * 1000));
                m.stats.range.baseValue = 180;
                m.stats.attackSpeedFlat = 1.25;
                m.autoAttackCastTime = 11.8 / 30;
                m.IsMelee = true;
                break;
            case MinionSpawnType.MINION_TYPE_CASTER:
                m.stats.currentHealth =
                    279 + 7.5 * (this._game.gameTime / (90 * 1000));
                m.stats.healthPoints.baseValue =
                    279 + 7.5 * (this._game.gameTime / (90 * 1000));
                m.stats.attackDamage.baseValue =
                    23 + 1 * (this._game.gameTime / (90 * 1000));
                m.stats.range.baseValue = 600;
                m.stats.attackSpeedFlat = 0.67;
                m.autoAttackCastTime = 14.1 / 30;
                m.autoAttackProjectileSpeed = 650;
                break;
            case MinionSpawnType.MINION_TYPE_CANNON:
                m.stats.currentHealth =
                    700 + 27 * (this._game.gameTime / (180 * 1000));
                m.stats.healthPoints.baseValue =
                    700 + 27 * (this._game.gameTime / (180 * 1000));
                m.stats.attackDamage.baseValue =
                    40 + 3 * (this._game.gameTime / (180 * 1000));
                m.stats.range.baseValue = 450;
                m.stats.attackSpeedFlat = 1;
                m.autoAttackCastTime = 9 / 30;
                m.autoAttackProjectileSpeed = 1200;
                break;
            case MinionSpawnType.MINION_TYPE_SUPER:
                m.stats.currentHealth =
                    1500 + 200 * (this._game.gameTime / (180 * 1000));
                m.stats.healthPoints.baseValue =
                    1500 + 200 * (this._game.gameTime / (180 * 1000));
                m.stats.attackDamage.baseValue =
                    190 + 10 * (this._game.gameTime / (180 * 1000));
                m.stats.range.baseValue = 170;
                m.stats.attackSpeedFlat = 0.694;
                m.stats.Armor.baseValue = 30;
                m.stats.MagicResist.baseValue = -30;
                m.IsMelee = true;
                m.autoAttackCastTime = 15 / 30;
                break;
        }
    }

    spawnMinion(list, minionNo, barracksName, waypoints) {
        if (list.length <= minionNo) {
            return;
        }

        let team = this.getMinionSpawnPosition(barracksName).teamId;
        let m = new LaneMinion(
            this._game,
            list[minionNo],
            barracksName,
            waypoints,
            this.getMinionModel(team, list[minionNo]),
            0,
            team
        );
        this._game.objectManager.addObject(m);
    }

    spawn() {
        let barracks = [
            Barracks.SPAWN_BLUE_TOP,
            Barracks.SPAWN_BLUE_BOT,
            Barracks.SPAWN_BLUE_MID,
            Barracks.SPAWN_RED_TOP,
            Barracks.SPAWN_RED_BOT,
            Barracks.SPAWN_RED_MID,
        ];

        let cannonMinionTimestamps =
            //new List<Tuple<long, int>>
            [
                [0, 2],
                [20 * 60 * 1000, 1],
                [35 * 60 * 1000, 0],
            ];

        let spawnToWaypoints =
            //new Dictionary<string, Tuple<List<Vector2>, uint>>
            {
                [Barracks.SPAWN_BLUE_BOT]: [BlueBotWaypoints, 0xff26ac0f],
                [Barracks.SPAWN_BLUE_MID]: [BlueMidWaypoints, 0xffff8f1f],
                [Barracks.SPAWN_BLUE_TOP]: [BlueTopWaypoints, 0xff6793d0],
                [Barracks.SPAWN_RED_BOT]: [RedBotWaypoints, 0xff9303e1],
                [Barracks.SPAWN_RED_MID]: [RedMidWaypoints, 0xff4a20f1],
                [Barracks.SPAWN_RED_TOP]: [RedTopWaypoints, 0xffd23c3e],
            };

        let cannonMinionCap = 2;

        for (let timestamp of cannonMinionTimestamps) {
            if (this._game.gameTime >= timestamp[0]) {
                cannonMinionCap = timestamp[1];
            }
        }

        for (let barracksName of barracks) {
            let waypoints = spawnToWaypoints[barracksName][0];
            let inhibitorId = spawnToWaypoints[barracksName][1];
            let inhibitor = this._game.objectManager.getInhibitorById(
                inhibitorId
            );
            let isInhibitorDead =
                inhibitor.inhibitorState == InhibitorState.DEAD &&
                !inhibitor.respawnAnnounced;

            let oppositeTeam = TeamId.TEAM_BLUE;
            if (inhibitor.team == TeamId.TEAM_PURPLE) {
                oppositeTeam = TeamId.TEAM_PURPLE;
            }

            let areAllInhibitorsDead =
                this._game.objectManager.allInhibitorsDestroyedFromTeam(
                    oppositeTeam
                ) && !inhibitor.respawnAnnounced;

            let list = this.regularMinionWave;
            if (this._cannonMinionCount >= cannonMinionCap) {
                list = this.cannonMinionWave;
            }

            if (isInhibitorDead) {
                list = this.superMinionWave;
            }

            if (areAllInhibitorsDead) {
                list = this.doubleSuperMinionWave;
            }

            this.spawnMinion(list, _minionNumber, barracksName, waypoints);
        }

        if (this._minionNumber < 8) {
            return false;
        }

        if (this._cannonMinionCount >= cannonMinionCap) {
            this._cannonMinionCount = 0;
        } else {
            this._cannonMinionCount++;
        }
        return true;
    }
    */

    getEndGameCameraPosition(team) {
        if (!(team in this.endGameCameraPosition)) {
            return new [0, 0]();
        }

        return this.endGameCameraPosition[team];
    }

    handleSurrender(userId, who, vote) {
        if (who.team in this._surrenders)
            this._surrenders[who.team].handleSurrender(userId, who, vote);
    }
}
