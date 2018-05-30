import { Component } from '@angular/core';
import { NavController, AlertController, Alert } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DeviceService, DeviceInfoState } from '../../../app/services/device.service';
import { AppVersionUpdateService } from '../../../app/services/appVersionUpdate.service';
import { TranslateService } from '@ngx-translate/core';
import { OopStormPage } from './oopStorm/oopStorm';



/**
 * 关于我们
 */
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  // 国际化文字
  private transateContent: Object;
  // 弹出框对象
  private confirmAlert: Alert;
  // 弹出框是否打开
  private alertOpen: boolean = false;
  // 版本号
  versionNumber: string = '';
  // 版本码
  versionCode: string = '';

  constructor(
    public navCtrl: NavController,
    private translate: TranslateService,
    private deviceService: DeviceService,
    public alertCtrl: AlertController,
    private appVersionUpdateService: AppVersionUpdateService,
    private inAppBrowser: InAppBrowser) {
    this.translate.get(['PROMPT_INFO', 'APP_DOWNLOAD_SKIP_PROMPT', 'CANCEL', 'CONFIRM']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  ionViewDidLoad() {
    // 获取当前程序的版本名
    let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
    if (deviceInfo !== null) {
      this.versionNumber = deviceInfo.versionNumber;
      this.versionCode = deviceInfo.versionCode;
    }
  }

  // 跳转到公司主页
  oopStormWebClk() {
    this.inAppBrowser.create('http://www.propersoft.cn', '_system');
  }

  // 页面跳转
  oopStormClk() {
    this.navCtrl.push(OopStormPage, {versionNumber: this.versionNumber, versionCode: this.versionCode});
  }

  /**
   * 点击下载
   */
  downloadApp() {
    this.confirmAlert = this.alertCtrl.create({
      title: this.transateContent['PROMPT_INFO'],
      message: this.transateContent['APP_DOWNLOAD_SKIP_PROMPT'],
      buttons: [
        {
          text: this.transateContent['CANCEL'],
          handler: () => {
            this.alertOpen = false;
          }
        },
        {
          text: this.transateContent['CONFIRM'],
          handler: () => {
            let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
            this.appVersionUpdateService.doUpdateVersion(deviceInfo.deviceType);
          }
        }
      ]
    });
    this.confirmAlert.present();
    this.alertOpen = true;
  }

}
