## Sp8de crypto client SDK

SDK for client

## Install

### NPM
```
npm install sp8de-client-sdk
```
For angular2 + applications, you need to add references to cryptographic libraries to the index.html file:
```
<script src="https://www.mobilefish.com/scripts/ethereumjs/ethereumjs-util.js"></script>
<script src="https://cdn.ethers.io/scripts/ethers-v3.min.js"></script>
```
### CDN
```
<script src="https:/*.js"></script>
```
## Usage

### NPM
```js
import {Sp8deClientSDK} from 'sp8de-client-sdk';
// or
const Sp8deClientSDK = require('sp8de-client-sdk');

const sp8deClientSDK = new Sp8deClientSDK.Methods();

const seed = sp8deClientSDK.generateSeed();
// returns seed
```
### CDN
```js
const seed = sp8deClientSDK.generateSeed();
// returns seed
```

### Store wallets in localstorage
Methods for storing wallet in the storage use the choice between `wallets` and `user` keys in localstorage (for situations where the user-object in the application)*
If in localstorage has a `user` key, then wallet will be added to him in key `wallets`.


## About

A simple set of ... , mainly for frontend apps.

## Guides

You'll find more detailed information on using `sp8de-client-sdk` and tailoring it to your needs in our guides:

...:

## NPM commands

`doc`: Run generate documentation from jsdoc

`test`: Run karma test

`watch`: Run watchify to autorun browserify for create single file

`toCDN`: Create single file with browserify and minification

## API
* [Sp8deClientSDK](#Sp8deClientSDK)
    * [.generatePrivateKey()](#Sp8deClientSDK+generatePrivateKey) ⇒ <code>number</code>
    * [.generateWallet()](#Sp8deClientSDK+generateWallet) ⇒ <code>object</code>
    * [.encryptWallet(wallet, password)](#Sp8deClientSDK+encryptWallet) ⇒ <code>promise</code>
    * [.decryptWallet(wallet, password)](#Sp8deClientSDK+decryptWallet) ⇒ <code>promise</code>
    * [.getPubKey(privateKey)](#Sp8deClientSDK+getPubKey) ⇒ <code>string</code>
    * [.getRandomFromArray(parameters)](#Sp8deClientSDK+getRandomFromArray) ⇒ <code>Array.&lt;number&gt;</code>
    * [.generateSeed()](#Sp8deClientSDK+generateSeed) ⇒ <code>number</code>
    * [.signMessage(parameters)](#Sp8deClientSDK+signMessage) ⇒ <code>string</code>
    * [.validateSign(parameters)](#Sp8deClientSDK+validateSign) ⇒ <code>boolean</code>
    * [.addWalletToStorage(value)](#Sp8deClientSDK+addWalletToStorage)
    * [.removeLastWalletFromStorage()](#Sp8deClientSDK+removeLastWalletFromStorage)
    * [.clearWalletStorage()](#Sp8deClientSDK+clearWalletStorage)
    * [.getActiveWalletFromStorage()](#Sp8deClientSDK+getActiveWalletFromStorage) ⇒ <code>string</code>
    * [.getWalletsListFromStorage()](#Sp8deClientSDK+getWalletsListFromStorage) ⇒ <code>Array.&lt;string&gt;</code>
    * [.isKeysInStorage(storageKeys)](#Sp8deClientSDK+isKeysInStorage) ⇒ <code>boolean</code>

### sp8deClientSDK.generatePrivateKey() ⇒ <code>number</code>
Returns a new private key

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>number</code> - A public key of 66 characters long
<a name="Sp8deClientSDK+generateWallet"></a>

### sp8deClientSDK.generateWallet() ⇒ <code>object</code>
Returns a new wallet

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>object</code> - Object contains wallet
<a name="Sp8deClientSDK+encryptWallet"></a>

### sp8deClientSDK.encryptWallet(wallet, password) ⇒ <code>promise</code>
Returns a new wallet

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>promise</code> - promise with json

| Param | Type | Description |
| --- | --- | --- |
| wallet | <code>object</code> | object with wallet |
| password | <code>string</code> |  |

<a name="Sp8deClientSDK+decryptWallet"></a>

### sp8deClientSDK.decryptWallet(wallet, password) ⇒ <code>promise</code>
Returns a new wallet

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>promise</code> - promise with json

| Param | Type | Description |
| --- | --- | --- |
| wallet | <code>string</code> | Encrypted JSON with wallet |
| password | <code>string</code> |  |

<a name="Sp8deClientSDK+getPubKey"></a>

### sp8deClientSDK.getPubKey(privateKey) ⇒ <code>string</code>
Returns the public key obtains from the private key

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>string</code> - A public key of 42 characters long

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | private key |

<a name="Sp8deClientSDK+getRandomFromArray"></a>

### sp8deClientSDK.getRandomFromArray(parameters) ⇒ <code>Array.&lt;number&gt;</code>
Returns an array of random numbers from seed-array (use mt19937 algorithm)

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>Array.&lt;number&gt;</code> - An array of length given by a "count" containing random numbers

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | {array: [], min: number, max: number, count: number} |

<a name="Sp8deClientSDK+generateSeed"></a>

### sp8deClientSDK.generateSeed() ⇒ <code>number</code>
Returns a random number to use as a seed

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>number</code> - Random seed number. Length 9-10
<a name="Sp8deClientSDK+signMessage"></a>

### sp8deClientSDK.signMessage(parameters) ⇒ <code>string</code>
Signs a message from privateKey, seed, nonce. Returns message signed with private key.

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>string</code> - Message signed with private key

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | {privateKey: string, seed: number, nonce: number} |

<a name="Sp8deClientSDK+validateSign"></a>

### sp8deClientSDK.validateSign(parameters) ⇒ <code>boolean</code>
Validates the message. Use sign, nonce, public key and seed. Returns true if the validation was successful.

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>boolean</code> - True if successful, false if unsuccessful

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | {sign: string, pubKey: string, seed: number, nonce: number} |

<a name="Sp8deClientSDK+addWalletToStorage"></a>

### sp8deClientSDK.addWalletToStorage(value)
Add to localstorage to key Wallets in key "User" or root. If user without field "Wallets" add it.

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | Private key |

<a name="Sp8deClientSDK+removeLastWalletFromStorage"></a>

### sp8deClientSDK.removeLastWalletFromStorage()
Removing last private key from array in localstorage

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
<a name="Sp8deClientSDK+clearWalletStorage"></a>

### sp8deClientSDK.clearWalletStorage()
Clear array of private keys (delete key from localstorage)

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
<a name="Sp8deClientSDK+getActiveWalletFromStorage"></a>

### sp8deClientSDK.getActiveWalletFromStorage() ⇒ <code>string</code>
Returns active private key in localstorage

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>string</code> - Active private key or null if no array
<a name="Sp8deClientSDK+getWalletsListFromStorage"></a>

### sp8deClientSDK.getWalletsListFromStorage() ⇒ <code>Array.&lt;string&gt;</code>
Returns array of string contains all private keys from localstorage

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>Array.&lt;string&gt;</code> - Array of private keys or null if no array
<a name="Sp8deClientSDK+isKeysInStorage"></a>

### sp8deClientSDK.isKeysInStorage(storageKeys) ⇒ <code>boolean</code>
Check if there are keys in vault

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>boolean</code> - True if there is, false is not

| Param | Type | Description |
| --- | --- | --- |
| storageKeys | <code>object</code> | User in storage, if it there is |

