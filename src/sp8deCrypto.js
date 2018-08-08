let Buffer = require('buffer').Buffer;

export class Sp8deCrypto {
    constructor(eth = undefined, privateKeyGenerator = undefined) {
        this.EthJS = !eth ? window.EthJS.Util : eth;
        this.privateKeyGenerator = !privateKeyGenerator ? window.ethers : privateKeyGenerator;
    }

    signMessage(privateKey, seed, nonce) {
        //
        if (privateKey === undefined ||
            seed === undefined ||
            nonce === undefined) {
            console.error('Invalid parameters');
            return null;
        }
        let pubKey = this.getPubKey(privateKey),
            message = `${pubKey};${seed};${nonce}`,
            msg = this.EthJS.hashPersonalMessage(this.EthJS.toBuffer(message)),
            signed = this.EthJS.ecsign(msg, this.EthJS.toBuffer(privateKey)),
            tx = signed.r.toString('hex') + signed.s.toString('hex') + this.EthJS.stripHexPrefix(this.EthJS.intToHex(signed.v));
        return {
            pubKey: pubKey,
            message: message,
            sign: this.EthJS.addHexPrefix(tx),
            version: '3',
            signer: 'MEW'
        };
    };

    getPubKey(privateKey) {
        if (!privateKey) {
            console.error('Invalid parameter');
            return;
        }
        return this.EthJS.addHexPrefix(this.EthJS.privateToAddress(privateKey).toString('hex'))
    };

    getRandomFromArray(array, min, max, count) {
        let rand = new mt19937(),
            result = [];
        if (array === undefined ||
            !Array.isArray(array) ||
            min === undefined ||
            max === undefined) {
            console.error('Invalid parameters');
            return;
        }
        rand.init_by_array(array, array.length);
        for (let i = 0; i < count; i++) {
            result.push(this.getRandomIntInclusive(rand.random(), min, max))
        }
        return result;
    };

    getRandomIntInclusive(rnd, min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(rnd * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    };

    generateSeed() {
        let rnd = new Uint32Array(1);
        window.crypto.getRandomValues(rnd);
        return rnd[0];
    };

    generatePrivateKey() {
        return this.privateKeyGenerator.Wallet.createRandom().privateKey;
    };

    validateOld(signedMessage) {
        let item, hash, sign, pubKey;

        try {
            if (!signedMessage) throw new TypeError('Please enter signed message');
            item = typeof item === 'string' ? JSON.parse(signedMessage) : signedMessage;
            if (!item.sign) throw new TypeError('Empty sign');
            if (item.sign.length % 2 !== 0) throw new TypeError('Invalid hex string');
            sign = Buffer.from(this.getNakedAddress(item.sign), 'hex');
            if (sign.length !== 65) throw new TypeError('sign length is not valid');
            sign[64] = sign[64] === 0 || sign[64] === 1 ? sign[64] + 27 : sign[64];
            hash = this.EthJS.hashPersonalMessage(this.EthJS.toBuffer(item.message));

            if (item.version === '3') {
                if (item.signer === 'trezor') {
                    hash = this.getTrezorHash(item.message);
                } else if (item.signer === 'ledger') {
                    hash = this.EthJS.hashPersonalMessage(Buffer.from(item.message));
                }
            } else if (item.version === '1') {
                hash = this.EthJS.sha3(item.message);
            }

            pubKey = this.EthJS.ecrecover(
                hash,
                sign[64],
                sign.slice(0, 32),
                sign.slice(32, 64)
            );

            if (this.getNakedAddress(item.pubKey) !== this.EthJS.pubToAddress(pubKey).toString('hex')) {
                throw new TypeError('sign is not valid');
            }
        } catch (e) {
            if (e instanceof SyntaxError) console.error('JSON is not valid');
            else console.error(e);
            return false;
        }
        return true;
    };

    validate(parameters) {
        let hash, msg, newPubKey;

        try {
            if (!parameters.sign) throw new TypeError('Empty parameters.sign');
            if (parameters.sign.length % 2 !== 0) throw new TypeError('Invalid hex string');
            parameters.sign = Buffer.from(this.getNakedAddress(parameters.sign), 'hex');
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
            if (this.getNakedAddress(parameters.pubKey) !== this.EthJS.pubToAddress(newPubKey).toString('hex')) {
                throw new TypeError('parameters.sign is not valid');
            }
        } catch (e) {
            if (e instanceof SyntaxError) console.error('JSON is not valid');
            else console.error(e);
            return false;
        }
        return true;
    };

    getNakedAddress(address) {
        return address.toLowerCase().replace('0x', '');
    };

    getTrezorLenBuf(msgLen) {
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

    getTrezorHash(msg) {
        return this.EthJS.sha3(
            Buffer.concat([
                this.EthJS.toBuffer('\u0019Ethereum Signed Message:\n'),
                this.getTrezorLenBuf(msg.length),
                this.EthJS.toBuffer(msg)
            ])
        );
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



