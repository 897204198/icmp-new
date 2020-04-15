import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { DeviceInfoState, DeviceService } from './device.service';
import { IcmpConstant, ICMP_CONSTANT } from '../constants/icmp.constant';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from './toast.service';
import { AppVersion } from '@ionic-native/app-version';

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
  constructor(
    private http: Http,
    private alertCtrl: AlertController,
    private inAppBrowser: InAppBrowser,
    private appVersion: AppVersion,
    @Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
    private deviceService: DeviceService,
    private translate: TranslateService,
    private toastService: ToastService) {
  }

  /**
   * 检查版本更新
   */
  checkAppVersion(hiddenToast: boolean, isFirst?: boolean) {
    // 必须写在这里，否则无法英文转中文
    let translateKeys: string[] = ['APP_UPDATE_NOTE', 'PROMPT_INFO', 'UPDATE', 'NO_UPDATE', 'NEXT_TIME'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
    let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
    if (deviceInfo.deviceType === 'android') {
      this.http.get('http://icmp.propersoft.cn/propersoft/web/api/app/versions/latest').subscribe((res: Response) => {
        let data = res.json();
        // 截取版本号
        this.appVersion.getVersionCode().then((versionCode: string) => {
          let cutVersionCode: string = versionCode.toString();
          // 安卓去2
            let num = cutVersionCode.length - 1;
            if (cutVersionCode.charAt(num) === '2') {
              cutVersionCode = cutVersionCode.substring(0, num);
            }
          
          // 判断 ver 是否为空
          let currentVer: number = Number(cutVersionCode);
          if (data.ver != null && Number(data.ver) > currentVer) {
            if (data.note == null || data.note === '') {
              data.note = this.transateContent['APP_UPDATE_NOTE'];
            }
            // 是否为 forceUpdate
            if (data.forceUpdate) {
              let confirmAlert = this.alertCtrl.create({
                title: this.transateContent['PROMPT_INFO'],
                message: data.note,
                enableBackdropDismiss: false,
                buttons: [
                  {
                    text: this.transateContent['UPDATE'],
                    handler: () => {
                      this.doUpdateVersion(deviceInfo.deviceType, data);
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
                    text: this.transateContent['NEXT_TIME'],
                    role: 'cancel',
                    handler: () => {
                      if (isFirst && deviceInfo.deviceType === 'android') {
                        this.autoRun();
                      }
                    }
                  },
                  {
                    text: this.transateContent['UPDATE'],
                    handler: () => {
                      this.doUpdateVersion(deviceInfo.deviceType, data);
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
            if (isFirst && deviceInfo.deviceType === 'android') {
              this.autoRun();
            }
          }
        });
      });
    } else {
      // iOS从商店获取版本号
      this.http.get('https://itunes.apple.com/cn/lookup?id=1443707088').subscribe((res: Response) => {
        let data = res.json();
        let appstoreData = data.results[0];
        // 获取当前版本号
        this.appVersion.getVersionCode().then((versionCode: string) => {
          let cutVersionCode: string = versionCode.toString();
          let currentVer: number = Number(cutVersionCode);
          // 比对版本号
          if (appstoreData.version != null && Number(appstoreData.version) > currentVer) {
            let confirmAlert = this.alertCtrl.create({
              title: this.transateContent['PROMPT_INFO'],
              message: appstoreData.releaseNotes,
              buttons: [
                {
                  text: this.transateContent['NEXT_TIME'],
                  role: 'cancel',
                  handler: () => {
                  }
                },
                {
                  text: this.transateContent['UPDATE'],
                  handler: () => {
                    this.doUpdateVersion(deviceInfo.deviceType, appstoreData);
                  }
                }
              ]
            });
            confirmAlert.present();
          } else {
            if (!hiddenToast) {
              this.toastService.show(this.transateContent['NO_UPDATE']);
            }
          }
        });
      })
    }
  }

  /**
   * 更新版本
   */
  doUpdateVersion(deviceType: string, data?: any) {
    if (deviceType === 'android') {
      if (data && data.androidUrl) {
        this.inAppBrowser.create(data.androidUrl, '_system');
      } else {
        this.inAppBrowser.create(this.icmpConstant.androidUpdateUrl, '_system');
      }
    } else {
      if (data && data.iosUrl) {
        this.inAppBrowser.create(data.iosUrl, '_system');
      } else {
        this.inAppBrowser.create(this.icmpConstant.iosUpdateUrl, '_system');
      }
    }
  }

  /**
   * 安卓应用更新插件
   */
  updateAndroidVersion(data: any) {
    (<any>window).plugins.UpdateVersion.isUpdating(function (s) {
      if (!s.updating) {
        let versionInfo = {
          ver: data.ver || '0',
          url: data.androidUrl || '',
          note: data.note.replace(/(<br>)/g, '\n') || '有新版本需要更新！',
          forceUpdate: data.forceUpdate
        };
        (<any>window).plugins.UpdateVersion.checkVersion(versionInfo);
      }
    });
  }

  /**
   * 自启动提示
   */
  autoRun() {
    // if (localStorage.getItem('ignore_autorun') === '1') {
    //   return;
    // }
    // let translateKeys: string[] = ['CONFIRM', 'NO_NOTICE', 'PROMPT_INFO'];
    // this.translate.get(translateKeys).subscribe((res: Object) => {
    //   this.transateContent = res;
    // });
    // let alert = this.alertCtrl.create({
    //   title: this.transateContent['PROMPT_INFO'],
    //   message: '请开启此 App 的自动启动，以确保及时接收到新的消息通知。',
    //   buttons: [
    //     {
    //       text: this.transateContent['NO_NOTICE'],
    //       handler: () => {
    //         localStorage.setItem('ignore_autorun', '1');
    //       }
    //     },
    //     {
    //       text: this.transateContent['CONFIRM'],
    //       handler: () => {
    //         (<any>window).huanxin.autorun('');
    //       }
    //     }
    //   ]
    // });
    // alert.present();
  }
}

