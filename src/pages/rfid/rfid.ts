import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RfidConnectPage } from './rfidConnect';
import { ToastService } from '../../app/services/toast.service';

/**
 * Rfid
 */
@Component({
  selector: 'page-rfid',
  templateUrl: 'rfid.html',
})
export class RfidPage {

  // 串口号列表
  portNumberArray: Array<string> = [];
  // 串口号
  portNumber: string = '';
  // 波特率
  baudRate: number = 115200;

  constructor(
    public navCtrl: NavController,
    private toastService: ToastService,
    private zone: NgZone) { }

  // 进入页面
  ionViewDidLoad() {
    (<any>window).rfid.serialPortList('', (retData) => {
      this.zone.run(() => {
        this.portNumberArray = retData;
        this.portNumber = 'ttyS4 (rk_serial)';
      });
    }, (err) => {
      this.toastService.show('获取串口号失败');
    });
  }

  // 离开时销毁
  ionViewWillUnload() {
    (<any>window).rfid.destroyRFID('');
  }

  // 开始链接
  connect() {
    let params = {
      port: this.portNumber,
      baud: this.baudRate
    };
    (<any>window).rfid.connectSerialPort(params, (retData) => {
      (<any>window).rfid.initRFID('', (res) => {
        this.zone.run(() => {
          this.navCtrl.push(RfidConnectPage);
        });
      });
    });
  }
}
