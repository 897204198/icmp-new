import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ToastService } from '../../app/services/toast.service';
import { ScanDetailPage } from '../../pages/scan/scanDetail';
import { PhotoService } from '../../app/services/photo.service';
import { QueryDetailPage2 } from '../../pages2/query/queryDetail/queryDetail';

@Component({
  selector: 'page-scanConnect',
  templateUrl: 'scanConnect.html',
})

export class ScanConnectPage {

   // 串口号列表
   portNumberArray: Array<string> = [];
   // 串口号
   portNumber: string = '';
   // 波特率
   baudRate: number = 9600;

   constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private photoService: PhotoService,
    private toastService: ToastService,
    private zone: NgZone) { }

      // 进入页面
  ionViewDidLoad() {
    (<any>window).rfid.serialPortList('', (retData) => {
      this.zone.run(() => {
        this.portNumberArray = retData;
        this.portNumber = 'ttyS1 (rk_serial)';
      });
    }, (err) => {
      this.toastService.show('获取串口号失败');
    });
  }

  // 开始链接
  connect() {
    let params = {
      port: this.portNumber,
      baud: this.baudRate
    };
    (<any>window).rfid.connectScannerSerialPort(params, (retData) => {
      this.zone.run(() => {
        this.navCtrl.push(ScanDetailPage, this.navParams);
      });
    }, (err) => {
      this.toastService.show('连接失败');
    });
  }
  /**
   * 点击扫一扫按钮
   */
  manageMenus(): void {
    this.photoService.openScan(function(rfidInfo){
      if (rfidInfo) {
        const addInfo = Object.assign(this.navParams, { 'rfid': rfidInfo['text'], 'scan': true});
        if (!rfidInfo['cancelled']){
          this.navCtrl.push(QueryDetailPage2, addInfo);
          console.log('正确扫码 进入详情页');
        } else {
          console.log('未扫码 返回上一页');
          this.navCtrl.pop();
        }
      }
    });
  }
}
