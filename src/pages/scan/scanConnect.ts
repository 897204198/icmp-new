import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastService } from '../../app/services/toast.service';
import { ScanDetailPage } from '../../pages/scan/scanDetail';

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
      (<any>window).rfid.initScanner('', (res) => {
        this.zone.run(() => {
          this.navCtrl.push(ScanDetailPage);
        });
      });
    }, (err) => {
      this.toastService.show('连接失败');
    });
  }
}
