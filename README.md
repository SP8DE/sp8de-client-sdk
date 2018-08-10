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

const sp8deClientSDK = new Sp8deClientSDK();

const seed = sp8deClientSDK.generateSeed();
// returns seed
```
### CDN
```js
const see d = sp8deClientSDK.generateSeed();
// returns seed
```

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
  * [.getPubKey(privateKey)](#Sp8deClientSDK+getPubKey) ⇒ <code>string</code>
  * [.getRandomFromArray(parameters)](#Sp8deClientSDK+getRandomFromArray) ⇒ <code>Array.&lt;number&gt;</code>
  * [.generateSeed()](#Sp8deClientSDK+generateSeed) ⇒ <code>number</code>
  * [.signMessage(parameters)](#Sp8deClientSDK+signMessage) ⇒ <code>string</code>
  * [.validateSign(parameters)](#Sp8deClientSDK+validateSign) ⇒ <code>boolean</code>
  * [.addPrivateKeyToStorage(value)](#Sp8deClientSDK+addPrivateKeyToStorage)
  * [.removeLastPrivateKeyFromStorage()](#Sp8deClientSDK+removeLastPrivateKeyFromStorage)
  * [.clearPrivateKeyStorage()](#Sp8deClientSDK+clearPrivateKeyStorage)
  * [.getActivePrivateKeyFromStorage()](#Sp8deClientSDK+getActivePrivateKeyFromStorage) ⇒ <code>string</code>
  * [.getPrivateKeysListFromStorage()](#Sp8deClientSDK+getPrivateKeysListFromStorage) ⇒ <code>Array.&lt;string&gt;</code>
  * [.isKeysInStorage(user)](#Sp8deClientSDK+isKeysInStorage) ⇒ <code>boolean</code>

<a name="Sp8deClientSDK+generatePrivateKey"></a>

### sp8deClientSDK.generatePrivateKey() ⇒ <code>number</code>
Returns a new private key

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>number</code> - A public key of 66 characters long
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

<a name="Sp8deClientSDK+addPrivateKeyToStorage"></a>

### sp8deClientSDK.addPrivateKeyToStorage(value)
Add to localstorage to key privateKeys in key "User" or root. If user without field "privateKeys" add it.

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)

| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | Private key |

<a name="Sp8deClientSDK+removeLastPrivateKeyFromStorage"></a>

### sp8deClientSDK.removeLastPrivateKeyFromStorage()
Removing last private key from array in localstorage

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
<a name="Sp8deClientSDK+clearPrivateKeyStorage"></a>

### sp8deClientSDK.clearPrivateKeyStorage()
Clear array of private keys (delete key from localstorage)

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
<a name="Sp8deClientSDK+getActivePrivateKeyFromStorage"></a>

### sp8deClientSDK.getActivePrivateKeyFromStorage() ⇒ <code>string</code>
Returns active private key in localstorage

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>string</code> - Active private key or null if no array
<a name="Sp8deClientSDK+getPrivateKeysListFromStorage"></a>

### sp8deClientSDK.getPrivateKeysListFromStorage() ⇒ <code>Array.&lt;string&gt;</code>
Returns array of string contains all private keys from localstorage

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>Array.&lt;string&gt;</code> - Array of private keys or null if no array
<a name="Sp8deClientSDK+isKeysInStorage"></a>

### sp8deClientSDK.isKeysInStorage(user) ⇒ <code>boolean</code>
Check if there are keys in vault

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>boolean</code> - True if there is, false is not

| Param | Type | Description |
| --- | --- | --- |
| user | <code>object</code> | User in storage, if it there is |
