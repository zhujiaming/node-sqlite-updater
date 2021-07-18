/*
 * @Author: zhujm
 * @Date: 2021-07-08 16:28:03
 * @Last Modified by: zhujm
 * @Last Modified time: 2021-07-08 19:02:46
 */
import { Options } from "./options";
import { SQLEngine, Ret } from "./sqlengine";
import { Log } from "./log";
import fs from "fs";

export class DbUpdater {
    // private static instance: DbUpdater;

    upgradeEngine!: SQLEngine;
    options!: Options;
    configTableName: string = "config";
    configTableKeyVercode: string = "vercode";

    constructor(options: Options) {
        this.options = options;
        this.checkOptions(this.options);
        Log.enable = this.options.logging;
    }

    async init(): Promise<Ret> {
        if (!fs.existsSync(this.options.database)) {
            return { code: -1, data: "db file not exist" };
        }

        this.upgradeEngine = new SQLEngine(this.options.database);
        return await this.checkUpgrade();
    }

    private async checkUpgrade() {
        try {
            let res = await this.upgradeEngine.getSql(
                `SELECT * FROM '${this.configTableName}'`
            );
            if (res.code == 0) {
                Log.i("get sql ret:", res);
                let oldVerCode = res.data.vercode;
                Log.i(
                    "oldversion:" + oldVerCode + " | newversion:" + this.options.vercode
                );
                let needUpgrade = oldVerCode < this.options.vercode;
                if (needUpgrade) {
                    await this.options.upgradeImpl.onUpgrade(
                        this.upgradeEngine,
                        oldVerCode,
                        this.options.vercode
                    );
                    // 将数据库版本号置为最新
                    await this.upgradeEngine.runSql(
                        `UPDATE ${this.configTableName} SET ${this.configTableKeyVercode} = ${this.options.vercode}`
                    );
                }
            }
            return { code: 0, data: this.options.vercode };
        } catch (e) {
            // console.log('-->', JSON.stringify(e), e)
            // if (e.data && JSON.stringify(e.data).indexOf('no such table') < 0) {
            //     Log.e('upgrade error', e)
            //     throw e;
            // }
            Log.i("try check config table exist");
            let ret = await this.upgradeEngine.checkTableExist(this.configTableName);
            if (ret.code == 0) {
                if (!ret.data) {
                    // no config table,create
                    Log.i("try create config table");
                    ret = await this.upgradeEngine.runSql(
                        `CREATE TABLE ${this.configTableName}(ID INTEGER PRIMARY KEY AUTOINCREMENT, ${this.configTableKeyVercode} INTEGER NOT NULL DEFAULT 0)`
                    );
                    Log.i("table config create ret:", ret);
                    if (ret.code == 0) {
                        let initVerCode = 0;
                        ret = await this.upgradeEngine.runSql(
                            `INSERT INTO ${this.configTableName} VALUES(NULL, ${initVerCode})`
                        );
                        Log.i("table config insert default ret:", ret);
                        if (ret.code == 0) {
                            await this.checkUpgrade();
                        }
                    }
                    return ret;
                } else {
                    Log.i("config table already exist");
                }
            } else {
                throw e;
            }
            return { code: 0, data: ret ? ret : e };
        }
    }

    private checkOptions(options: Options) {
        if (!this.options.database) {
            throw "database can not be empty!";
        }
        if (!this.options.vercode) {
            throw "vercode can not be empty!";
        }
        if (!this.options.upgradeImpl) {
            throw "dbUpgradeImpl can not be empty!";
        }
    }
}
