import LocalForage from 'localforage';
/** @hidden */
export const Drivers = {
    SecureStorage: 'ionicSecureStorage',
    IndexedDB: LocalForage.INDEXEDDB,
    LocalStorage: LocalForage.LOCALSTORAGE
};
const defaultConfig = {
    name: '_ionicstorage',
    storeName: '_ionickv',
    dbKey: '_ionickey',
    driverOrder: [
        Drivers.SecureStorage,
        Drivers.IndexedDB,
        Drivers.LocalStorage
    ]
};
export class Storage {
    /**
     * Create a new Storage instance using the order of drivers and any additional config
     * options to pass to LocalForage.
     *
     * Possible default driverOrder options are: ['indexeddb', 'localstorage'] and the
     * default is that exact ordering.
     *
     * When using Ionic Secure Storage (enterprise only), use ['ionicSecureStorage', 'indexeddb', 'localstorage'] to ensure
     * Secure Storage is used when available, or fall back to IndexedDB or LocalStorage on the web.
     */
    constructor(config = defaultConfig) {
        this._db = null;
        this._secureStorageDriver = null;
        const actualConfig = Object.assign({}, defaultConfig, config || {});
        this._config = actualConfig;
    }
    async create() {
        const db = LocalForage.createInstance(this._config);
        this._db = db;
        await db.setDriver(this._config.driverOrder || []);
        return this;
    }
    /**
     * Define a new Driver. Must be called before
     * initializing the database. Example:
     *
     * await storage.defineDriver(myDriver);
     * await storage.create();
     */
    async defineDriver(driver) {
        if (driver._driver === Drivers.SecureStorage) {
            this._secureStorageDriver = driver;
        }
        return LocalForage.defineDriver(driver);
    }
    /**
     * Get the name of the driver being used.
     * @returns Name of the driver
     */
    get driver() {
        var _a;
        return ((_a = this._db) === null || _a === void 0 ? void 0 : _a.driver()) || null;
    }
    assertDb() {
        if (!this._db) {
            throw new Error('Database not created. Must call create() first');
        }
        return this._db;
    }
    /**
     * Get the value associated with the given key.
     * @param key the key to identify this value
     * @returns Returns a promise with the value of the given key
     */
    get(key) {
        const db = this.assertDb();
        return db.getItem(key);
    }
    /**
     * Set the value for the given key.
     * @param key the key to identify this value
     * @param value the value for this key
     * @returns Returns a promise that resolves when the key and value are set
     */
    set(key, value) {
        const db = this.assertDb();
        return db.setItem(key, value);
    }
    /**
     * Remove any value associated with this key.
     * @param key the key to identify this value
     * @returns Returns a promise that resolves when the value is removed
     */
    remove(key) {
        const db = this.assertDb();
        return db.removeItem(key);
    }
    /**
     * Clear the entire key value store. WARNING: HOT!
     * @returns Returns a promise that resolves when the store is cleared
     */
    clear() {
        const db = this.assertDb();
        return db.clear();
    }
    /**
     * @returns Returns a promise that resolves with the number of keys stored.
     */
    length() {
        const db = this.assertDb();
        return db.length();
    }
    /**
     * @returns Returns a promise that resolves with the keys in the store.
     */
    keys() {
        const db = this.assertDb();
        return db.keys();
    }
    /**
     * Iterate through each key,value pair.
     * @param iteratorCallback a callback of the form (value, key, iterationNumber)
     * @returns Returns a promise that resolves when the iteration has finished.
     */
    forEach(iteratorCallback) {
        const db = this.assertDb();
        return db.iterate(iteratorCallback);
    }
    setEncryptionKey(key) {
        var _a;
        if (!this._secureStorageDriver) {
            throw new Error('@ionic-enterprise/secure-storage not installed. Encryption support not available');
        }
        else {
            (_a = this._secureStorageDriver) === null || _a === void 0 ? void 0 : _a.setEncryptionKey(key);
        }
    }
}
