export default class PlayerManager {
    _networkIdManager;
    _game;

    _players = [];
    _currentId = 1;
    _userIdsPerTeam = {
        [TeamId.TEAM_BLUE]: 0,
        [TeamId.TEAM_PURPLE]: 0,
    };

    constructor(game) {
        this._game = game;
        this._networkIdManager = game.NetworkIdManager;
    }

    getTeamIdFromConfig(p) {
        if (p.Team.ToLower().Equals("blue")) {
            return TeamId.TEAM_BLUE;
        }

        return TeamId.TEAM_PURPLE;
    }

    addPlayer(p) {
        let summonerSkills = [p.Value.Summoner1, p.Value.Summoner2];
        let teamId = this.getTeamIdFromConfig(p.Value);
        let player = new ClientInfo(
            p.Value.Rank,
            teamId,
            p.Value.Ribbon,
            p.Value.Icon,
            p.Value.Skin,
            p.Value.Name,
            summonerSkills,
            _currentId // same as StartClient.bat
        );
        _currentId++;
        let c = new Champion(
            _game,
            p.Value.Champion,
            player.PlayerId,
            _userIdsPerTeam[teamId]++,
            p.Value.Runes,
            player,
            0,
            teamId
        );

        let pos = c.GetSpawnPosition();
        c.SetPosition(pos.X, pos.Y);
        c.StopMovement();
        c.LevelUp();

        player.Champion = c;
        let pair = { [player.PlayerId]: player };
        _players.Add(pair);
    }

    // GetPlayerFromPeer
    getPeerInfo(playerId) {
        for (let player in _players) {
            if (player.Item2.PlayerId == playerId) {
                return player.Item2;
            }
        }

        return null;
    }

    getClientInfoByChampion(champ) {
        return GetPlayers().Find((c) => c.Item2.Champion == champ).Item2;
    }

    getPlayers() {
        return _players;
    }
}
