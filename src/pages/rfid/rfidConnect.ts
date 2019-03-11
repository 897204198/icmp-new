import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../app/services/toast.service';
import { RfidListPage } from './rfidList';

/**
 * Rfid 链接
 */
@Component({
  selector: 'page-rfidConnect',
  templateUrl: 'rfidConnect.html',
})
export class RfidConnectPage {

  // 盘存状态
  state: string = 'start';
  // 按钮文字
  buttonText: string = '开始盘存';
  // 资产列表
  itemArray: Array<Object> = [];
  // rfid 数组
  ecpIdArray: Array<string> = [];
  count: number = 0;

  constructor(
    public navCtrl: NavController,
    private toastService: ToastService,
    private http: Http,
    private zone: NgZone) {
  }

  // 进入页面
  ionViewDidLoad() {
    (<any>window).rfid.listener('', (retData) => {
      this.zone.run(() => {
        this.ecpIdArray.push(retData.epcId);
        let params: URLSearchParams = new URLSearchParams();
        params.append('epcCode', this.ecpIdArray.toString());
        this.http.post('/webController/getRoomStockOfRFID', params).subscribe((res: Response) => {
          let item: Object = res.json();
          this.itemArray = item['result_list'];
          for (let i = 0; i < this.itemArray.length; i++ ) {
            for (let j = 0; j < this.itemArray[i]['data'].length; j++) {
              let num_1 = Number(this.itemArray[i]['data'][j].search_Num);
              this.count = this.count + num_1;
            }
          }
        }, (res: Response) => {
          this.toastService.show(res.text());
        });
      });
    }, (err) => {
      this.toastService.show('盘存失败');
    });
  }

  // 刷新
  refreshRFID() {
    (<any>window).rfid.refreshRFID('', (retData) => {
      this.zone.run(() => {
        this.itemArray.splice(0, this.itemArray.length);
        this.ecpIdArray.splice(0, this.ecpIdArray.length);
      });
    }, (err) => {
      this.toastService.show('刷新失败');
    });
  }

  // 开始或结束盘存
  startEndRFID() {
    (<any>window).rfid.startEndRFID({ state: this.state });
    this.state = this.state === 'start' ? 'end' : 'start';
    this.buttonText = this.buttonText === '开始盘存' ? '结束盘存' : '开始盘存';
  }

  // 进入 rfid 列表
  getRfidList(item: any) {
    const params: Object = {
      title: item.room_name,
      epcCode: item.selected
    };
    this.navCtrl.push(RfidListPage, params);
  }
}
