let Buffer = require('buffer').Buffer;

/**
 * @class Sp8deClientSDK
 * @constructor
 * */
export class Sp8deClientSDK {
    constructor(eth = undefined, privateKeyGenerator = undefined) {
        this.EthJS = !eth ? window.EthJS.Util : eth;
        this.privateKeyGenerator = !privateKeyGenerator ? window.ethers : privateKeyGenerator;
    }

    /**
     * @description Returns new private key
     * @memberOf Sp8deClientSDK
     * @return {number} Array contains random numbers
     * */
    generatePrivateKey() {
        return this.privateKeyGenerator.Wallet.createRandom().privateKey;
    };

    /**
     * @description Returns public key for private key
     * @memberOf Sp8deClientSDK
     * @param {string} privateKey - private key
     * @return {string} Public key
     * */
    getPubKey(privateKey) {
        if (!privateKey) {
            console.error('Invalid parameter');
            return;
        }
        return this.EthJS.addHexPrefix(this.EthJS.privateToAddress(privateKey).toString('hex'))
    };

    /**
     * @description Returns an array of random numbers from seed-array (use mt19937 algorithm)
     * @memberOf Sp8deClientSDK
     * @param {object} parameters - {array: [], min: number, max: number, count: number}
     * @return {number[]} Array contains random numbers
     * */
    getRandomFromArray(parameters) {
        let rand = new mt19937(),
            result = [];
        if (parameters.array === undefined ||
            !Array.isArray(parameters.array) ||
            parameters.min === undefined ||
            parameters.max === undefined) {
            console.error('Invalid parameters');
            return;
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
     * @return {number} Random seed
     * */
    generateSeed() {
        let rnd = new Uint32Array(1);
        window.crypto.getRandomValues(rnd);
        return rnd[0];
    };

    /**
     * @description Signs a message from privateKey, seed, nonce. Returns message signed with private key
     * @memberOf Sp8deClientSDK
     * @param {object} parameters - {privateKey: string, seed: number, nonce: number}
     * @return {string} Message signed with private key
     * */
    signMessage(parameters) {
        //
        if (parameters.privateKey === undefined ||
            parameters.seed === undefined ||
            parameters.nonce === undefined) {
            console.error('Invalid parameters', parameters);
            return null;
        }
        let pubKey = this.getPubKey(parameters.privateKey),
            message = `${pubKey};${parameters.seed};${parameters.nonce}`,
            msg = this.EthJS.hashPersonalMessage(this.EthJS.toBuffer(message)),
            signed = this.EthJS.ecsign(msg, this.EthJS.toBuffer(parameters.privateKey)),
            tx = signed.r.toString('hex') + signed.s.toString('hex') + this.EthJS.stripHexPrefix(this.EthJS.intToHex(signed.v));
        return this.EthJS.addHexPrefix(tx);
    };

    /**
     * @description Validates the message. Use sign, nonce, public key and seed. Returns true if the validation was successful.
     * @memberOf Sp8deClientSDK
     * @param {object} parameters - {sign: string, pubKey: string, seed: number, nonce: number}
     * @return {boolean} True if successful, false if unsuccessful
     * */
    validateSign(parameters) {
        let hash, msg, newPubKey;
        try {
            if (!parameters.sign) throw new TypeError('Empty parameters.sign');
            if (parameters.sign.length % 2 !== 0) throw new TypeError('Invalid hex string');
            parameters.sign = Buffer.from(AccessoryFunctions.getNakedAddress(parameters.sign), 'hex');
            if (parameters.sign.length !== 65) throw new TypeError('parameters.sign length is not valid');
            parameters.sign[64] = parameters.sign[64] === 0 || parameters.sign[64] === 1 ? parameters.sign[64] + 27 : parameters.sign[64];
            msg = `${parameters.pubKey.toLowerCase()};${parameters.seed};${parameters.nonce}`;
            hash = this.EthJS.hashPersonalMessage(this.EthJS.toBuffer(msg));

            newPubKey = this.EthJS.ecrecover(
                hash,
                parameters.sign[64],
                parameters.sign.slice(0, 32),
                parameters.sign.slice(32, 64)
            );
            if (AccessoryFunctions.getNakedAddress(parameters.pubKey) !== this.EthJS.pubToAddress(newPubKey).toString('hex')) {
                throw new TypeError('parameters.sign is not valid');
            }
        } catch (e) {
            if (e instanceof SyntaxError) console.error('JSON is not valid');
            else console.error(e);
            return false;
        }
        return true;
    };

    getTrezorHash(msg) {
        return this.EthJS.sha3(
            Buffer.concat([
                this.EthJS.toBuffer('\u0019Ethereum Signed Message:\n'),
                AccessoryFunctions.getTrezorLenBuf(msg.length),
                this.EthJS.toBuffer(msg)
            ])
        );
    };
}

/*
*
* Accessory functions for methods
*
* */
class AccessoryFunctions {
    static getNakedAddress(address) {
        return address.toLowerCase().replace('0x', '');
    };

    static getTrezorLenBuf(msgLen) {
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

    static getRandomIntInclusive(rnd, min, max) {
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
    constructor(seed) {
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
        var i, j, k;
        this.init_genrand(19650218);
        i = 1;
        j = 0;
        k = (this.N > key_length ? this.N : key_length);
        for (; k; k--) {
            var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
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
    }

    random() {
        return this.genrand_int32() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    }

    genrand_int32() {
        var y;
        var mag01 = new Array(0x0, this.MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (this.mti >= this.N) { /* generate N words at one time */
            var kk;

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



