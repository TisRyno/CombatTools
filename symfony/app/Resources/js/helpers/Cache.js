import lscache from 'ls-cache'

class Cache {
    static get(key, defaultValue) {
        let value;
        try {
            value = lscache.get(key);
        } catch (e) { }

        if (!value || typeof value === 'undefined') {
            value = defaultValue;
        }

        return value;
    }
    static set(key, value, ttl) {
        try {
            lscache.set(key, value, ttl);
        } catch(e) {
            return false;
        }
        return true;
    }
}

module.exports = Cache;