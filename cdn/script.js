let EthJS = require('ethereumjs-util'),
    privateKeyGenerator = require('ethers');
import {Sp8deClientSDK} from '../src/sp8deClientSDK';

export class Methods extends Sp8deClientSDK {
    constructor() {
        super(EthJS, privateKeyGenerator);
    }
}

if (window !== undefined) window.sp8deClientSDK = new Methods();
else global.sp8deClientSDK = new Methods();


