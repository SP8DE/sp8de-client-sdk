import BufferModule = require('buffer');

let Buffer = BufferModule.Buffer,
    EthJS,
    privateKeyGenerator,
    nameKeysField = 'Wallets',
    nameUserField = 'user';

/**
 * @class Sp8deClientSDK
 * */
export class Sp8deClientSDK {

    constructor(eth?, privateKeyGeneratorExternal?) {
        EthJS = !eth ? window['EthJS'].Util : eth;
        privateKeyGenerator = !privateKeyGeneratorExternal ? window['ethers'] : privateKeyGeneratorExternal;
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
        // console.log(privateKeyGenerator.Wallet.createRandom())
        return privateKeyGenerator.Wallet.createRandom();
    };

    /**
     * @description Returns a new wallet
     * @memberOf Sp8deClientSDK
     * @param {object} wallet - object with wallet
     * @param {string} password
     * @return {promise} promise with json
     * */
    public encryptWallet(wallet: Wallet, password: string): Promise<any> {
        return wallet.encrypt(password);
    };

    /**
     * @description Returns a new wallet
     * @memberOf Sp8deClientSDK
     * @param {string}  wallet - Encrypted JSON with wallet
     * @param {string} password
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
            throw new Error('Invalid parameter');
        }
        return EthJS.addHexPrefix(EthJS.privateToAddress(privateKey).toString('hex'))
    };

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
            throw new Error('Invalid parameters');
        }
        rand.init_by_array(parameters.array, parameters.array.length);
        for (let i = 0; i < parameters.count; i++) {
            result.push(AccessoryFunctions.getRandomIntInclusive(rand.random(), parameters.min, parameters.max))
        }
        return result;
    };

    /**
     * @description Returns a random number to use as a seed
     * @memberOf Sp8deClientSDK
     * @return {number} Random seed number. Length 9-10
     * */
    public generateSeed(): number {
        let rnd = new Uint32Array(1);
        window.crypto.getRandomValues(rnd);
        return rnd[0];
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
            throw new Error('Invalid parameters');
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
            if (e instanceof SyntaxError) console.error('JSON is not valid');
            else console.error(e);
            return false;
        }
        return true;
    };

    /**
     * @description Add to localstorage to key Wallets in key "User" or root. If user without field "Wallets" add it.
     * @param value {string} Private key
     * @param storageWallets {object | array} optional. Object wallet contained in storage
     * @param storageService {object} optional. Object work with any storage
     */
    public addWalletToStorage(value: WalletEncrypt,
                              storageWallets: WalletEncrypt[] | User = this.getWalletsInStorage(),
                              storageService = LocalStorageMethods): void {
        if (!value) throw new Error('invalid value');
        if (Array.isArray(storageWallets)) {
            storageWallets.push(value);
            storageService.setItem(nameKeysField, storageWallets);
        } else if (storageWallets) {
            if (!storageWallets[nameKeysField]) {
                storageWallets[nameKeysField] = [];
            }
            storageWallets[nameKeysField].push(value);
            storageService.setItem(nameUserField, storageWallets);
        } else {
            storageService.setItem(nameKeysField, [value]);
        }
    }

    /**
     * @description Removing last private key from array in localstorage
     * @param storageWallets {object | array} optional. Object wallet contained in storage
     * @param storageService {object} optional. Object work with any storage
     */
    removeLastWalletFromStorage(
        storageWallets: WalletEncrypt[] | User = this.getWalletsInStorage(),
        storageService = LocalStorageMethods): void {
        if (!this.isWalletsInStorage(storageWallets)) return;
        if (Array.isArray(storageWallets)) {
            storageWallets.pop();
            storageService.setItem(nameKeysField, storageWallets);
        } else {
            storageWallets[nameKeysField].pop();
            storageService.setItem(nameUserField, storageWallets);
        }
    }

    /**
     * @description Clear array of private keys (delete key from localstorage
     * @param storageWallets {object | array} Object wallet contained in storage)
     * @param storageService {object} Object work with any storage
     */
    public clearWalletStorage(
        storageWallets: WalletEncrypt[] | User = this.getWalletsInStorage(),
        storageService = LocalStorageMethods): void {
        if (Array.isArray(storageWallets)) {
            storageService.removeItem(nameKeysField);
        } else {
            delete storageWallets[nameKeysField];
            storageService.setItem(nameUserField, storageWallets);
        }
    }

    /**
     * @description Returns active private key in localstorage
     * @returns {string} Active private key or null if no array
     * @param Wallets {array} optional. Array wallets contained in storage
     */
    public getActiveWalletFromStorage(Wallets: WalletEncrypt[] = this.getWalletsListFromStorage()): WalletEncrypt {
        return Wallets ? Wallets.pop() : null;
    }

    /**
     * @description Returns array of string contains all private keys from localstorage
     * @param storageWallets {object | array} optional. Object wallet contained in storage
     * @return {string[]} Array of private keys or null if no array
     */
    public getWalletsListFromStorage(storageWallets: WalletEncrypt[] | User = this.getWalletsInStorage()): WalletEncrypt[] {
        if (!this.isWalletsInStorage(storageWallets)) return null;
        if (Array.isArray(storageWallets)) {
            return storageWallets;
        } else if (storageWallets) {
            return storageWallets[nameKeysField];
        } else return null;
    }

    /**
     * @description  Check if there are keys in vault
     * @return {boolean} True if there is, false is not
     * @param storageWallets {object}  optional. User in storage, if it there is
     */
    public isWalletsInStorage(storageWallets: WalletEncrypt[] | User = this.getWalletsInStorage()): boolean {
        if (!storageWallets) return false;
        if (Array.isArray(storageWallets)) {
            if (!!!storageWallets.length) return false;
        } else {
            if (!storageWallets[nameKeysField] || !!!storageWallets[nameKeysField].length) return false;
        }
        return true;
    }

    private getWalletsInStorage(storageService = LocalStorageMethods): WalletEncrypt[] | User {
        const userKeys = storageService.getItem(nameUserField),
            Wallets = storageService.getItem(nameKeysField) ? storageService.getItem(nameKeysField) : null;
        return userKeys ? userKeys : Wallets;
    }

    getTrezorHash(msg) {
        return EthJS.sha3(
            Buffer.concat([
                EthJS.toBuffer('\u0019Ethereum Signed Message:\n'),
                AccessoryFunctions.getTrezorLenBuf(msg.length),
                EthJS.toBuffer(msg)
            ])
        );
    };
}

/*
*
* Local storage methods
*
* */
class LocalStorageMethods {
    static setItem(key: string, value: any): void {
        if (!localStorage) throw new Error('Does not localstorage in global');
        localStorage.setItem(key, JSON.stringify(value));
    }

    static getItem(key: string): any {
        if (!localStorage) throw new Error('Does not localstorage in global');
        return JSON.parse(localStorage.getItem(key));
    }

    static removeItem(key: string): void {
        if (!localStorage) throw new Error('Does not localstorage in global');
        localStorage.removeItem(key);
    }

    static clear(): void {
        if (!localStorage) throw new Error('Does not localstorage in global');
        localStorage.clear();
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
    defaultGasLimit: 1500000;
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

    static getRandomIntInclusive(rnd: number, min: number, max: number): number {
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
            let s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
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



