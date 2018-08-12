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
    }

    addPlayer(username, initiative) {
        let newPlayer = {
            name: username,
            initiative
        };

        let { combat } = this.state;

        combat.push(newPlayer);

        this.setState({
            combat
        });
    }
}

let store = alt.createStore(new CombatStore, 'CombatStore');

// if (typeof window !== "undefined" && typeof window.personalised !== 'undefined') {
//     store.setupPersonalisedProduct(window.personalised);
// }

export default store;