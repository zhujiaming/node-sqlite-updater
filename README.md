### node-sqlite-updater

> 基于nodejs的客户端或服务端使用sqlite3时，对数据库文件进行版本管理升级的辅助工具库，对Electron+sqlite3+typeorm应用友好。

### 使用

```javascript
const dbFile = path.join("",'test.db')//目标数据库文件
const DB_VERSION = 1 //当前应用对应的当前数据库文件版本，每次+1会触发升级，默认从1开始。
const dbupgradeImpl = new DbUpgradeImpl() //数据库升级的具体内容是抽象接口，交给业务实现，参考./example/upgrade-impl.ts。

function beforInitDB() {
            let dbUpdater = new DbUpdater({
                vercode: 1, 
                database: dbFile,
                logging: true, //是否打印日志
                upgradeImpl: dbupgradeImpl
            });

            dbUpdater
                .init()
                .then(res => {
                    console.log('db update res',res)
                    initDB() //成功后继续正常db init
                }).catch(e => {
                    console.error('db update err', e)
                });
        }

function initDB(){
    // custom init db
}
```


