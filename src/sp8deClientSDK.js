"use strict";
exports.__esModule = true;
var BufferModule = require("buffer");
var EthJS, privateKeyGenerator, Buffer = BufferModule.Buffer, nameKeysField = 'Wallets', nameUserField = 'user';
if (!global && window['EthJS'] && window['ethers']) {
    EthJS = window['EthJS'].Util;
    privateKeyGenerator = window['ethers'];
}
else {
    EthJS = require('ethereumjs-util');
    privateKeyGenerator = require('ethers');
}
/**
 * @class Sp8deClientSDK
 * */
var Sp8deClientSDK = /** @class */ (function () {
    function Sp8deClientSDK() {
    }
    /**
     * @description Returns a new private key
     * @memberOf Sp8deClientSDK
     * @return {number} A public key of 66 characters long
     * */
    Sp8deClientSDK.prototype.generatePrivateKey = function () {
        return privateKeyGenerator.Wallet.createRandom().privateKey;
    };
    ;
    /**
     * @description Returns a new wallet
     * @memberOf Sp8deClientSDK
     * @return {object} Object contains wallet
     * */
    Sp8deClientSDK.prototype.generateWallet = function () {
        return privateKeyGenerator.Wallet.createRandom();
    };
    ;
    /**
     * @description Returns a new wallet
     * @memberOf Sp8deClientSDK
     * @param {object} wallet - object with wallet
     * @param {string} password
     * @return {promise} promise with json
     * */
    Sp8deClientSDK.prototype.encryptWallet = function (wallet, password) {
        return wallet.encrypt(password);
    };
    ;
    /**
     * @description Returns a new wallet
     * @memberOf Sp8deClientSDK
     * @param {string}  wallet - Encrypted JSON with wallet
     * @param {string} password
     * @return {promise} promise with json
     * */
    Sp8deClientSDK.prototype.decryptWallet = function (wallet, password) {
        return privateKeyGenerator.Wallet.fromEncryptedWallet(wallet, password);
    };
    ;
    /**
     * @description Returns the public key obtains from the private key
     * @memberOf Sp8deClientSDK
     * @param {string} privateKey - private key
     * @return {string} A public key of 42 characters long
     * */
    Sp8deClientSDK.prototype.getPubKey = function (privateKey) {
        if (!privateKey) {
            throw new Error('getPubKey: Invalid parameter');
        }
        return EthJS.addHexPrefix(EthJS.privateToAddress(privateKey).toString('hex'));
    };
    ;
    /**
     * @description Returns an seed-array (use keccak-384 algorithm)
     * @memberOf Sp8deClientSDK
     * @param {string[]} signs - array of signs
     * @return {number[]} An array containing random numbers
     * */
    Sp8deClientSDK.prototype.generateArraySeed = function (signs) {
        return this.generateArrayFromHash(this.getHash(signs.join(';')));
    };
    /**
     * @description Returns an hash from string
     * @memberOf Sp8deClientSDK
     * @param {string} string
     * @return {ArrayBuffer} An ArrayBuffer contains hash
     * */
    Sp8deClientSDK.prototype.getHash = function (string) {
        return EthJS.keccak(string, '384');
    };
    Sp8deClientSDK.prototype.generateArrayFromHash = function (hash) {
        return this.splitIntoPieces(hash, 4)
            .map(this.toUint8)
            .map(this.toUint32);
    };
    Sp8deClientSDK.prototype.splitIntoPieces = function (arr, count) {
        arr = Array.isArray(arr) ? arr : Array.prototype.slice.call(arr);
        return arr
            .map(function (item, i, arr) {
            var result = [];
            for (var j = i; j < i + count; j++) {
                if (arr[j] !== undefined)
                    result.push(arr[j]);
            }
            return result;
        })
            .filter(function (item, i) { return i % count === 0; });
    };
    Sp8deClientSDK.prototype.toUint8 = function (arr) {
        return new Uint8Array(arr);
    };
    Sp8deClientSDK.prototype.toUint32 = function (arr) {
        return (new DataView(arr.buffer, 0)).getUint32(0);
    };
    /**
     * @description Returns an array of random numbers from seed-array (use mt19937 algorithm)
     * @memberOf Sp8deClientSDK
     * @param {{array: array, min: number, max: number, count: number}} parameters - {array: [], min: number, max: number, count: number}
     * @return {number[]} An array of length given by a "count" containing random numbers
     * */
    Sp8deClientSDK.prototype.getRandomFromArray = function (parameters) {
        var rand = new mt19937(), result = [];
        if (parameters.array === undefined ||
            !Array.isArray(parameters.array) ||
            parameters.min === undefined ||
            parameters.max === undefined) {
            throw new Error('getRandomFromArray: Invalid parameters');
        }
        rand.init_by_array(parameters.array, parameters.array.length);
        for (var i = 0; i < parameters.count; i++) {
            result.push(AccessoryFunctions.getIntInclusive(rand.random(), parameters.min, parameters.max));
        }
        return result;
    };
    ;
    /**
     * @description Returns a random number to use as a seed
     * @memberOf Sp8deClientSDK
     * @return {number} Random seed number. Length 9-10
     * */
    Sp8deClientSDK.prototype.generateSeed = function () {
        return AccessoryFunctions.byteArrayToLong(Array.prototype.slice.call(AccessoryFunctions.getRandomValues(new Uint8Array(7))));
    };
    ;
    /**
     * @description Signs a message from privateKey, seed, nonce. Returns message signed with private key.
     * @memberOf Sp8deClientSDK
     * @param {{privateKey: string, seed: number, nonce: number}} parameters - {privateKey: string, seed: number, nonce: number}
     * @return {string} Message signed with private key
     * */
    Sp8deClientSDK.prototype.signMessage = function (parameters) {
        if (parameters.privateKey === undefined ||
            parameters.seed === undefined ||
            parameters.nonce === undefined) {
            throw new Error('signMessage: Invalid parameters');
        }
        var pubKey = this.getPubKey(parameters.privateKey), message = pubKey + ";" + parameters.seed + ";" + parameters.nonce, hashMessage = EthJS.hashPersonalMessage(EthJS.toBuffer(message)), signed = EthJS.ecsign(hashMessage, EthJS.toBuffer(parameters.privateKey)), tx = signed.r.toString('hex') + signed.s.toString('hex') + EthJS.stripHexPrefix(EthJS.intToHex(signed.v));
        return EthJS.addHexPrefix(tx);
    };
    ;
    /**
     * @description Validates the message. Use sign, nonce, public key and seed. Returns true if the validation was successful.
     * @memberOf Sp8deClientSDK
     * @param {{sign: string, pubKey: string, seed: number, nonce: number}} parameters - {sign: string, pubKey: string, seed: number, nonce: number}
     * @return {boolean} True if successful, false if unsuccessful
     * */
    Sp8deClientSDK.prototype.validateSign = function (parameters) {
        var hash, msg, newPubKey;
        try {
            if (!parameters.sign)
                throw new TypeError('Empty parameters.sign');
            if (parameters.sign.length % 2 !== 0)
                throw new TypeError('Invalid hex string');
            parameters.sign = Buffer.from(AccessoryFunctions.getNakedAddress(parameters.sign), 'hex');
            if (parameters.sign.length !== 65)
                throw new TypeError('parameters.sign length is not valid');
            parameters.sign[64] = parameters.sign[64] === 0 || parameters.sign[64] === 1 ? parameters.sign[64] + 27 : parameters.sign[64];
            msg = parameters.pubKey.toLowerCase() + ";" + parameters.seed + ";" + parameters.nonce;
            hash = EthJS.hashPersonalMessage(EthJS.toBuffer(msg));
            newPubKey = EthJS.ecrecover(hash, parameters.sign[64], parameters.sign.slice(0, 32), parameters.sign.slice(32, 64));
            if (AccessoryFunctions.getNakedAddress(parameters.pubKey) !== EthJS.pubToAddress(newPubKey).toString('hex')) {
                throw new TypeError('parameters.sign is not valid');
            }
        }
        catch (e) {
            if (e instanceof SyntaxError)
                console.error('validateSign: JSON is not valid');
            else
                console.error('validateSign:', e);
            return false;
        }
        return true;
    };
    ;
    /*
    *
    * Functions for work with localstorage
    *
    * */
    Sp8deClientSDK.prototype.isUser = function (storageWallets) {
        return storageWallets ? !Array.isArray(storageWallets) : false;
    };
    /**
     * @description Add to localstorage to key Wallets in key "User" or root. If user without field "Wallets" add it.
     * @param value {string} Private key
     * @param storageWallets {object | array} optional. Object wallet contained in storage
     */
    Sp8deClientSDK.prototype.addWalletToStorage = function (value, storageWallets) {
        if (storageWallets === void 0) { storageWallets = this.getWalletsInStorage(); }
        if (!value)
            throw new Error('addWalletToStorage: invalid value');
        this.isUser(storageWallets) ?
            this.addWalletToUser(value, storageWallets) :
            this.addWalletToWallets(value, storageWallets);
    };
    Sp8deClientSDK.prototype.addWalletToWallets = function (value, storageWallets, storageService) {
        if (storageService === void 0) { storageService = LocalStorageMethods; }
        storageWallets = this.addWalletToArray(value, storageWallets);
        storageService.setItem(nameKeysField, storageWallets);
    };
    Sp8deClientSDK.prototype.addWalletToUser = function (value, storageWallets, storageService) {
        if (storageService === void 0) { storageService = LocalStorageMethods; }
        storageWallets[nameKeysField] = this.addWalletToArray(value, this.isWalletsInUser(storageWallets) ? storageWallets[nameKeysField] : []);
        storageService.setItem(nameUserField, storageWallets);
    };
    Sp8deClientSDK.prototype.addWalletToArray = function (value, storageWallets) {
        return storageWallets ? storageWallets.concat([value]) : [value];
    };
    /**
     * @description Removing last private key from array in localstorage
     * @param storageWallets {object | array} optional. Object wallet contained in storage
     */
    Sp8deClientSDK.prototype.removeLastWalletFromStorage = function (storageWallets) {
        if (storageWallets === void 0) { storageWallets = this.getWalletsInStorage(); }
        if (!this.isWalletsInStorage(storageWallets))
            return;
        this.isUser(storageWallets) ? this.removeWalletFromUser(storageWallets) : this.removeWalletFromWallets(storageWallets);
    };
    Sp8deClientSDK.prototype.removeWalletFromWallets = function (storageWallets) {
        this.removeLastItemAndStore(storageWallets, nameKeysField);
    };
    Sp8deClientSDK.prototype.removeWalletFromUser = function (storageWallets) {
        this.removeLastItemAndStore(storageWallets[nameKeysField], nameUserField, storageWallets);
    };
    Sp8deClientSDK.prototype.removeLastItemAndStore = function (storage, name, storageWallets, storageService) {
        if (storageWallets === void 0) { storageWallets = storage; }
        if (storageService === void 0) { storageService = LocalStorageMethods; }
        storage.pop();
        storageService.setItem(name, storageWallets);
    };
    /**
     * @description Clear array of private keys (delete key from localstorage
     * @param storageWallets {object | array} Object wallet contained in storage)
     */
    Sp8deClientSDK.prototype.clearWalletStorage = function (storageWallets) {
        if (storageWallets === void 0) { storageWallets = this.getWalletsInStorage(); }
        this.isUser(storageWallets) ? this.clearStorageFromUser(storageWallets) : this.clearStorageFromWallets();
    };
    Sp8deClientSDK.prototype.clearStorageFromWallets = function (storageService) {
        if (storageService === void 0) { storageService = LocalStorageMethods; }
        storageService.setItem(nameKeysField, []);
    };
    Sp8deClientSDK.prototype.clearStorageFromUser = function (storageWallets, storageService) {
        if (storageService === void 0) { storageService = LocalStorageMethods; }
        storageWallets[nameKeysField] = [];
        storageService.setItem(nameUserField, storageWallets);
    };
    /**
     * @description Returns active private key in localstorage
     * @returns {string} Active private key or null if no array
     * @param Wallets {array} optional. Array wallets contained in storage
     */
    Sp8deClientSDK.prototype.getActiveWalletFromStorage = function (Wallets) {
        if (Wallets === void 0) { Wallets = this.getWalletsListFromStorage(); }
        return Wallets ? Wallets.pop() : null;
    };
    /**
     * @description Returns array of string contains all private keys from localstorage
     * @param storageWallets {object | array} optional. Object wallet contained in storage
     * @return {string[]} Array of private keys or null if no array
     */
    Sp8deClientSDK.prototype.getWalletsListFromStorage = function (storageWallets) {
        if (storageWallets === void 0) { storageWallets = this.getWalletsInStorage(); }
        if (!this.isWalletsInStorage(storageWallets))
            return null;
        return this.isUser(storageWallets) ? this.getListFromUser(storageWallets) : this.getListFromWallets(storageWallets);
    };
    Sp8deClientSDK.prototype.getListFromWallets = function (storageWallets) {
        return storageWallets;
    };
    Sp8deClientSDK.prototype.getListFromUser = function (storageWallets) {
        return storageWallets[nameKeysField] ? storageWallets[nameKeysField] : null;
    };
    /**
     * @description  Check if there are keys in vault
     * @return {boolean} True if there is, false is not
     * @param storageWallets {object}  optional. User in storage, if it there is
     */
    Sp8deClientSDK.prototype.isWalletsInStorage = function (storageWallets) {
        if (storageWallets === void 0) { storageWallets = this.getWalletsInStorage(); }
        if (!storageWallets)
            return false;
        return this.isUser(storageWallets) ? this.isWalletsInUser(storageWallets) : this.isWalletsInWallets(storageWallets);
    };
    Sp8deClientSDK.prototype.isWalletsInWallets = function (storageWallets) {
        return !!storageWallets.length;
    };
    Sp8deClientSDK.prototype.isWalletsInUser = function (storageWallets) {
        return !(!storageWallets[nameKeysField] || !!!storageWallets[nameKeysField].length);
    };
    Sp8deClientSDK.prototype.getWalletsInStorage = function (storageService) {
        if (storageService === void 0) { storageService = LocalStorageMethods; }
        var userKeys = storageService.getItem(nameUserField), wallets = storageService.getItem(nameKeysField) ? storageService.getItem(nameKeysField) : null;
        return userKeys ? userKeys : wallets;
    };
    return Sp8deClientSDK;
}());
exports.Sp8deClientSDK = Sp8deClientSDK;
/*
*
* Local storage methods
*
* */
var LocalStorageMethods = /** @class */ (function () {
    function LocalStorageMethods() {
    }
    LocalStorageMethods.setItem = function (key, value) {
        this.isLocalStorage() ? localStorage.setItem(key, JSON.stringify(value)) : null;
    };
    LocalStorageMethods.getItem = function (key) {
        return this.isLocalStorage() ? JSON.parse(localStorage.getItem(key)) : null;
    };
    LocalStorageMethods.removeItem = function (key) {
        this.isLocalStorage() ? localStorage.removeItem(key) : null;
    };
    LocalStorageMethods.clear = function () {
        this.isLocalStorage() ? localStorage.clear() : null;
    };
    LocalStorageMethods.isLocalStorage = function () {
        if (localStorage)
            return true;
        else
            throw new Error('Does not localstorage in global');
    };
    return LocalStorageMethods;
}());
/*
*
* Accessory functions for methods
*
*/
var AccessoryFunctions = /** @class */ (function () {
    function AccessoryFunctions() {
    }
    AccessoryFunctions.getRandomValues = function (buf) {
        var wrapper;
        if (typeof window !== 'undefined') {
            wrapper = window;
        }
        else if (typeof global !== 'undefined') {
            wrapper = global;
        }
        if (wrapper['crypto'] && wrapper['crypto'].getRandomValues) {
            return wrapper.crypto.getRandomValues(buf);
        }
        else if (typeof wrapper['msCrypto'] === 'object' && typeof wrapper['msCrypto'].getRandomValues === 'function') {
            return wrapper['msCrypto'].getRandomValues(buf);
        }
        else if (wrapper['nodeCrypto'] && wrapper['nodeCrypto'].randomBytes) {
            if (!(buf instanceof Uint8Array)) {
                throw new TypeError('expected Uint8Array');
            }
            if (buf.length > 65536) {
                var e = new Error();
                e.message = 'Failed to execute \'getRandomValues\' on \'Crypto\': The ' +
                    'ArrayBufferView\'s byte length (' + buf.length + ') exceeds the ' +
                    'number of bytes of entropy available via this API (65536).';
                e.name = 'QuotaExceededError';
                throw e;
            }
            var bytes = wrapper['nodeCrypto'].randomBytes(buf.length);
            buf.set(bytes);
            return buf;
        }
        else {
            throw new Error('No secure random number generator available.');
        }
    };
    AccessoryFunctions.byteArrayToLong = function (byteArray) {
        var value = 0;
        for (var i = byteArray.length - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }
        return value;
    };
    ;
    AccessoryFunctions.getNakedAddress = function (address) {
        return address.toLowerCase().replace('0x', '');
    };
    ;
    AccessoryFunctions.getTrezorLenBuf = function (msgLen) {
        if (msgLen < 253)
            return Buffer.from([msgLen & 0xff]);
        else if (msgLen < 0x10000)
            return Buffer.from([253, msgLen & 0xff, (msgLen >> 8) & 0xff]);
        else {
            return Buffer.from([
                254,
                msgLen & 0xff,
                (msgLen >> 8) & 0xff,
                (msgLen >> 16) & 0xff,
                (msgLen >> 24) & 0xff
            ]);
        }
    };
    ;
    AccessoryFunctions.getIntInclusive = function (rnd, min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(rnd * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    };
    ;
    return AccessoryFunctions;
}());
/*
*
* mt19937 methods
*
*/
var mt19937 = /** @class */ (function () {
    function mt19937(seed) {
        if (seed == undefined) {
            seed = new Date().getTime();
        }
        /* Period parameters */
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df;
        /* constant vector a */
        this.UPPER_MASK = 0x80000000;
        /* most significant w-r bits */
        this.LOWER_MASK = 0x7fffffff;
        /* least significant r bits */
        this.mt = new Array(this.N);
        /* the array for the state vector */
        this.mti = this.N + 1;
        /* mti==N+1 means mt[N] is not initialized */
        this.init_genrand(seed);
    }
    mt19937.prototype.init_genrand = function (s) {
        this.mt[0] = s >>> 0;
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    };
    mt19937.prototype.init_by_array = function (init_key, key_length) {
        var i, j, k;
        this.init_genrand(19650218);
        i = 1;
        j = 0;
        k = (this.N > key_length ? this.N : key_length);
        for (; k; k--) {
            var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525))) + init_key[j] + j;
            /* non linear */
            this.mt[i] >>>= 0;
            /* for WORDSIZE > 32 machines */
            i++;
            j++;
            if (i >= this.N) {
                this.mt[0] = this.mt[this.N - 1];
                i = 1;
            }
            if (j >= key_length)
                j = 0;
        }
        for (k = this.N - 1; k; k--) {
            var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941)) - i;
            /* non linear */
            this.mt[i] >>>= 0;
            /* for WORDSIZE > 32 machines */
            i++;
            if (i >= this.N) {
                this.mt[0] = this.mt[this.N - 1];
                i = 1;
            }
        }
        this.mt[0] = 0x80000000;
        /* MSB is 1; assuring non-zero initial array */
    };
    mt19937.prototype.random = function () {
        return this.genrand_int32() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    };
    mt19937.prototype.genrand_int32 = function () {
        var y;
        var mag01 = [0x0, this.MATRIX_A];
        /* mag01[x] = x * MATRIX_A  for x=0,1 */
        if (this.mti >= this.N) { /* generate N words at one time */
            var kk = void 0;
            if (this.mti == this.N + 1) /* if init_genrand() has not been called, */
                this.init_genrand(5489);
            /* a default initial seed is used */
            for (kk = 0; kk < this.N - this.M; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (; kk < this.N - 1; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];
            this.mti = 0;
        }
        y = this.mt[this.mti++];
        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);
        return y >>> 0;
    };
    return mt19937;
}());
if (!global && window !== undefined)
    window['sp8deClientSDK'] = new Sp8deClientSDK();
else
    global.sp8deClientSDK = new Sp8deClientSDK();
