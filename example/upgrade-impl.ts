/*
 * @Author: zhujm 
 * @Date: 2021-07-08 16:28:32 
 * @Last Modified by:   zhujm 
 * @Last Modified time: 2021-07-08 16:28:32 
 */
import { DbUpgradeInterface, SQLEngine } from "../lib/sqlengine";

/**
 * 基于具体业务的数据库升级操作实现
 */
export class DbUpgradeImpl implements DbUpgradeInterface {

    async onUpgrade(sqlEngine: SQLEngine, oldVersion: number, newVersion: number): Promise<any> {
        // console.log("on upgrade run =====>", oldVersion, newVersion)
        if (oldVersion == 0) { //1->2
            console.log("on upgrade oldversion:", oldVersion)
            await sqlEngine.runSql(`ALTER TABLE "post" RENAME COLUMN "name" TO "title"`)
            oldVersion++
        }

        if (oldVersion == 1) { //2->3
            console.log("on upgrade oldversion:", oldVersion)
            await sqlEngine.runSql(`ALTER TABLE "post" ADD COLUMN "plain" DEFAULT 'unkown'`)
            oldVersion++
        }

    }
}