import { SQLite, SQLiteObject, SQLiteTransaction } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { DeviceInfoState, DeviceService } from './device.service';

// //自定义服务
// import { NativeService } from "./NativeService";
// import { SQLITE } from './Constants';

@Injectable()
export class SQLiteService {
    // window对象
    private win: any = window;
    // 数据库对象
    private database: SQLiteObject;

    constructor(private sqlite: SQLite, private deviceService: DeviceService,
    ) {
    }
    /**
  * 自动判断环境创建sqlite数据库
  * @memberof SQLService
  */
    public initDB() {
        let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
        if (!this.win.sqlitePlugin) {
            // window.openDatabase("数据库名字", "版本","数据库描述",数据库大小);
            this.database = this.win.openDatabase('myapp.db', '1.0',
                'icmpdb', '100kb');
            return;
        }
        if (deviceInfo.deviceType === 'android') {
            this.sqlite.create({
                name: 'myapp.db',
                location: 'default'
            }).then((db) => {
                console.log('创建成功啦');
                this.database = db;
            }).catch(err => {
                console.log(err);
            });
        }
        else {
            this.sqlite.create({
                name: 'myapp.db',
                iosDatabaseLocation: 'Documents'
            }).then((db) => {
                console.log('创建成功啦');
                this.database = db;
            }).catch(err => {
                console.log(err);
            });
        }


    }


    /**
     * 执行sql语句
     * @param {string} sql
     * @param {*} [params={}]
     * @returns {Promise<any>}
     * @memberof SQLService
     */
    executeSql(sql: string, params: any = []): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.database.transaction((tx: SQLiteTransaction) => {
                    tx.executeSql(sql, params, (tx, res) => {
                        resolve({ tx: tx, res: res });
                    }, (tx, err) => {
                        reject({ tx: tx, err: err });
                    });
                });
            }
            catch (err) {
                reject({ err: err });
            }
        });
    }
}
