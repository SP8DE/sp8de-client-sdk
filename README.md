## Sp8de crypto client SDK

SDK for client

## Install

### NPM
```
npm install sp8de-client-sdk
```
For angular2+ apps need add  links to cryptography libraries to index.html:
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

const see d = sp8deClientSDK.generateSeed();
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
signMessage        <Function ({privateKey: string, seed: number, nonce: number}) : ({})>
getPubKey          <Function (string) : (string)>
getRandomFromArray          <Function ({array: number[], min: number, max: number, count: number}) : (number)>
generateSeed          <Function () : (number)>
generatePrivateKey          <Function () : (string)>
validateSign          <Function ({sign: string, pubKey: string, seed: number, nonce: number}) : (boolean)>
```

## Contributing

Please help better the ecosystem by submitting issues and pull requests to default. We need all the help we can get to build the absolute best linting standards and utilities. We follow the AirBNB linting standard and the unix philosophy.

## Guides

You'll find more detailed information on using `ethjs-util` and tailoring it to your needs in our guides:

- [User guide](docs/user-guide.md) - Usage, configuration, FAQ and complementary tools.
- [Developer guide](docs/developer-guide.md) - Contributing to `ethjs-util` and writing your own code and coverage.

## Help out

There is always a lot of work to do, and will have many rules to maintain. So please help out in any way that you can:

- Create, enhance, and debug ethjs rules (see our guide to ["Working on rules"](./github/CONTRIBUTING.md)).
- Improve documentation.
- Chime in on any open issue or pull request.
- Open new issues about your ideas for making `ethjs-util` better, and pull requests to show us how your idea works.
- Add new tests to *absolutely anything*.
- Create or contribute to ecosystem tools, like modules for encoding or contracts.
- Spread the word.

Please consult our [Code of Conduct](CODE_OF_CONDUCT.md) docs before helping out.

We communicate via [issues](https://github.com/ethjs/ethjs-util/issues) and [pull requests](https://github.com/ethjs/ethjs-util/pulls).

## Important documents

- [Changelog](CHANGELOG.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [License](https://raw.githubusercontent.com/ethjs/ethjs-util/master/LICENSE)

## Licence

This project is licensed under the MIT license, Copyright (c) 2016 Nick Dodson. For more information see LICENSE.md.

```
The MIT License

Copyright (c) 2016 Nick Dodson. nickdodson.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
