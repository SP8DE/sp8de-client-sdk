describe('Test library', function () {
    let Sp8de = require('../cdn/script'),
        sp8de = new Sp8de.Methods();
    describe("Create library", function () {
        it("Should be create object", function () {
            expect(sp8de).toBeDefined();
        });
    });
    describe("Generating seed", function () {
        it("Method generateSeed() should be defined", function () {
            expect(sp8de.generateSeed).toBeDefined();
        });
        it("Method generateSeed() should be return number", function () {
            expect(typeof sp8de.generateSeed()).toBe('number');
        });
        it("Method generateSeed() should be returns different numbers", function () {
            expect(sp8de.generateSeed() === sp8de.generateSeed()).toBeFalsy();
        });
    });
    describe("Getting random from array", function () {
        it("Method getRandomFromArray() should be defined", function () {
            expect(sp8de.getRandomFromArray).toBeDefined();
        });
        it("Method getRandomFromArray() should return array", function () {
            expect(Array.isArray(sp8de.getRandomFromArray({array: [1, 2, 3], min: 1, max: 6, count: 1}))).toBeTruthy();
        });
        it("Method getRandomFromArray() should return array length 3 for argument count 3", function () {
            expect(sp8de.getRandomFromArray({array: [1, 2, 3], min: 1, max: 6, count: 3}).length).toEqual(3);
        });
        it("Method getRandomFromArray() should return [4, 3, 6, 4, 3, 5, 6, 3, 1, 4] for [1,2,3],1,6,10", function () {
            expect(sp8de.getRandomFromArray({
                array: [1, 2, 3],
                min: 1,
                max: 6,
                count: 10
            })).toEqual([4, 3, 6, 4, 3, 5, 6, 3, 1, 4]);
        });
        it("Method getRandomFromArray() should return [240, 578, 41, 464, 688, 356, 660, 718, 830, 541] for [123,234,345],1,1000,10", function () {
            expect(sp8de.getRandomFromArray({
                array: [123, 234, 345],
                min: 1,
                max: 1000,
                count: 10
            })).toEqual([240, 578, 41, 464, 688, 356, 660, 718, 830, 541]);
        });
        it("Method getRandomFromArray() should return [350656, 927543, 685405, 591919, 518806, 178110, 384468, 666897, 987795, 198067] for [314134,34134143,13413413,1346756,168478,123,6,9,234,34589,123], 1, 1000000, 10", function () {
            expect(sp8de.getRandomFromArray({
                array: [314134, 34134143, 13413413, 1346756, 168478, 123, 6, 9, 234, 34589, 123],
                min: 1,
                max: 1000000,
                count: 10
            })).toEqual([350656, 927543, 685405, 591919, 518806, 178110, 384468, 666897, 987795, 198067]);
        });
    });
    describe("Generating keys", function () {
        it("Method generatePrivateKey() should be defined", function () {
            expect(sp8de.generatePrivateKey).toBeDefined();
        });
        it("Method generatePrivateKey() should be return string 66 length", function () {
            let key = sp8de.generatePrivateKey()
            expect(typeof key).toEqual('string');
            expect(key.length).toEqual(66);
        });
        it("Method getPubKey() should be defined", function () {
            expect(sp8de.getPubKey).toBeDefined();
        });
        it("Method getPubKey() should be return string 42 length", function () {
            let privateKey = sp8de.generatePrivateKey(),
                pubKey = sp8de.getPubKey(privateKey);
            expect(typeof pubKey).toEqual('string');
            expect(pubKey.length).toEqual(42);
        });
        it("Method getPubKey() should be return 0x6d01515cb94ae0f03c324138cf35df944a01a6c8 for 0xd9a5e808bc4e2d420aa16bc9069972a9f1ddaec7d2ee10021ae3ad9a899cd0ce", function () {
            let privateKey = '0xd9a5e808bc4e2d420aa16bc9069972a9f1ddaec7d2ee10021ae3ad9a899cd0ce';
            expect(sp8de.getPubKey(privateKey)).toEqual('0x6d01515cb94ae0f03c324138cf35df944a01a6c8');
        });

    });
    describe("Signing message", function () {
        let privateKey = sp8de.generatePrivateKey();
        it("Signing  method should be defined", function () {
            expect(sp8de.signMessage).toBeDefined();
        });
        it("Should be return string", function () {
            expect(typeof sp8de.signMessage({
                privateKey: privateKey,
                seed: 1,
                nonce: 1
            })).toEqual('string');
        });
        it("Sign for 0xd9a5e808bc4e2d420aa16bc9069972a9f1ddaec7d2ee10021ae3ad9a899cd0ce,1,1 should be return sign 0x0e3bda0512370a303d9e14921b398d33e4f2eeb934958eea79360ad9e45ccf217d674852126f2978f779ac3f6bfe23190919b949e9e7ca62d4fc1fb3cb968ab31b", function () {
            let privateKey = "0xd9a5e808bc4e2d420aa16bc9069972a9f1ddaec7d2ee10021ae3ad9a899cd0ce";
            expect(sp8de.signMessage({
                privateKey: privateKey,
                seed: 1,
                nonce: 1
            })).toEqual("0x0e3bda0512370a303d9e14921b398d33e4f2eeb934958eea79360ad9e45ccf217d674852126f2978f779ac3f6bfe23190919b949e9e7ca62d4fc1fb3cb968ab31b");
        });
    });
    describe("Validating", function () {
        it("Validate method to be defined", function () {
            expect(sp8de.validateSign).toBeDefined();
        });
        it("Should be Validate signed message", function () {
            expect(sp8de.validateSign({
                sign: '0x70613377916f67008e948aec77ac2aa846833d01049fc270a5fb2e0974bd3a2455947d8e5684d745e5e1b9c36f65a30d444fbba5009e0ccdeb4621413b03d8f31b',
                pubKey: '0x492d0fd814940d1375225a7e10905585b72b0a8c',
                seed: 1,
                nonce: 1
            })).toBe(true);
        });
        it("Should be Validate incorrect message", function () {
            expect(sp8de.validateSign({
                sign: '0x70613377916f67008e948aec77ac2aa846833d01049fc270a5fb2e0974bd3a2455947d8e5684d745e5e1b9c36f65a30d444fbba5009e0ccdeb4621413b03d8f31b',
                pubKey: '0x492d0fd814440d1375225a7e10905585b72b0a8c',
                seed: 1,
                nonce: 1
            })).toBeFalsy();
        });
        it("Should be Generate privateKey, sign, seed and validate signed message", function () {
            let privateKey = sp8de.generatePrivateKey(),
                pubKey = sp8de.getPubKey(privateKey),
                seed = sp8de.generateSeed(),
                sign = sp8de.signMessage({privateKey: privateKey, seed: seed, nonce: 1});
            expect(sp8de.validateSign({
                sign: sign,
                pubKey: pubKey,
                seed: seed,
                nonce: 1
            })).toBe(true);
        });
    });
});
