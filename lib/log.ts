/*
 * @Author: zhujm 
 * @Date: 2021-07-08 16:28:12 
 * @Last Modified by:   zhujm 
 * @Last Modified time: 2021-07-08 16:28:12 
 */

export class Log {

    static enable: boolean = false;

    static i(message?: any, ...optionalParams: any[]) {
        if (Log.enable) {
            console.log(message, ...optionalParams)
        }
    }
    static d(message?: any, ...optionalParams: any[]) {
        if (Log.enable) {
            console.debug(message, ...optionalParams)
        }
    }
    static e(message?: any, ...optionalParams: any[]) {
        console.error(message, ...optionalParams)
    }
}