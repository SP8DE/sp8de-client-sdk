describe('Test library', function () {
    let  password = '1234';
    let Sp8de = require('../src/sp8deClientSDK');
    console.log(Sp8de)
    let sp8de=new Sp8de.Sp8deClientSDK();
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
            it("clearWalletStorage() should be remove all array of private keys", function () {
                let keyFirst = '1234',
                    keySecond = '4321',
                    user = {name: 'name', Wallets: [1, 2, 3, 4]};
                sp8de.addWalletToStorage(keyFirst);
                sp8de.clearWalletStorage();
                expect(JSON.parse(localStorage.getItem(nameField))).toBeNull();
                localStorage.setItem('user', JSON.stringify(user));
                sp8de.clearWalletStorage();
                expect(JSON.parse(localStorage.getItem('user')).Wallets).toBeUndefined();
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
        describe("Crypt and save", function () {
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
    describe("Wallet", function () {
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
