import BufferModule = require('buffer');

declare function require(moduleName: string): any;

declare var global: any;

let EthJS, privateKeyGenerator, Buffer = BufferModule.Buffer,
    nameKeysField = 'Wallets',
    nameUserField = 'user';

if (typeof global === 'undefined' && window['EthJS'] && window['ethers']) {
    EthJS = window['EthJS'].Util;
    privateKeyGenerator = window['ethers'];
} else {
    EthJS = require('ethereumjs-util');
    privateKeyGenerator = require('ethers');
}

/**
 * @class Sp8deClientSDK
 * */
export class Sp8deClientSDK {

    constructor() {
    }

    /**
     * @description Returns a new private key
     * @memberOf Sp8deClientSDK
     * @return {number} A public key of 66 characters long
     * */
    public generatePrivateKey(): string {
        return privateKeyGenerator.Wallet.createRandom().privateKey;
    };

    /**
     * @description Returns a new wallet
     * @memberOf Sp8deClientSDK
     * @return {object} Object contains wallet
     * */
    public generateWallet(): Wallet {
        return privateKeyGenerator.Wallet.createRandom();
    };

    /**
     * @description Returns a new wallet
     * @memberOf Sp8deClientSDK
     * @param {object} wallet - object with wallet
     * @param {string} password -password
     * @return {promise} promise with json
     * */
    public encryptWallet(wallet: Wallet, password: string): Promise<any> {
        return wallet.encrypt(password);
    };

    /**
     * @description Returns a new wallet
     * @memberOf Sp8deClientSDK
     * @param {string}  wallet - Encrypted JSON with wallet
     * @param {string} password - password
     * @return {promise} promise with json
     * */
    public decryptWallet(wallet: WalletEncrypt, password: string): Promise<any> {
        return privateKeyGenerator.Wallet.fromEncryptedWallet(wallet, password);
    };

    /**
     * @description Returns the public key obtains from the private key
     * @memberOf Sp8deClientSDK
     * @param {string} privateKey - private key
     * @return {string} A public key of 42 characters long
     * */
    public getPubKey(privateKey: string): string {
        if (!privateKey) {
            throw new Error('getPubKey: Invalid parameter');
        }
        return EthJS.addHexPrefix(EthJS.privateToAddress(privateKey).toString('hex'))
    };

    /**
     * @description Returns an seed-array (use keccak-384 algorithm)
     * @memberOf Sp8deClientSDK
     * @param {string[]} signs - array of signs
     * @return {number[]} An array containing random numbers
     * */
    public generateArraySeed(signs: string[]): number[] {
        return this.generateArrayFromHash(this.getHash(signs.join(';')));
    }

    /**
     * @description Returns an hash from string
     * @memberOf Sp8deClientSDK
     * @param {string} string
     * @return {ArrayBuffer} An ArrayBuffer contains hash
     * */
    private getHash(string: string): ArrayBuffer {
        return EthJS.keccak(string, '384');
    }

    /**
     * @description Returns an array of Uint32 numbers from hash
     * @memberOf Sp8deClientSDK
     * @param {ArrayBuffer} hash
     * @return {number[]} array of of Uint32 numbers
     * */
    private generateArrayFromHash(hash: ArrayBuffer): number[] {
        return this.splitIntoPieces(hash, 4)
            .map(this.toUint8)
            .map(this.toUint32);
    }

    private splitIntoPieces(arr: any, count: number): any[] {
        arr = Array.isArray(arr) ? arr : Array.prototype.slice.call(arr);
        return arr
            .map((item, i, arr) => {
                let result = [];
                for (let j = i; j < i + count; j++) {
                    if (arr[j] !== undefined) result.push(arr[j]);
                }
                return result;
            })
            .filter((item, i) => i % count === 0);
    }

    private toUint8(arr: number[]): ArrayBuffer {
        return new Uint8Array(arr);
    }

    private toUint32(arr: any): number {
        return (new DataView(arr.buffer, 0)).getUint32(0);
    }

    /**
     * @description Returns an array of random numbers from seed-array (use mt19937 algorithm)
     * @memberOf Sp8deClientSDK
     * @param {{array: array, min: number, max: number, count: number}} parameters - {array: [], min: number, max: number, count: number}
     * @return {number[]} An array of length given by a "count" containing random numbers
     * */
    public getRandomFromArray(parameters: RandomFromArrayParameters): number[] {
        let rand = new mt19937(),
            result = [];
        if (parameters.array === undefined ||
            !Array.isArray(parameters.array) ||
            parameters.min === undefined ||
            parameters.max === undefined) {
            throw new Error('getRandomFromArray: Invalid parameters');
        }
        rand.init_by_array(parameters.array, parameters.array.length);
        for (let i = 0; i < parameters.count; i++) {
            result.push(AccessoryFunctions.getIntInclusive(rand.random(), parameters.min, parameters.max))
        }
        return result;
    };

    /**
     * @description Returns a random number to use as a seed
     * @memberOf Sp8deClientSDK
     * @return {number} Random seed number. Length 9-10
     * */
    public generateSeed(): number {
        return AccessoryFunctions.byteArrayToLong(
            Array.prototype.slice.call(
                AccessoryFunctions.getRandomValues(
                    new Uint8Array(7)
                )
            )
        );
    };

    /**
     * @description Signs a message from privateKey, seed, nonce. Returns message signed with private key.
     * @memberOf Sp8deClientSDK
     * @param {{privateKey: string, seed: number, nonce: number}} parameters - {privateKey: string, seed: number, nonce: number}
     * @return {string} Message signed with private key
     * */
    public signMessage(parameters: SignParameters): string {
        if (parameters.privateKey === undefined ||
            parameters.seed === undefined ||
            parameters.nonce === undefined) {
            throw new Error('signMessage: Invalid parameters');
        }
        let pubKey = this.getPubKey(parameters.privateKey),
            message = `${pubKey};${parameters.seed};${parameters.nonce}`,
            hashMessage = EthJS.hashPersonalMessage(EthJS.toBuffer(message)),
            signed = EthJS.ecsign(hashMessage, EthJS.toBuffer(parameters.privateKey)),
            tx = signed.r.toString('hex') + signed.s.toString('hex') + EthJS.stripHexPrefix(EthJS.intToHex(signed.v));
        return EthJS.addHexPrefix(tx);
    };

    /**
     * @description Validates the message. Use sign, nonce, public key and seed. Returns true if the validation was successful.
     * @memberOf Sp8deClientSDK
     * @param {{sign: string, pubKey: string, seed: number, nonce: number}} parameters - {sign: string, pubKey: string, seed: number, nonce: number}
     * @return {boolean} True if successful, false if unsuccessful
     * */
    public validateSign(parameters: ValidateParameters): boolean {
        let hash, msg, newPubKey;
        try {
            if (!parameters.sign) throw new TypeError('Empty parameters.sign');
            if (parameters.sign.length % 2 !== 0) throw new TypeError('Invalid hex string');
            parameters.sign = Buffer.from(AccessoryFunctions.getNakedAddress(parameters.sign), 'hex');
            if (parameters.sign.length !== 65) throw new TypeError('parameters.sign length is not valid');
            parameters.sign[64] = parameters.sign[64] === 0 || parameters.sign[64] === 1 ? parameters.sign[64] + 27 : parameters.sign[64];
            msg = `${parameters.pubKey.toLowerCase()};${parameters.seed};${parameters.nonce}`;
            hash = EthJS.hashPersonalMessage(EthJS.toBuffer(msg));
            newPubKey = EthJS.ecrecover(
                hash,
                parameters.sign[64],
                parameters.sign.slice(0, 32),
                parameters.sign.slice(32, 64)
            );
            if (AccessoryFunctions.getNakedAddress(parameters.pubKey) !== EthJS.pubToAddress(newPubKey).toString('hex')) {
                throw new TypeError('parameters.sign is not valid');
            }
        } catch (e) {
            if (e instanceof SyntaxError) console.error('validateSign: JSON is not valid');
            else console.error('validateSign:', e);
            return false;
        }
        return true;
    };

    /*
    *
    * Functions for work with localstorage
    *
    * */

    private isUser(storageWallets: WalletEncrypt[] | User): boolean {
        return storageWallets ? !Array.isArray(storageWallets) : false;
    }

    /**
     * @description Add to localstorage to key Wallets in key "User" or root. If user without field "Wallets" add it.
     * @memberOf Sp8deClientSDK
     * @param value {string} Private key
     * @param storageWallets {object | array} optional. Object wallet contained in storage
     */

    public addWalletToStorage(value: WalletEncrypt,
                              storageWallets: any = this.getWalletsInStorage()): void {
        if (!value) throw new Error('addWalletToStorage: invalid value');
        this.isUser(storageWallets) ?
            this.addWalletToUser(value, storageWallets) :
            this.addWalletToWallets(value, storageWallets);
    }

    private addWalletToWallets(value: WalletEncrypt,
                               storageWallets: WalletEncrypt[],
                               storageService = LocalStorageMethods): void {
        storageWallets = this.addWalletToArray(value, storageWallets);
        storageService.setItem(nameKeysField, storageWallets);
    }

    private addWalletToUser(value: WalletEncrypt,
                            storageWallets: User,
                            storageService = LocalStorageMethods): void {
        storageWallets[nameKeysField] = this.addWalletToArray(value, this.isWalletsInUser(storageWallets) ? storageWallets[nameKeysField] : []);
        storageService.setItem(nameUserField, storageWallets);
    }

    private addWalletToArray(value: WalletEncrypt, storageWallets?: WalletEncrypt[]): WalletEncrypt[] {
        return storageWallets ? [...storageWallets, value] : [value];
    }

    /**
     * @description Removing last private key from array in localstorage
     * @memberOf Sp8deClientSDK
     * @param storageWallets {object | array} optional. Object wallet contained in storage
     */
    public removeLastWalletFromStorage(storageWallets: any = this.getWalletsInStorage()): void {
        if (!this.isWalletsInStorage(storageWallets)) return;
        this.isUser(storageWallets) ? this.removeWalletFromUser(storageWallets) : this.removeWalletFromWallets(storageWallets);
    }

    private removeWalletFromWallets(storageWallets: WalletEncrypt[]): void {
        this.removeLastItemAndStore(storageWallets, nameKeysField);
    }

    private removeWalletFromUser(storageWallets: User): void {
        this.removeLastItemAndStore(storageWallets[nameKeysField], nameUserField, storageWallets);
    }

    private removeLastItemAndStore(storage: any[], name: string, storageWallets: WalletEncrypt[] | User | any[] = storage, storageService = LocalStorageMethods): void {
        storage.pop();
        storageService.setItem(name, storageWallets);
    }

    /**
     * @description Clear array of private keys (delete key from localstorage
     * @memberOf Sp8deClientSDK
     * @param storageWallets {object | array} Object wallet contained in storage)
     */
    public clearWalletStorage(storageWallets: WalletEncrypt[] | User = this.getWalletsInStorage()): void {
        this.isUser(storageWallets) ? this.clearStorageFromUser(storageWallets) : this.clearStorageFromWallets();
    }

    private clearStorageFromWallets(storageService = LocalStorageMethods): void {
        storageService.setItem(nameKeysField, []);
    }

    private clearStorageFromUser(storageWallets: WalletEncrypt[] | User, storageService = LocalStorageMethods): void {
        storageWallets[nameKeysField] = [];
        storageService.setItem(nameUserField, storageWallets);
    }

    /**
     * @description Returns active private key in localstorage
     * @memberOf Sp8deClientSDK
     * @returns {string} Active private key or null if no array
     * @param Wallets {array} optional. Array wallets contained in storage
     */
    public getActiveWalletFromStorage(Wallets: WalletEncrypt[] = this.getWalletsListFromStorage()): WalletEncrypt {
        return Wallets ? Wallets.pop() : null;
    }

    /**
     * @description Returns array of string contains all private keys from localstorage
     * @memberOf Sp8deClientSDK
     * @param storageWallets {object | array} optional. Object wallet contained in storage
     * @return {string[]} Array of private keys or null if no array
     */
    public getWalletsListFromStorage(storageWallets: any = this.getWalletsInStorage()): WalletEncrypt[] {
        if (!this.isWalletsInStorage(storageWallets)) return null;
        return this.isUser(storageWallets) ? this.getListFromUser(storageWallets) : this.getListFromWallets(storageWallets);
    }

    private getListFromWallets(storageWallets: WalletEncrypt[]): WalletEncrypt[] {
        return storageWallets;
    }

    private getListFromUser(storageWallets: User): WalletEncrypt[] {
        return storageWallets[nameKeysField] ? storageWallets[nameKeysField] : null;
    }

    /**
     * @description  Check if there are keys in vault
     * @return {boolean} True if there is, false is not
     * @memberOf Sp8deClientSDK
     * @param storageWallets {object}  optional. User in storage, if it there is
     */
    public isWalletsInStorage(storageWallets: any = this.getWalletsInStorage()): boolean {
        if (!storageWallets) return false;
        return this.isUser(storageWallets) ? this.isWalletsInUser(storageWallets) : this.isWalletsInWallets(storageWallets);
    }

    private isWalletsInWallets(storageWallets: WalletEncrypt[]): boolean {
        return !!storageWallets.length;
    }

    private isWalletsInUser(storageWallets: User): boolean {
        return !(!storageWallets[nameKeysField] || !!!storageWallets[nameKeysField].length);
    }

    private getWalletsInStorage(storageService = LocalStorageMethods): WalletEncrypt[] | User {
        const userKeys = storageService.getItem(nameUserField),
            wallets = storageService.getItem(nameKeysField) ? storageService.getItem(nameKeysField) : null;
        return userKeys ? userKeys : wallets;
    }
}

/*
*
* Local storage methods
*
* */
class LocalStorageMethods {
    static setItem(key: string, value: any): void {
        this.isLocalStorage() ? localStorage.setItem(key, JSON.stringify(value)) : null;
    }

    static getItem(key: string): any {
        return this.isLocalStorage() ? JSON.parse(localStorage.getItem(key)) : null;
    }

    static removeItem(key: string): void {
        this.isLocalStorage() ? localStorage.removeItem(key) : null;
    }

    static clear(): void {
        this.isLocalStorage() ? localStorage.clear() : null;
    }

    static isLocalStorage(): boolean {
        if (localStorage) return true;
        else throw new Error('Does not localstorage in global');
    }
}

interface User {
    name: string;
    token?: string;
    history?: any[];
    wallets?: {};
    balance: number;
}

interface ValidateParameters {
    sign: any,
    pubKey: string,
    seed: number,
    nonce: number
}

interface SignParameters {
    privateKey: string;
    seed: number;
    nonce: number
}

interface RandomFromArrayParameters {
    array: number[];
    min: number;
    max: number;
    count: number;
}

interface Wallet {
    address: string;
    defaultGasLimit: number;
    mnemonic: string;
    path: string;
    privateKey: string;
    provider: any;
    sign: (any);
    encrypt: (any);
}

interface WalletEncrypt {
    address: string;
    id: string;
    version: number;
    Crypto: {
        cipher: string;
        cipherparams: {
            iv: string
        };
        ciphertext: string;
        kdf: string;
        kdfparams: {
            salt: string;
            n: number;
            dklen: number;
            p: number;
            r: number
        };
        mac: string
    };
    'x-ethers': {
        client: string;
        gethFilename: string;
        mnemonicCounter: string;
        mnemonicCiphertext: string;
        version: string
    }
}

/*
*
* Accessory functions for methods
*
*/
class AccessoryFunctions {
    static getRandomValues(buf: Uint8Array): ArrayBuffer {
        let wrapper;
        if (typeof window !== 'undefined') {
            wrapper = window;
        } else if (typeof global !== 'undefined') {
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
                let e = new Error();
                e.message = 'Failed to execute \'getRandomValues\' on \'Crypto\': The ' +
                    'ArrayBufferView\'s byte length (' + buf.length + ') exceeds the ' +
                    'number of bytes of entropy available via this API (65536).';
                e.name = 'QuotaExceededError';
                throw e;
            }
            let bytes = wrapper['nodeCrypto'].randomBytes(buf.length);
            buf.set(bytes);
            return buf;
        }
        else {
            throw new Error('No secure random number generator available.');
        }
    }

    static byteArrayToLong(byteArray: any[]): number {
        let value = 0;
        for (let i = byteArray.length - 1; i >= 0; i--) {
            value = (value * 256) + byteArray[i];
        }
        return value;
    };

    static getNakedAddress(address: string): string {
        return address.toLowerCase().replace('0x', '');
    };

    static getTrezorLenBuf(msgLen: number) {
        if (msgLen < 253) return Buffer.from([msgLen & 0xff]);
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

    static getIntInclusive(rnd: number, min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(rnd * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    };
}

/*
*
* mt19937 methods
*
*/

class mt19937 {
    private readonly N;
    private readonly M;
    private readonly MATRIX_A;
    private readonly UPPER_MASK;
    private readonly LOWER_MASK;
    private readonly mt;
    private mti;

    constructor(seed?) {
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

    init_genrand(s) {
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
    }

    init_by_array(init_key, key_length) {
        let i, j, k;
        this.init_genrand(19650218);
        i = 1;
        j = 0;
        k = (this.N > key_length ? this.N : key_length);
        for (; k; k--) {
            let s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
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
            if (j >= key_length) j = 0;
        }
        for (k = this.N - 1; k; k--) {
            let s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
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
    }

    random() {
        return this.genrand_int32() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    }

    genrand_int32() {
        let y;
        let mag01 = [0x0, this.MATRIX_A];
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (this.mti >= this.N) { /* generate N words at one time */
            let kk;

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
    }
}

if (typeof window !== 'undefined') window['sp8deClientSDK'] = new Sp8deClientSDK();


