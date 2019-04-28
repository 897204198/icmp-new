import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { ToastService } from '../../app/services/toast.service';
import { QueryDetailPage2 } from '../../pages2/query/queryDetail/queryDetail';


@Component({
  selector: 'page-scanDetail',
  templateUrl: 'scanDetail.html',
})
export class ScanDetailPage {
   // 盘存状态
   state: string = 'start';
   // 按钮文字
   buttonText: string = '开始盘存';
   // 资产列表
   itemArray: Array<Object> = [];
   count: number = 0;
   constructor(
     public navCtrl: NavController,
     public navParams: NavParams,
     private toastService: ToastService,
     private http: Http,
     private zone: NgZone) {
   }

   /**
   * 每次进入页面
   */
   ionViewDidEnter(): void {
    (<any>window).rfid.initScanner('', (retData) => {
      console.log('激光传回的值是：' + retData);
      if (retData) {
        let params = this.navParams.data;
        params['rfid'] = retData;
        params['scan'] = true;
        params['serviceName'] = 'AssetsInventoryRecordScanProcess';
        // if (!rfidInfo['cancelled']){
          console.log('正确扫码 进入详情页1');
          this.navCtrl.push(QueryDetailPage2, params);
        // } else {
        //   console.log('未扫码 返回上一页');
        //   this.navCtrl.pop();
        // }
      }
    }, (err) => {
      this.toastService.show('扫描失败');
    });
   }
    // 离开时销毁
    ionViewWillLeave() {
    (<any>window).rfid.destroyRFID('');
  }
   /**
   * 首次进入页面
   */
  ionViewDidLoad() {

  }
}
