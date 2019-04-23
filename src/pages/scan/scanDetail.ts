import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../app/services/toast.service';


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
        this.count = retData.epcId;
        // this.ecpIdArray.push(retData.epcId);
        // let params: URLSearchParams = new URLSearchParams();
        // params.append('epcCode', this.ecpIdArray.toString());
        // this.http.post('/webController/getRoomStockOfRFID', params).subscribe((res: Response) => {
        //   let item: Object = res.json();
        //   this.itemArray = item['result_list'];
        //   this.count = item['total'];
        // }, (res: Response) => {
        //   this.toastService.show(res.text());
        // });
      });
    }, (err) => {
      this.toastService.show('盘存失败');
    });
  }
}