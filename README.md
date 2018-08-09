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
    * [.signMessage(parameters)](#Sp8deClientSDK+signMessage) ⇒ <code>object</code>
    * [.validateSign(parameters)](#Sp8deClientSDK+validateSign) ⇒ <code>boolean</code>

<a name="Sp8deClientSDK+generatePrivateKey"></a>

### sp8deClientSDK.generatePrivateKey() ⇒ <code>number</code>
Returns new private key

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>number</code> - Array contains random numbers
<a name="Sp8deClientSDK+getPubKey"></a>

### sp8deClientSDK.getPubKey(privateKey) ⇒ <code>string</code>
Returns public key for private key

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>string</code> - Public key

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | private key |

<a name="Sp8deClientSDK+getRandomFromArray"></a>

### sp8deClientSDK.getRandomFromArray(parameters) ⇒ <code>Array.&lt;number&gt;</code>
Returns an array of random numbers from seed-array (use mt19937 algorithm)

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>Array.&lt;number&gt;</code> - Array contains random numbers

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>object</code> | {array: [], min: number, max: number, count: number} |

<a name="Sp8deClientSDK+generateSeed"></a>

### sp8deClientSDK.generateSeed() ⇒ <code>number</code>
Returns a random number to use as a seed

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>number</code> - Random seed
<a name="Sp8deClientSDK+signMessage"></a>

### sp8deClientSDK.signMessage(parameters) ⇒ <code>object</code>
Signs a message from privateKey, seed, nonce

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>object</code> - Object {pubKey: string, message: string, sign: string, version: string, signer: string}

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>object</code> | {privateKey: string, seed: number, nonce: number} |

<a name="Sp8deClientSDK+validateSign"></a>

### sp8deClientSDK.validateSign(parameters) ⇒ <code>boolean</code>
Validates the message. Use sign, nonce, public key and seed. Returns true if the validation was successful.

**Kind**: instance method of [<code>Sp8deClientSDK</code>](#Sp8deClientSDK)
**Returns**: <code>boolean</code> - True if successful, false if unsuccessful

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>object</code> | {sign: string, pubKey: string, seed: number, nonce: number} |

