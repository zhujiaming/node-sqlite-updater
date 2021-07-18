/*
 * @Author: zhujm 
 * @Date: 2021-07-08 16:28:26 
 * @Last Modified by: zhujm
 * @Last Modified time: 2021-07-08 16:30:16
 */
import * as sqlite from 'sqlite3';
import { Log } from './log'
const sqlite3 = sqlite.verbose();

export interface Ret {
    readonly code: number;
    readonly data: any | undefined;
}

export interface DbUpgradeInterface {
    onUpgrade: (engine: SQLEngine, oldVersion: number, newVersion: number) => Promise<any>
}

export class SQLEngine {

    db!: sqlite.Database;

    constructor(database: string) {
        this.db = new sqlite3.Database(database, (err) => {
            if (err) {
                Log.e("dbhelper init error:", err)
            } else {
                Log.i("dbhelper inited")
            }
        });
    }

    // async onUpgrade() {
    //     Log.i('db upgrade run...')
    //     // let ret = await this.runSql(`ALTER TABLE "post" RENAME COLUMN "title" TO "name"`)
    //     let ret = await this.runSql(`ALTER TABLE "post" ADD COLUMN "plain" DEFAULT 'unkown'`)
    //     Log.i('db upgrade end')
    //     return ret
    // }

    runSql(sql: string) {
        return new Promise<Ret>((resolve, rejcet) => {
            this.db.run(sql, (err) => {
                if (!err) {
                    resolve({ code: 0, data: "" });
                } else {
                    rejcet({ code: -1, data: err });
                }
            });
        })
    }

    getSql(sql: string) {
        return new Promise<Ret>((resolve, rejcet) => {
            this.db.get(sql, (err, row) => {
                if (!err) {
                    resolve({ code: 0, data: row });
                } else {
                    rejcet({ code: -1, data: err });
                }
            });
        })
    }

    checkTableExist(tablename: string) {
        // SELECT count(*) as c FROM sqlite_master WHERE type='table' AND name='record';

        const sql = `SELECT count(*) as c FROM sqlite_master WHERE type='table' AND name='${tablename}'`;

        return new Promise<Ret>((resolve, rejcet) => {
            this.db.get(sql, (err, row) => {
                if (!err) {
                    Log.i('check table exist :', row)
                    let count = row.c
                    resolve({ code: 0, data: count > 0 });
                } else {
                    rejcet({ code: -1, data: err });
                }
            });
        })
    }
}