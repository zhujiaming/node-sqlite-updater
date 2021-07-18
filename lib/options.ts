/*
 * @Author: zhujm 
 * @Date: 2021-07-08 16:28:23 
 * @Last Modified by: zhujm
 * @Last Modified time: 2021-07-08 16:30:15
 */
import { DbUpgradeInterface } from "./sqlengine";

export interface Options {
    readonly vercode: number

    readonly type: "sqlite"

    readonly database: string

    readonly logging: boolean

    readonly upgradeImpl: DbUpgradeInterface

}