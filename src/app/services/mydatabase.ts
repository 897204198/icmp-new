import { SQLiteService } from './sqlite.service';
import { Injectable } from '@angular/core';
// //自定义服务
// import { NativeService } from "./NativeService";
// import { SQLITE } from './Constants';

@Injectable()
export class MyDatabaseService {
    constructor(private sqlService: SQLiteService){

    }
    initTable(){
    let sql = 'create table IF NOT EXISTS userInfo(id INTEGER PRIMARY KEY,checkup VARCHAR(32))';
    this.sqlService.executeSql(sql).then((data) => {
      console.log(data);
    }).catch((err) => {
      console.log(err);
    });
    }

    insert(params: any = [], callback: Function): any{
        let sql = 'insert into userInfo values(?, ?)';
        this.sqlService.executeSql(sql, params).then((data) => {
            console.log(data);
            return callback(data);
          }).catch((err) => {
            console.log(err);
          });
    }
    select(params: any = [], callback: Function){
        let sql = 'SELECT id, checkup FROM  userInfo  WHERE id = ?';
        this.sqlService.executeSql(sql, params).then((data: any) => {
            console.log(data.res.rows.item(0).checkup);
            return callback(data);
          }).catch((err) => {
            console.log(err);
            return callback(err);
          });

    }
    updateCheckup(params: any = [], callback: Function){
        let sql = 'UPDATE userInfo SET checkup = ? WHERE id = ?';
        this.sqlService.executeSql(sql, params).then((data) => {
            console.log(data);
            return callback(data);
          }).catch((err) => {
            console.log(err);
          });
    }
}
