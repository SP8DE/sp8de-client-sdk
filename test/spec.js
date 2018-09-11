describe('Test library', function () {
    let Sp8de = require('../src/sp8deClientSDK'),
        password = '1234',
        sp8de = new Sp8de.Sp8deClientSDK();
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
        it("Method splitIntoPieces() should be defined", function () {
            expect(sp8de.splitIntoPieces).toBeDefined();
        });
        it("Method splitIntoPieces() should be return array splitting for count pieces", function () {
            let _in = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                out = [[1, 2], [3, 4], [5, 6], [7, 8], [9, 10]];
            expect(sp8de.splitIntoPieces(_in, 2)).toEqual(out);
            _in = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
            out = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11, 12]];
            expect(sp8de.splitIntoPieces(_in, 3)).toEqual(out);
            _in = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            out = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10, 11]];
            expect(sp8de.splitIntoPieces(_in, 3)).toEqual(out);
            _in = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            out = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11]];
            expect(sp8de.splitIntoPieces(_in, 4)).toEqual(out);
            _in = [1, 2, 3];
            out = [[1], [2], [3]];
            expect(sp8de.splitIntoPieces(_in, 1)).toEqual(out);
            _in = [0, 0, 0];
            out = [[0], [0], [0]];
            expect(sp8de.splitIntoPieces(_in, 1)).toEqual(out);
            _in = [0, 0, 0, 0];
            out = [[0, 0], [0, 0]];
            expect(sp8de.splitIntoPieces(_in, 2)).toEqual(out);
            _in = [0, 0, 0, 0];
            out = [[0, 0, 0, 0]];
            expect(sp8de.splitIntoPieces(_in, 4)).toEqual(out);
            _in = [];
            out = [];
            expect(sp8de.splitIntoPieces(_in, 3)).toEqual(out);
        });
        it("Method generateArraySeed() should be defined", function () {
            expect(sp8de.generateArraySeed).toBeDefined();
        });
        it("Method generateArraySeed() should be return array", function () {
            expect(Array.isArray(sp8de.generateArraySeed(['test', 'test', 'test']))).toBeTruthy();
        });
        it("Method generateArraySeed() should be return array of 12 random numbers", function () {
            const seeds = [
                    '1948679508',
                    '-4721854150932553650',
                    '3486951862276399275'
                ],
                arraySeeds = sp8de.generateArraySeed(seeds),
                result = [
                    1602747949, 2909659892, 2763519977, 521142622, 2230361066, 2077001076, 23919704, 2817432661, 286186190, 418311551, 2284273299, 3162727144
                ];
            expect(arraySeeds).toEqual(result);
        });
        it("Method generateArraySeed() should be work on empty vals", function () {
            const seeds = [
                    '',
                    '',
                    ''
                ],
                arraySeeds = sp8de.generateArraySeed(seeds);
            expect(arraySeeds.length).toBe(12);
        });
        it("Method generateArraySeed() should be work on nulls", function () {
            const seeds = [
                    '0',
                    '0',
                    '0'
                ],
                arraySeeds = sp8de.generateArraySeed(seeds);
            expect(arraySeeds.length).toBe(12);
        });
        it("Method generateArraySeed() should be work on large string", function () {
            const seeds = [
                    'djfkasdfhlasdfybo87398w7d7nf978xn3e9ad9padsfae8fasfdouasoidfyas97cd9zuidfhasod87fya9sd7fasdfhalsdfy9asd7fa78sdfouyq3h94fwe8afp0an8pdfo',
                    'djfkasdfhlasdfybo87398w7d7nf978xn3e9ad9padsfae8fasfdouasoidfyas97cd9zuidfhasod87fya9sd7fasdfhalsdfy9asd7fa78sdfouyq3h94fwe8afp0an8pdfo',
                    'djfkasdfhlasdfybo87398w7d7nf978xn3e9ad9padsfae8fasfdouasoidfyas97cd9zuidfhasod87fya9sd7fasdfhalsdfy9asd7fa78sdfouyq3h94fwe8afp0an8pdfo'
                ],
                arraySeeds = sp8de.generateArraySeed(seeds);
            console.log(arraySeeds)
            expect(arraySeeds.length).toBe(12);
        });
        it("Method generateArraySeed() should be work on large number", function () {
            const seeds = [
                    '2131237609634971634971634869134673496912364816348632482374234273496273462634929416036491736481634538468723642347927349872349872934',
                    '2131237609634971634971634869134673496912364816348632482374234273496273462634929416036491736481634538468723642347927349872349872934',
                    '2131237609634971634971634869134673496912364816348632482374234273496273462634929416036491736481634538468723642347927349872349872934'
                ],
                arraySeeds = sp8de.generateArraySeed(seeds);
            console.log(arraySeeds)
            expect(arraySeeds.length).toBe(12);
        });
        it("Method generateArraySeed() should be work on different seeds", function () {
            for (let i = 0; i < 10; i++) {
                const seeds = [
                    sp8de.generateSeed(),
                    sp8de.generateSeed(),
                    sp8de.generateSeed()
                ];
                const arraySeeds = sp8de.generateArraySeed(seeds);
                expect(arraySeeds.length).toBe(12);
            }
        });
        it("Method toUint8() should be defined", function () {
            expect(sp8de.toUint8).toBeDefined();
        });
        it("Method toUint8() should be return ArrayBuffer", function () {
            const arrayBuffer = new Uint8Array([1, 2, 3, 4]);
            expect(sp8de.toUint8([1, 2, 3, 4])).toEqual(arrayBuffer);
        });
        it("Method toUint32() should be defined", function () {
            expect(sp8de.toUint32).toBeDefined();
        });
        it("Method toUint32() should be return ArrayBuffer", function () {
            const arrayBuffer = new Uint8Array([72, 187, 184, 216]),
                uint32 = 1220262104;
            expect(sp8de.toUint32(arrayBuffer)).toBe(uint32);
        });
        it("Method toUint32() should be return ArrayBuffer", function () {
            const arrayBuffer = new Uint8Array([240, 29, 111, 100]),
                uint32 = 4028460900;
            expect(sp8de.toUint32(arrayBuffer)).toBe(uint32);
        });
        it("Method generateArrayFromHash() should be defined", function () {
            expect(sp8de.generateArrayFromHash).toBeDefined();
        });
        it("Method generateArrayFromHash() should be return array", function () {
            expect(Array.isArray(sp8de.generateArrayFromHash([1, 2, 3, 4]))).toBeTruthy();
        });
        it("Method generateArrayFromHash() should be return seed array from hash", function () {
            const Uint8 = [
                    72, 187, 184, 216, 240, 29, 111, 100, 170, 218, 20, 233, 53, 185, 113, 20, 218, 216, 192, 195, 163, 68, 47, 229, 174, 175, 149, 231, 224, 82, 99, 109, 158, 16, 151, 228, 95, 231, 242, 143, 26, 117, 236, 146, 254, 223, 36, 3
                ],
                Uint32LittleEndian = [3635985224, 1685003760, 3910458026, 342997301, 3284195546, 3845080227, 3885346734, 1835225824, 3835105438, 2415060831, 2464970010, 52748286],
                Uint32BigEndian = [1220262104, 4028460900, 2866418921, 901345556, 3671638211, 2739154917, 2930742759, 3763495789, 2651887588, 1609036431, 443935890, 4276036611];
            expect(sp8de.generateArrayFromHash(Uint8)).toEqual(Uint32BigEndian);
        });
        it("Method generateArrayFromHash() should be return seed array from generated hash", function () {
            const signs = [
                    "1948679508",
                    "4721854150932553650",
                    "3486951862276399275"
                ],
                hash = sp8de.getHash(signs.join(';')),
                Uint32BigEndian = [
                    422709730, 3560842529, 4044257916, 650168960, 431175787, 361202436, 3456054972, 22364493, 1850781193, 4210683086, 4281363041, 4002243109
                ];
            expect(sp8de.generateArrayFromHash(hash)).toEqual(Uint32BigEndian);
        });
        it("Method generateArrayFromHash() should be return seed array from generated hash", function () {
            const signs = [
                    sp8de.generateSeed(),
                    sp8de.generateSeed(),
                    sp8de.generateSeed()
                ],
                hash = sp8de.getHash(signs.join(';'));
            expect(sp8de.generateArrayFromHash(hash).length).toBe(12);
        });
        it("Method getHash() should be defined", function () {
            expect(sp8de.getHash).toBeDefined();
        });
        it("Method getHash() should be return object", function () {
            expect(typeof sp8de.getHash('test')).toBe('object');
        });
        it("Method getHash() should be return hash for 3 signs", function () {
            const seeds = [
                '1948679508',
                '-4721854150932553650',
                '3486951862276399275'
            ];
            expect(sp8de.getHash(seeds.join(';')).toString('hex')).toBe("5f87fe2dad6de2f4a4b7f7e91f10015e84f09bea7bcc8574016cfc58a7ee9c55110edace18eeed7f88273e93bc8362e8");
        });
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
        it("Should be Validate signed message 2", function () {
            let nonce = '636706264009882196';
            expect(sp8de.validateSign({
                sign: '0x8d4e5ad58bdcfd38a17c6cb64f0186e0f1df79eb24791191f19a5e0097f7cb017643c09166f467adf177afbca74d2b94f246f718a50ba8e9131fab02262bb2e11b',
                pubKey: '0x492d0fd814940d1375225a7e10905585b72b0a8c',
                seed: '-3346769847729876904',
                nonce: '636706264009882196'
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
                nonce = sp8de.generateSeed(),
                sign = sp8de.signMessage({privateKey: privateKey, seed: seed, nonce: nonce});
            expect(sp8de.validateSign({
                sign: sign,
                pubKey: pubKey,
                seed: seed,
                nonce: nonce
            })).toBe(true);
        });
    });
    describe("Local storage", function () {
        let nameField = 'Wallets';
        describe("Add", function () {
            it("addWalletToStorage method to be defined", function () {
                expect(sp8de.addWalletToStorage).toBeDefined();
            });
            it("addWalletToStorage should be added 100 keys", function () {
                const count = 100;
                for (let i = 0; i < count; i++) {
                    sp8de.addWalletToStorage('0xd9a5e808bc4e2d420aa16bc9069972a9f1ddaec7d2ee10021ae3ad9a899cd0ce');
                }
                expect(JSON.parse(localStorage.getItem(nameField)).length).toBe(count);
                localStorage.clear();
            });
            it("addWalletToStorage() should be add private key to storage", function () {
                let key = '1234';
                sp8de.addWalletToStorage(key);
                expect(JSON.parse(localStorage.getItem(nameField)).pop()).toEqual(key);
                localStorage.clear();
            });
            it("addWalletToStorage() should be add private key to storage with user", function () {
                let key = '1234';
                localStorage.setItem('user', JSON.stringify({name: 'name'}));
                sp8de.addWalletToStorage(key);
                expect(JSON.parse(localStorage.getItem('user')).Wallets.pop()).toEqual(key);
                localStorage.clear();
            });
            it("addWalletToWallets() should be add private key to wallets", function () {
                let key = '1234';
                sp8de.addWalletToWallets(key);
                expect(JSON.parse(localStorage.getItem(nameField)).pop()).toEqual(key);
                localStorage.clear();
            });
            it("addWalletToWallets() should be add private key to wallets with empty wallets", function () {
                let key = '1234';
                sp8de.addWalletToWallets(key);
                expect(JSON.parse(localStorage.getItem(nameField)).pop()).toEqual(key);
                localStorage.clear();
            });
            it("addWalletToUser() should be add private key to user", function () {
                let user = {name: 'name', Wallets: []},
                    key = '1234';
                localStorage.setItem('user', JSON.stringify(user));
                sp8de.addWalletToUser(key, user);
                expect(JSON.parse(localStorage.getItem('user')).Wallets.pop()).toEqual(key);
                localStorage.clear();
            });
            it("addWalletToUser() should be add private key to user with empty wallets", function () {
                let user = {name: 'name', Wallets: []},
                    key = '1234';
                localStorage.setItem('user', JSON.stringify(user));
                sp8de.addWalletToUser(key, user);
                expect(JSON.parse(localStorage.getItem('user')).Wallets.pop()).toEqual(key);
                localStorage.clear();
            });
            it("addWalletToArray() should be return array with add value", function () {
                let key = '1234',
                    array = [1, 2, 3];
                array = sp8de.addWalletToArray(key, array);
                expect(array.pop()).toBe(key);
                array = sp8de.addWalletToArray(key);
                expect(array).toEqual([key]);
                expect(array.pop()).toBe(key);
            });
        });
        describe("Remove", function () {
            it("removeLastWalletFromStorage method to be defined", function () {
                expect(sp8de.removeLastWalletFromStorage).toBeDefined();
            });
            it("clearWalletStorage method to be defined", function () {
                expect(sp8de.clearWalletStorage).toBeDefined();
            });
            it("removeLastWalletFromStorage() should be remove last private key from storage", function () {
                let keyFirst = '1234',
                    keySecond = '4321';
                sp8de.addWalletToStorage(keyFirst);
                sp8de.addWalletToStorage(keySecond);
                sp8de.removeLastWalletFromStorage();
                expect(JSON.parse(localStorage.getItem(nameField)).pop()).toEqual(keyFirst);
                localStorage.clear();
            });
            it("clearWalletStorage() should be clear all array of private keys", function () {
                let keyFirst = '1234',
                    keySecond = '4321',
                    user = {name: 'name', Wallets: [1, 2, 3, 4]};
                sp8de.addWalletToStorage(keyFirst);
                sp8de.clearWalletStorage();
                expect(JSON.parse(localStorage.getItem(nameField))).toEqual([]);
                localStorage.setItem('user', JSON.stringify(user));
                sp8de.clearWalletStorage();
                expect(JSON.parse(localStorage.getItem('user')).Wallets).toEqual([]);
                localStorage.clear();
            });
            it("clearStorageFromUser() should be clear all array of private keys in user object", function () {
                let user = {name: 'name', Wallets: [1, 2, 3, 4]};
                localStorage.setItem('user', JSON.stringify(user));
                sp8de.clearWalletStorage();
                expect(JSON.parse(localStorage.getItem('user')).Wallets).toEqual([]);
                localStorage.clear();
            });
            it("clearStorageFromWallets() should be remove all array of wallets", function () {
                let keyFirst = '1234';
                sp8de.addWalletToStorage(keyFirst);
                sp8de.clearWalletStorage();
                expect(JSON.parse(localStorage.getItem(nameField))).toEqual([]);
                localStorage.clear();
            });
            it("removeLastWalletFromStorage() should be return if Wallets empty or undefined", function () {
                let user = {name: 'name'};
                localStorage.setItem('user', JSON.stringify(user));
                sp8de.removeLastWalletFromStorage();
                expect(JSON.parse(localStorage.getItem('user'))).toEqual(user);
                user = {name: 'name', Wallets: []};
                localStorage.setItem('user', JSON.stringify(user));
                sp8de.removeLastWalletFromStorage();
                expect(JSON.parse(localStorage.getItem('user'))).toEqual(user);
                localStorage.clear();
                localStorage.setItem(nameField, JSON.stringify([]));
                sp8de.removeLastWalletFromStorage();
                expect(JSON.parse(localStorage.getItem(nameField))).toEqual([]);
            });
            it("removeLastWalletFromStorage() should be remove last private key from storage with user", function () {
                let keyFirst = '1234',
                    keySecond = '4321';
                localStorage.setItem('user', JSON.stringify({name: 'name'}));
                sp8de.addWalletToStorage(keyFirst);
                sp8de.addWalletToStorage(keySecond);
                sp8de.removeLastWalletFromStorage();
                expect(JSON.parse(localStorage.getItem('user')).Wallets.pop()).toEqual(keyFirst);
                localStorage.clear();
            });
            it("removeLastItemAndStore should be remove last item from array and store to the storage", () => {
                let arr = [1, 2, 3];
                sp8de.removeLastItemAndStore(arr, 'test', arr);
                expect(JSON.parse(localStorage.getItem('test'))).toEqual(arr);
                localStorage.clear();
                let arr2 = [1, 2, 3];
                sp8de.removeLastItemAndStore(arr2, 'test');
                expect(JSON.parse(localStorage.getItem('test'))).toEqual(arr2);
                localStorage.clear();
            })
        });
        describe("Get", function () {
            it("getActiveWalletFromStorage method to be defined", function () {
                expect(sp8de.getActiveWalletFromStorage).toBeDefined();
            });
            it("getActiveWalletFromStorage() should be get active private key from storage", function () {
                let keyFirst = '1234',
                    keySecond = '4321';
                sp8de.addWalletToStorage(keyFirst);
                sp8de.addWalletToStorage(keySecond);
                expect(sp8de.getActiveWalletFromStorage()).toEqual(keySecond);
                localStorage.clear();
            });
            it("getActiveWalletFromStorage() should be get active private key from storage with user", function () {
                let user = {name: 'name'},
                    key = '1234';
                localStorage.setItem('user', JSON.stringify(user));
                sp8de.addWalletToStorage(key);
                expect(sp8de.getActiveWalletFromStorage()).toEqual(key);
                localStorage.clear();
            });
            it("getActiveWalletFromStorage() should be return NULL if Wallets empty or undefined", function () {
                let user = {name: 'name'};
                expect(sp8de.getActiveWalletFromStorage()).toBeNull();
                localStorage.setItem('user', JSON.stringify(user));
                expect(sp8de.getActiveWalletFromStorage()).toBeNull();
                user = {name: 'name', Wallets: []};
                localStorage.setItem('user', JSON.stringify(user));
                expect(sp8de.getActiveWalletFromStorage()).toBeNull();
                localStorage.clear();
                localStorage.setItem(nameField, JSON.stringify([]));
                expect(sp8de.getActiveWalletFromStorage()).toBeNull();
                localStorage.clear();
            });
            it("getWalletsListFromsxsStorage method to be defined", function () {
                expect(sp8de.getWalletsListFromStorage()).toBeDefined();
            });
            it("getWalletsListFromStorage() should be get array of added private keys", function () {
                let keys = ['1234', '4321', '5678', '8765'];
                for (let i = 0; i < keys.length; i++) {
                    sp8de.addWalletToStorage(keys[i]);
                }
                expect(sp8de.getWalletsListFromStorage()).toEqual(keys);
                localStorage.clear();
            });
            it("getListFromWallets() should return wallets from parameters", function () {
                let wallets = ['1234', '4321', '5678', '8765'];
                expect(sp8de.getListFromWallets(wallets)).toBe(wallets);
            });
            it("getListFromUser() should return wallets from parameters user", function () {
                let wallets = ['1234', '4321', '5678', '8765'],
                    user = {name: 'name', Wallets: wallets};
                expect(sp8de.getListFromUser(user)).toBe(wallets);
            });
            it("getWalletsListFromStorage() should be return null if array empty or remove", function () {
                expect(sp8de.getWalletsListFromStorage()).toBeNull();
                localStorage.setItem(nameField, JSON.stringify([]));
                expect(sp8de.getWalletsListFromStorage()).toBeNull();
                localStorage.setItem(nameField, JSON.stringify({name: 'name'}));
                expect(sp8de.getWalletsListFromStorage()).toBeNull();
                localStorage.setItem(nameField, JSON.stringify({name: 'name', Wallets: []}));
                expect(sp8de.getWalletsListFromStorage()).toBeNull();
                localStorage.clear();
            });

        });
        describe("Check", function () {
            it("isWalletsInStorage method to be defined", function () {
                expect(sp8de.isWalletsInStorage).toBeDefined();
            });
            it("isWalletsInStorage should to be return true if there are", function () {
                localStorage.setItem(nameField, JSON.stringify([1]));
                expect(sp8de.isWalletsInStorage(sp8de.getWalletsInStorage())).toBeTruthy();
                localStorage.clear();
            });
            it("isWalletsInStorage should to be return true if there are for user", function () {
                localStorage.setItem('user', JSON.stringify({name: 'name', Wallets: [1]}));
                expect(sp8de.isWalletsInStorage(sp8de.getWalletsInStorage())).toBeTruthy();
                localStorage.clear();
            });
            it("isWalletsInStorage should to be return false if not", function () {
                localStorage.clear();
                expect(sp8de.isWalletsInStorage()).toBeFalsy();
            });
            it("isWalletsInStorage should to be return true if there are for user", function () {
                localStorage.setItem('user', JSON.stringify({name: 'name'}));
                expect(sp8de.isWalletsInStorage(sp8de.getWalletsInStorage())).toBeFalsy();
                localStorage.clear();
            });
            it("isWalletsInStorage should to be return false if array empty", function () {
                localStorage.setItem(nameField, JSON.stringify([]));
                expect(sp8de.isWalletsInStorage(sp8de.getWalletsInStorage())).toBeFalsy();
                localStorage.clear();
            });
            it("isWalletsInStorage should to be return false if there are for user if array empty", function () {
                localStorage.setItem('user', JSON.stringify({name: 'name', Wallets: []}));
                expect(sp8de.isWalletsInStorage(sp8de.getWalletsInStorage())).toBeFalsy();
                localStorage.clear();
            });
        });
        describe("Get user in storage", function () {
            it("getWalletsInStorage method to be defined", function () {
                expect(sp8de.getWalletsInStorage).toBeDefined();
            });
            it("getWalletsInStorage should to be return user if there is", function () {
                const user = {name: 'name', Wallets: [1, 2, 3]};
                localStorage.setItem('user', JSON.stringify(user));
                expect(sp8de.getWalletsInStorage()).toEqual(user);
                localStorage.clear();
            });
            it("getWalletsInStorage should to be return null if user is not there", function () {
                localStorage.clear();
                expect(sp8de.getWalletsInStorage()).toBeNull();
            });
        });
        xdescribe("Crypt and save", function () {
            it("Should be create, encrypt, add to storage, get from storage and decrypt wallet", function (done) {
                let wallet = sp8de.generateWallet(),
                    storageWallet,
                    privateKey = wallet.privateKey;
                sp8de.encryptWallet(wallet, password).then(encryptRes => {
                    sp8de.addWalletToStorage(encryptRes);
                    storageWallet = sp8de.getActiveWalletFromStorage();
                    sp8de.decryptWallet(storageWallet, password).then(decryptRes => {
                        expect(typeof decryptRes).toBe('object');
                        expect(decryptRes.privateKey).toBeDefined();
                        expect(decryptRes.privateKey).toBe(privateKey);
                        localStorage.clear();
                        done();
                    })
                });
            });
        });
    })
    xdescribe("Wallet", function () {
        describe("Creating", function () {
            it("generateWallet method to be defined", function () {
                expect(sp8de.generateWallet).toBeDefined();
            });
            it("generateWallet should be return object with wallet", function () {
                expect(typeof sp8de.generateWallet()).toEqual('object');
                expect(sp8de.generateWallet().privateKey).toBeDefined();
            });
        });
        describe("Encrypting", function () {
            it("encryptWallet method to be defined", function () {
                expect(sp8de.encryptWallet).toBeDefined();
            });
            it("encryptWallet should be return promise with encrypted wallet", function (done) {
                let wallet = sp8de.generateWallet();
                sp8de.encryptWallet(wallet, password).then(res => {
                    expect(typeof res).toBe('string');
                    expect(JSON.parse(res).address).toBeDefined();
                    done();
                });
            });
        });
        describe("Decrypting", function () {
            it("decryptWallet method to be defined", function () {
                expect(sp8de.decryptWallet).toBeDefined();
            });
            it("decryptWallet should be return promise with decrypted wallet", function (done) {
                let wallet = sp8de.generateWallet(),
                    privateKey = wallet.privateKey;
                sp8de.encryptWallet(wallet, password).then(encryptRes => {
                    sp8de.decryptWallet(encryptRes, password).then(decryptRes => {
                        expect(typeof decryptRes).toBe('object');
                        expect(decryptRes.privateKey).toBeDefined();
                        expect(decryptRes.privateKey).toBe(privateKey);
                        done();
                    })
                });
            });
        });
    })
});
