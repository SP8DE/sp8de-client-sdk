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

## Available Methods

```
signMessage         <Function ({privateKey: string, seed: number, nonce: number}) : ({})>
getPubKey           <Function (string) : (string)>
getRandomFromArray  <Function ({array: number[], min: number, max: number, count: number}) : (number)>
generateSeed        <Function () : (number)>
generatePrivateKey  <Function () : (string)>
validateSign        <Function ({sign: string, pubKey: string, seed: number, nonce: number}) : (boolean)>
```

## Guides

You'll find more detailed information on using `sp8de-client-sdk` and tailoring it to your needs in our guides:

...:

## NPM commands

`doc`: Run generate documentation from jsdoc

`test`: Run karma test

`watch`: Run watchify to autorun browserify for create single file

`toCDN`: Create single file with browserify and minification
