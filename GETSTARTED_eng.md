# Get started
# Intro
Next, we show how you can create a minimal-functional game "dices" on Angular2,
in which the library `sp8de-client-sdk` will be used to ensure the reliability of
gaming operations.
## Installing
For use `sp8de-client-sdk` functions it is necessary install him from NPM:
```
npm install sp8de-client-sdk
```
And for Angular2 + applications, you need to add references to cryptographic libraries to the `index.html` file:
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
Method creates a wallet with a private key, if it is not in storage and generates a public key for further work:
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
    bet: [1, 2],
    betAmount: 100
})

console:
Validate items: true
Validate win: [true, true, true]
You win 50
```
