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

## NPM commands

`doc`: Run generate documentation from jsdoc

`test`: Run karma test

`watch`: Run watchify to autorun browserify for create single file

`toCDN`: Create single file with browserify and minification

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
Methods for storing wallet in the storage use the choice between `wallets` and `user` keys in localstorage (for situations where the user-object in the application).
If in localstorage has a `user` key, then wallet will be added to him in key `wallets`.


## About

A simple set of ... , mainly for frontend apps.

##  Examples

### Wallet procedures
#### Save on init
```js
public init() {
    // Check wallets in storage
    if (this.sp8deClientSDK.isWalletsInStorage()) {
      // Get wallet and decript him
      from(this.sp8deClientSDK.decryptWallet(this.sp8deClientSDK.getActiveWalletFromStorage(), this.password))
        .pipe(
          map(item => <any>item)
        )
        .subscribe(wallet => {
          // Save private key
          this.privateKey = wallet.privateKey;
          // Generate public key
          this.pubKey = this.sp8deClientSDK.getPubKey(this.privateKey);
        });
    } else {
      // Generate wallet containing private key.
      let wallet;
      this.privateKey = wallet.privateKey;
          // Generate public key from private key
          this.pubKey = this.sp8deClientSDK.getPubKey(this.privateKey);
          // Encrypting the wallet before uploading it to the storage for data security.
          from(this.sp8deClientSDK.encryptWallet(this.sp8deClientSDK.generateWallet(), password))
            .pipe(
              map(item => <any>item)
            )
            .subscribe(res => {
              // Save encrypted wallet to localstorage
              this.sp8deClientSDK.addWalletToStorage(res);
            });
    }
  }
```

#### Open for use
```js
    // Getting wallet from storage
    let storageWallet = this.sp8deClientSDK.getActiveWalletFromStorage();
    // Decrypt wallet for edxecute private key
    this.sp8deClientSDK.decryptWallet(storageWallet, password).then(decryptRes => {
        // Getting private key
        this.privateKey = decryptRes.privateKey
    })
```
### Signing
```js
    // set current date in milliseconds as nonce
    const nonce = +(new Date());
    // generate seed
    const seed = this.sp8deClientSDK.generateSeed();
    // signing message
    const sign = this.sp8deClientSDK.signMessage({privateKey: this.privateKey, seed: seed, nonce: nonce});
```
### Validate
Validating random number from array-seed
```js
  public validateWin(array: number[], serverNumber: number[]): boolean {
    // generate random number from array
    const clientNumber = this.getRandomFromArray({array: array, min: 1, max: 6, length: winNumber.length});
    if (!clientNumber) {
      console.error('Server value invalid!');
      return;
    }
    return clientNumber[0] === serverNumber[0];
  }
```

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
    * [.addWalletToStorage(value, storageWallets)](#Sp8deClientSDK+addWalletToStorage)
    * [.removeLastWalletFromStorage(storageWallets)](#Sp8deClientSDK+removeLastWalletFromStorage)
    * [.clearWalletStorage(storageWallets)](#Sp8deClientSDK+clearWalletStorage)
    * [.getActiveWalletFromStorage(array)](#Sp8deClientSDK+getActiveWalletFromStorage) ⇒ <code>string</code>
    * [.getWalletsListFromStorage(storageWallets)](#Sp8deClientSDK+getWalletsListFromStorage) ⇒ <code>Array.&lt;string&gt;</code>
    * [.isWalletsInStorage(storageWallets)](#Sp8deClientSDK+isWalletsInStorage) ⇒ <code>boolean</code>

<a name="Sp8deClientSDK+generatePrivateKey"></a>

### sp8deClientSDK.generatePrivateKey() ⇒ <code>number</code>
Returns a new private key


**Returns**: <code>number</code> - A public key of 66 characters long
<a name="Sp8deClientSDK+generateWallet"></a>

### sp8deClientSDK.generateWallet() ⇒ <code>object</code>
Returns a new wallet


**Returns**: <code>object</code> - Object contains wallet
<a name="Sp8deClientSDK+encryptWallet"></a>

### sp8deClientSDK.encryptWallet(wallet, password) ⇒ <code>promise</code>
Returns a new wallet


**Returns**: <code>promise</code> - promise with json

| Param | Type | Description |
| --- | --- | --- |
| wallet | <code>object</code> | object with wallet |
| password | <code>string</code> |  |

<a name="Sp8deClientSDK+decryptWallet"></a>

### sp8deClientSDK.decryptWallet(wallet, password) ⇒ <code>promise</code>
Returns a new wallet


**Returns**: <code>promise</code> - promise with json

| Param | Type | Description |
| --- | --- | --- |
| wallet | <code>string</code> | Encrypted JSON with wallet |
| password | <code>string</code> |  |

<a name="Sp8deClientSDK+getPubKey"></a>

### sp8deClientSDK.getPubKey(privateKey) ⇒ <code>string</code>
Returns the public key obtains from the private key


**Returns**: <code>string</code> - A public key of 42 characters long

| Param | Type | Description |
| --- | --- | --- |
| privateKey | <code>string</code> | private key |

<a name="Sp8deClientSDK+getRandomFromArray"></a>

### sp8deClientSDK.getRandomFromArray(parameters) ⇒ <code>Array.&lt;number&gt;</code>
Returns an array of random numbers from seed-array (use mt19937 algorithm)


**Returns**: <code>Array.&lt;number&gt;</code> - An array of length given by a "count" containing random numbers

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | {array: [], min: number, max: number, count: number} |

<a name="Sp8deClientSDK+generateSeed"></a>

### sp8deClientSDK.generateSeed() ⇒ <code>number</code>
Returns a random number to use as a seed


**Returns**: <code>number</code> - Random seed number. Length 9-10
<a name="Sp8deClientSDK+signMessage"></a>

### sp8deClientSDK.signMessage(parameters) ⇒ <code>string</code>
Signs a message from privateKey, seed, nonce. Returns message signed with private key.


**Returns**: <code>string</code> - Message signed with private key

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | {privateKey: string, seed: number, nonce: number} |

<a name="Sp8deClientSDK+validateSign"></a>

### sp8deClientSDK.validateSign(parameters) ⇒ <code>boolean</code>
Validates the message. Use sign, nonce, public key and seed. Returns true if the validation was successful.


**Returns**: <code>boolean</code> - True if successful, false if unsuccessful

| Param | Type | Description |
| --- | --- | --- |
| parameters | <code>Object</code> | {sign: string, pubKey: string, seed: number, nonce: number} |

<a name="Sp8deClientSDK+addWalletToStorage"></a>

### sp8deClientSDK.addWalletToStorage(value, storageWallets)
Add to localstorage to key Wallets in key "User" or root. If user without field "Wallets" add it.



| Param | Type | Description |
| --- | --- | --- |
| value | <code>string</code> | Private key |
| storageWallets | <code>object</code> \| <code>array</code> | Object wallet contained in storage |

<a name="Sp8deClientSDK+removeLastWalletFromStorage"></a>

### sp8deClientSDK.removeLastWalletFromStorage(storageWallets)
Removing last private key from array in localstorage



| Param | Type | Description |
| --- | --- | --- |
| storageWallets | <code>object</code> \| <code>array</code> | Object wallet contained in storage |

<a name="Sp8deClientSDK+clearWalletStorage"></a>

### sp8deClientSDK.clearWalletStorage(storageWallets)
Clear array of private keys (delete key from localstorage



| Param | Type | Description |
| --- | --- | --- |
| storageWallets | <code>object</code> \| <code>array</code> | Object wallet contained in storage) |

<a name="Sp8deClientSDK+getActiveWalletFromStorage"></a>

### sp8deClientSDK.getActiveWalletFromStorage(array) ⇒ <code>string</code>
Returns active private key in localstorage


**Returns**: <code>string</code> - Active private key or null if no array

| Param | Type | Description |
| --- | --- | --- |
| array | <code>array</code> | Array wallets contained in storage |

<a name="Sp8deClientSDK+getWalletsListFromStorage"></a>

### sp8deClientSDK.getWalletsListFromStorage(storageWallets) ⇒ <code>Array.&lt;string&gt;</code>
Returns array of string contains all private keys from localstorage


**Returns**: <code>Array.&lt;string&gt;</code> - Array of private keys or null if no array

| Param | Type | Description |
| --- | --- | --- |
| storageWallets | <code>object</code> \| <code>array</code> | Object wallet contained in storage |

<a name="Sp8deClientSDK+isWalletsInStorage"></a>

### sp8deClientSDK.isWalletsInStorage(storageWallets) ⇒ <code>boolean</code>
Check if there are keys in vault


**Returns**: <code>boolean</code> - True if there is, false is not

| Param | Type | Description |
| --- | --- | --- |
| storageWallets | <code>object</code> | User in storage, if it there is |

# Get started
# Intro
Next, we show how you can create a minimal-functional game "Dices" on Angular2,
in which the library `sp8de-client-sdk` will be used to ensure the reliability of
gaming operations.
## Installing
For use `sp8de-client-sdk` functions it is necessary install him from NPM:
```
npm install sp8de-client-sdk
```
And for Angular2 + applications, you need to add references to cryptographic libraries to the index.html file:
```
<script src="https://www.mobilefish.com/scripts/ethereumjs/ethereumjs-util.js"></script>
<script src="https://cdn.ethers.io/scripts/ethers-v3.min.js"></script>
```
In `module.ts` need to import module `sp8de-client-sdk`
 and add to the array `providers`:

```js
import {Sp8deClientSDK} from 'sp8de-client-sdk';

@NgModule({
...
  providers: [Sp8deClientSDK]
...
})
```

## Create services
### Crypto service
Create a service containing a cryptographic functions.
```
ng g s crypto
```
In the service import `sp8de-client-sdk`
and declare it in the constructor.
```js

import {Sp8deClientSDK} from 'sp8de-client-sdk';
...
constructor(public sp8deClientSDK: Sp8deClientSDK) {
  }
```
Implements methods of the game.
#### Init
Method creates a private key, if it is not in storage and generates a public key for further work:
```js
public init() {
    // Check wallets in storage
    if (this.sp8deClientSDK.isWalletsInStorage()) {
      // Get wallet and decript him
      from(this.sp8deClientSDK.decryptWallet(this.sp8deClientSDK.getActiveWalletFromStorage(), this.password))
        .pipe(
          map(item => <any>item)
        )
        .subscribe(wallet => {
          // Save private key
          this.privateKey = wallet.privateKey;
          // Generate public key
          this.pubKey = this.sp8deClientSDK.getPubKey(this.privateKey);
        });
    } else {
      // Generate wallet containing private key.
      let wallet;
      this.privateKey = wallet.privateKey;
          // Generate public key from private key
          this.pubKey = this.sp8deClientSDK.getPubKey(this.privateKey);
          // Encrypting the wallet before uploading it to the storage for data security.
          from(this.sp8deClientSDK.encryptWallet(this.sp8deClientSDK.generateWallet(), password))
            .pipe(
              map(item => <any>item)
            )
            .subscribe(res => {
              // Save encrypted wallet to localstorage
              this.sp8deClientSDK.addWalletToStorage(res);
            });
    }
  }
```
#### Generate crypto-parameters
Return values, required for the request to start game:
```js
public generateCryptoParameters(): any {
    //  Create object
    //  Wtite current date to nonce, current public key to pubKey
    //  and generate seed
    const resultParameters = {
        nonce: +(new Date()),
        seed: this.sp8deClientSDK.generateSeed(),
        sign: '',
        pubKey: this.pubKey
      },
      signParameters = {
        privateKey: this.privateKey,
        seed: resultParameters.seed,
        nonce: resultParameters.nonce
      };
    // Signing message
    resultParameters.sign = this.sp8deClientSDK.signMessage(signParameters);
    return resultParameters;
  }
```
#### Getting random from array
Check the random value returned from server at the end of game.
Accept servers array and parameters of game:
```js
public getRandomFromArray(parameters: { array: any[]; min: number, max: number, length: number }): number[] {
    return this.sp8deClientSDK.getRandomFromArray(parameters);
}
```
#### Validate win
Uses the previous method to validate server values. Accepted server array and random number.
```js
public validateWin(array: number[], serverNumber: number[]): boolean {
    const clientNumber = this.getRandomFromArray({array: array, min: 1, max: 6, length: serverNumber.length});
    if (!clientNumber) {
      console.error('Server value invalid!');
      return;
    }
    return clientNumber[0] === serverNumber[0];
  }
```
#### Validate players
Validate correctness of the information transmitted by the server about other players.
```js
public validatePlayers(response: GameFinishResponse): boolean[] {
    const result: boolean[] = [];
    for (const item of response.items) {
      result.push(this.sp8deClientSDK.validateSign({
          sign: item.sign,
          pubKey: item.pubKey,
          seed: item.seed,
          nonce: item.nonce
        }
      ));
    }
    return result;
  }
```
### Game service
We will create a service containing functions that work with the api
and control the beginning and end of the game.
```
ng g s game
```
Implements methods for work the game.

#### Start game
Through api sends a request with parameters of start the game.
```js
public startGame(parameters: GameStartRequest): Observable<GameStartResponse> {
    return this.api.apiDemoGameStartPost(parameters)
      .pipe(
        map(
          item => {
            return <GameFinishResponse>item;
          }));
  }
```
To request parameters, use the following interface:
```js
export interface GameStartRequest {
    type?: GameStartRequest.TypeEnum;
    bet?: Array<number>;
    betAmount?: number;
    pubKey?: string;
    sign?: string;
    nonce?: number;
}
```
#### End game
Through api sends a request with parameters of start the game.
```js
  public endGame(parameters: GameFinishRequest): Observable<GameFinishResponse> {
    return this.api.apiDemoGameEndPost(parameters).pipe(
      map(
        item => {
          return <GameFinishResponse>item;
        }));
  }
```
To request parameters, use the following interface:
```js
export interface GameFinishRequest {
    gameId?: string;
    pubKey?: string;
    sign?: string;
    seed?: number;
    nonce?: number;
}
```
## Create game component
Let's create the logic of the component.
Set user parameters on initialize the component
and write logic of game.
### On init
On initialisation create public and private key for the user.
```js
ngOnInit() {
    this.cryptoService.init();
}
```
### Start game
The logic of the game is as follows:
1. In the event parameter, values relating to the game conditions are passed.
This is the type of the game, the selected dices values and the bet.
2. In the method create parameters, necessary for cryptographic operations.
This is a public key, a signed message and a nonce.
3. These parameters are collected together and sent to the server as a request to start games.
The server returns an object in which the following fields are required for the game:
    * gameId — game identification
    * items — array with the data of other players
4. Send to the server request to the end of game with the previously obtained cryptographic
parameters and gameId.
5. Server should send a response, that contains the following information:
    * isWinner — did the player win
    * winNumbers — dropped dices
    * winAmount — amount of winnings
    * items — array with data from other players
    * sharedSeedArray — seed-array from which a random value of the dropped dice is generated.
The last two values can be validated on the client.
6. We'll find out whether the data is correct by running the `sp8de-client-sdk`
library to validate data about other players and the dropped value

Below is the code of the method that implements this logic, using
previously created services:
```js
public start(event): void {
    const cryptoParameters = this.cryptoService.generateCryptoParameters();
    this.gameService.startGame({
        type: event.type,
        bet: event.currentBet,
        betAmount: event.currentBetAmount,
        pubKey: cryptoParameters.pubKey,
        sign: cryptoParameters.sign,
        nonce: cryptoParameters.nonce
      }).pipe(
      switchMap(startResponse => {
        return this.gameService.endGame({
          gameId: startResponse.gameId,
          sign: cryptoParameters.sign,
          seed: cryptoParameters.seed,
          nonce: cryptoParameters.nonce,
          pubKey: cryptoParameters.pubKey
        });
      })).subscribe(res => {
        const validWin = this.cryptoService.validateWin(res.sharedSeedArray, res.winNumbers),
          validItems = this.cryptoService.validatePlayers(res),
          win = this.checkWin(res.winNumbers, event.currentBet);
        console.log('Validate items: ', validItems);
        console.log('Validate win: ', validWin);
        console.log(win ? `You win ${res.winAmount}` : 'You lose');
      },
      error => {
        console.error(error.message);
      });
  }
```
Now you can call method start(event) with game parameters and get to the console result:
```js
js:
start({
    type: 'Dice',
    bet: [1, 2, 4],
    betAmount: 100
})

console:
Validate items: true
Validate win: [true, true, true]
You win 100
```
