let EthJS = require('ethereumjs-util'),
    privateKeyGenerator = require('ethers');
import {Sp8deClientSDK} from '../src/sp8deClientSDK';

export class Methods extends Sp8deClientSDK {
    constructor() {
        super();
    }
}
let SDK= new Methods();
SDK.init(EthJS, privateKeyGenerator);
if (window !== undefined) window.sp8deClientSDK = SDK;
else global.sp8deClientSDK = SDK;


