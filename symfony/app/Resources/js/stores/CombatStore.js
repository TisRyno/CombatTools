import alt from '../alt';
import _a from 'axios';
import Cache from '../helpers/Cache'

_a.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'; // Needed so server can identify as this req as ajax

class CombatStore {
    constructor() {
        this.state = {
            combatStarted: false,
            combat: []
        };

        setTimeout(() => this.syncCacheToState(), 1);

        this.exportPublicMethods({
            addPlayer: this.addPlayer.bind(this),
            removePlayer: this.removePlayer.bind(this),
            startCombat: this.startCombat.bind(this),
            endCombat: this.endCombat.bind(this),
            movePlayerToNextRound: this.movePlayerToNextRound.bind(this),
            killPlayer: this.killPlayer.bind(this),
            resurrectPlayer: this.resurrectPlayer.bind(this),
            incrementPlayerSuccessThrow: this.incrementPlayerSuccessThrow.bind(this),
            incrementPlayerFailedThrow: this.incrementPlayerFailedThrow.bind(this),
        });
    }

    syncCacheToState = () => {
        let players = Cache.get('players');

        if (players) {
            this.setState({
                combat: players
            });
        }
    };

    startCombat() {
        let {combat} = this.state;

        combat = combat.map((player, i) => {
            player.round = 0;
            return player;
        });

        this.setState({
            combatStarted: true,
            combat
        });
    }

    endCombat() {
        this.setState({
            combatStarted: false
        });
    }

    movePlayerToNextRound(username) {
        let {combat} = this.state;

        combat = combat.map((player, i) => {
            if (player.name === username) {
                player.round += 1;
            }
            return player;
        });

        this.setState({
            combat
        });

        Cache.set('players', combat, 60000);
    }

    incrementPlayerSuccessThrow(username) {
        let {combat} = this.state;

        combat = combat.map((player, i) => {
            if (player.name === username) {
                player.successThrows += 1;
                if (player.successThrows >= 3) {
                    player.successThrows = 0;
                    player.isDead = false;
                    player.failedThrows = 0;
                }
            }
            return player;
        });

        this.setState({
            combat
        });

        Cache.set('players', combat, 60000);

    }

    incrementPlayerFailedThrow(username) {
        let {combat} = this.state;

        let playerHasDied = false;

        combat = combat.map((player, i) => {
            if (player.name === username) {
                player.failedThrows += 1;
                if (player.failedThrows >= 3) {
                    playerHasDied = true;
                }
            }
            return player;
        });

        this.setState({
            combat
        });

        Cache.set('players', combat, 60000);

        if (playerHasDied) {
            this.removePlayer(username);
        }
    }

    addPlayer(username, initiative, healthPoints) {
        let newPlayer = {
            name: username,
            initiative,
            maxHealthPoints: healthPoints,
            healthPoints,
            round: 0,
            isDead: false,
            successThrows: 0,
            failedThrows: 0,
        };

        let {combat} = this.state;

        combat.push(newPlayer);

        this.setState({
            combat
        });

        Cache.set('players', combat, 60000);
    }

    removePlayer(username) {
        let {combat} = this.state;

        combat = combat.filter((player, i) => {
            return player.name !== username;
        });

        this.setState({
            combat
        });

        Cache.set('players', combat, 60000);
    }

    killPlayer(username) {
        let {combat} = this.state;

        combat = combat.map((player, i) => {
            if (player.name === username) {
                player.isDead = true;
            }
            return player;
        });

        this.setState({
            combat
        });

        Cache.set('players', combat, 60000);
    }

    resurrectPlayer(username) {
        let {combat} = this.state;

        combat = combat.map((player, i) => {
            if (player.name === username) {
                player.isDead = false;
            }
            return player;
        });

        this.setState({
            combat
        });

        Cache.set('players', combat, 60000);
    }
}


let store = alt.createStore(CombatStore, 'CombatStore');

// if (typeof window !== "undefined" && typeof window.personalised !== 'undefined') {
//     store.setupPersonalisedProduct(window.personalised);
// }

module.exports = store;