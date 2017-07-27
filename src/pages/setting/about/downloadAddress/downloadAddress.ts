import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Alert, AlertController } from 'ionic-angular';
import { DeviceInfoState, DeviceService } from '../../../../app/services/device.service';
import { AppVersionUpdateService } from '../../../../app/services/appVersionUpdate.service';

/**
 * App下载
 */
@Component({
  selector: 'page-download-address',
  templateUrl: 'downloadAddress.html'
})
export class DownloadAddressPage {

  // 国际化文字
  private transateContent: Object;
  // 弹出框对象
  private confirmAlert: Alert;
  // 弹出框是否打开
  private alertOpen: boolean = false;

  /**
   * 构造函数
   */
  constructor(private translate: TranslateService,
              public alertCtrl: AlertController,
              private deviceService: DeviceService,
              private appVersionUpdateService: AppVersionUpdateService) {
    this.translate.get(['PROMPT_INFO', 'APP_DOWNLOAD_SKIP_PROMPT', 'CANCEL', 'CONFIRM']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {}

  /**
   * 离开页面
   */
  ionViewWillLeave(): void {
    if (this.alertOpen) {
      this.confirmAlert.dismiss();
    }
  }

  /**
   * 点击下载
   */
  downloadApp(): void {
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
            let deviceInfo: DeviceInfoState =  this.deviceService.getDeviceInfo();
            this.appVersionUpdateService.doUpdateVersion(deviceInfo.deviceType);
          }
        }
      ]
    });
    this.confirmAlert.present();
    this.alertOpen = true;
  }
}
