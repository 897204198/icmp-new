import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DeviceInfoState, DeviceService } from './device.service';
import { IcmpConstant, ICMP_CONSTANT } from '../constants/icmp.constant';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './toast.service';

/**
 * APP版本检查更新服务
 */
@Injectable()
export class AppVersionUpdateService {

  // 国际化文字
  private transateContent: Object;

  /**
   * 构造函数
   */
  constructor(private http: Http,
              private alertCtrl: AlertController,
              private inAppBrowser: InAppBrowser,
              @Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
              private deviceService: DeviceService,
              private translate: TranslateService,
              private toastService: ToastService) {
  }

  /**
   * 检查版本更新
   */
  checkAppVersion(hiddenToast: boolean): void {
    // 必须写在这里，否则无法英文转中文
    let translateKeys: string[] = ['APP_UPDATE_NOTE', 'PROMPT_INFO', 'UPDATE', 'NO_UPDATE', 'NEXT_TIME'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
    let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
    this.http.get('/sys/app/versions/latest').subscribe((res: Response) => {
      let data = res.json();
      // 截取版本号
      let cutVersionCode: string = deviceInfo.versionCode.toString();
      if (data.ver != null && Number(data.ver) > Number(cutVersionCode)) {
        if (data.note == null || data.note === '') {
          data.note = this.transateContent['APP_UPDATE_NOTE'];
        }
        if (data.forceUpdate) {
          let confirmAlert = this.alertCtrl.create({
            title: this.transateContent['PROMPT_INFO'],
            message: data.note,
              buttons: [
                {
                  text: this.transateContent['UPDATE'],
                  handler: () => {
                    this.doUpdateVersion(deviceInfo.deviceType);
                  }
                }
              ]
            });
            confirmAlert.present();
        } else {
          let confirmAlert = this.alertCtrl.create({
            title: this.transateContent['PROMPT_INFO'],
            message: data.note,
            buttons: [
              {
                text: this.transateContent['NEXT_TIME']
              },
              {
                text: this.transateContent['UPDATE'],
                handler: () => {
                  this.doUpdateVersion(deviceInfo.deviceType);
                }
              }
            ]
          });
          confirmAlert.present();
        }
      } else {
        if (!hiddenToast) {
          this.toastService.show(this.transateContent['NO_UPDATE']);
        }
      }
    });
  }

  /**
   * 更新版本
   */
  doUpdateVersion(deviceType: string): void {
    if (deviceType === 'android') {
      this.inAppBrowser.create(this.icmpConstant.androidUpdateUrl, '_system');
    } else {
      this.inAppBrowser.create(this.icmpConstant.iosUpdateUrl, '_system');
    }
  }
}
