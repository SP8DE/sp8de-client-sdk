# Get started
# Intro
Далее будет показано, как с помощью фреймворка ангуляр2 можно создать
минимально-функциональную игру "кости", в которой будет использоваться библиотека
`sp8de-client-sdk` для обеспечения надежности проводимых игровых операций.
## Adding
Для использования функций библиотеки `sp8de-client-sdk`
необходимо поставить её из NPM:
```
npm install sp8de-client-sdk
```
Далее в `module.ts` необходимо импортировать модуль `sp8de-client-sdk`
 и добавить в массив `providers`:

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
Создадим сервис содержащий крипто-функции.
```
ng g s crypto
```
В сервисе импортируем `sp8de-client-sdk`
и объявим его в конструткторе
```js

import {Sp8deClientSDK} from 'sp8de-client-sdk';
...
constructor(public sp8deClientSDK: Sp8deClientSDK) {
  }
```
Далее реализуем методы для работы игры.
#### Init
Метод создает приватный ключ, если его нет в хранилище и генерирует публичный
для дальшейшей работы:
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
Метод отдает значения, необходимые для запроса на старт игры:
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
Следующий метод необходим для проверки случайного значения, возвращаемого сервером
в конце игры. В него нужно передать присланный сервером массив и параметры игры:
```js
public getRandomFromArray(parameters: { array: any[]; min: number, max: number, length: number }): number[] {
    return this.sp8deClientSDK.getRandomFromArray(parameters);
}
```
#### Validate win
Использует предыдущий метод для валидирования принятых значений
(на вход принимает массив и число переданные сервером).
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
Проверяет правильность информации о других игроках переданную сервером
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
Создадим сервис содержащий функции работающие с апи и управляющие началом и концом игры.
```
ng g s game
```
Далее реализуем методы для работы игры.

#### Start game
Метод через апи посылает запрос на сервер с параметрами начала игры
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
В для описания параметров используется следующий интерфейс:
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
Метод через апи посылает запрос на сервер с параметрами конца игры
```js
  public endGame(parameters: GameFinishRequest): Observable<GameFinishResponse> {
    return this.api.apiDemoGameEndPost(parameters).pipe(
      map(
        item => {
          return <GameFinishResponse>item;
        }));
  }
```
В для описания параметров используется следующий интерфейс:
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
Создадим логику компонента. Зададим параметры пользователя во время
инициализации компонента и напишем действия описывающие игру.
### On init
Во время инициализации создадим пользователю приватный и публичный ключи.
```js
ngOnInit() {
    this.cryptoService.init();
}
```
### Start game
Логика игры заключается в следующем:
1. В параметре event передаются значения, касающиеся условий игры.
Это тип игры, выбранные значения костей и ставка.
2. Внутри метода создаются параметры, необходимые для проведения крипто-операций.
Это публичный ключ, подписанное сообщение и nonce.
3. Эти параметры собираются вместе и передаются на сервер как запрос на начало
игры. Сервер возращает объект, в котором для работы логики необходимы
следующие поля:
    * gameId - идентификатор игры
    * items - массив с данными других участников.
4. Далее с полученными ранее крипто-параметрами и gameId на сервер отправляется запрос на
окончание игры.
5. Сервер дожлжен прислать ответ, который содержит следующую информацию:
    * isWinner - выиграл ли игрок
    * winNumbers - выпавшее значение
    * winAmount - размер выигрыша
    * items - массив с данными других игроков
    * sharedSeedArray - seed-массив из которого генерируется случайное значение выпавшей кости.
Последние два значения можно валидировать на клиенте.
6. Узнаем верны ли данные, проведя с помощью библиотеки `sp8de-client-sdk`
Валидацию данных о других игроках и выпавшего значения

Далее приведен код метода, которые реализует эту логику, используя
созданные ранее сервисы:
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
Теперь мы можем вызвать метод start(event) с параметрами игры и получить
в консоль результат:
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
