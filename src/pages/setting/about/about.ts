import { Component, Inject } from '@angular/core';
import { NavController, AlertController, Alert } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DeviceService, DeviceInfoState } from '../../../app/services/device.service';
import { AppVersionUpdateService } from '../../../app/services/appVersionUpdate.service';
import { TranslateService } from '@ngx-translate/core';
import { OopStormPage } from './oopStorm/oopStorm';
import { ToastService } from '../../../app/services/toast.service';
import { UserService } from '../../../app/services/user.service';
import { APP_CONSTANT, AppConstant } from '../../../app/constants/app.constant';
import { Keychain } from '@ionic-native/keychain';



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
  // 热部署版本
  chcpVersion: string = '';
  // 版本数据
  versionData: string = '';
  // 设备id
  deviceid: string = '';
  checkUpCode: string = '';
  VConsole = new (require('../../../../node_modules/vconsole/dist/vconsole.min.js'));

  constructor(
    public navCtrl: NavController,
    @Inject(APP_CONSTANT) private appConstant: AppConstant,
    private userService: UserService,
    private toastService: ToastService,
    private keychain: Keychain,
    private http: Http,
    private translate: TranslateService,
    private deviceService: DeviceService,
    public alertCtrl: AlertController,
    private appVersionUpdateService: AppVersionUpdateService,
    private inAppBrowser: InAppBrowser) {
    this.translate.get(['PROMPT_INFO', 'APP_DOWNLOAD_SKIP_PROMPT', 'CANCEL', 'CONFIRM']).subscribe((res: Object) => {
      this.transateContent = res;
    });
    document.getElementById('__vconsole').style.display = 'none';
  }

  ionViewDidLoad() {
    // 获取当前程序的版本名
    let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
    if (deviceInfo !== null) {
      this.versionNumber = deviceInfo.versionNumber;
      this.deviceid = deviceInfo.deviceId;
      if (deviceInfo.deviceType === 'android') {
        this.checkUpCode = localStorage.getItem('checkUp');
      } else {
        this.keychain.get('checkUp')
          .then(
            (value) => {
              this.checkUpCode = value;
            }
          )
          .catch(
            err => console.error('Error getting', err)
          );
      }
      // 截取版本号
      let cutVersionCode: string = deviceInfo.versionCode.toString();
      if (deviceInfo.deviceType === 'android') {
        let num = cutVersionCode.length - 1;
        if (cutVersionCode.charAt(num) === '2') {
          cutVersionCode = cutVersionCode.substring(0, num);
        }
      }
      this.versionCode = cutVersionCode;
    }
    if ((<any>window).chcp != null) {
      (<any>window).chcp.getVersionInfo((err: any, data: Object) => {
        this.chcpVersion = data['currentWebVersion'];
      });
    }
    this.getVersionDescription();
  }

  // 版本更新说明
  getVersionDescription() {
    this.http.get('/app/versions/' + this.versionCode).subscribe((res: Response) => {
      this.versionData = res.json();
    });
  }

  // 跳转到公司主页
  oopStormWebClk() {
    this.inAppBrowser.create('http://www.propersoft.cn', '_system');
  }

  // 页面跳转
  oopStormClk() {
    this.navCtrl.push(OopStormPage, {
      versionNumber: this.versionNumber,
      versionCode: this.versionCode,
      chcpVersion: this.chcpVersion
    });
  }
  // 打开或关闭调试的vconsole
  versionClk() {
    let adminConsolePass: string = this.appConstant.oaConstant.adminConsolePass;
    if (adminConsolePass != null && adminConsolePass !== '') {
      // debug模式
      let debugOn = localStorage.getItem('debug');
      if (debugOn !== '1') {
        document.getElementById('__vconsole').style.display = 'block';
        localStorage.setItem('debug', '1');
      } else {
        document.getElementById('__vconsole').style.display = 'none';
        localStorage.setItem('debug', '0');
      }
    } else {
      // release模式
      this.http.get('/sys/datadic/catalog/VCONSOLE_PERMISSION').subscribe((res: any) => {
        if (res._body != null && res._body !== '') {
          let userList = [];
          userList = res.json();
          let havedebug = this.in_arrays(userList, this.deviceid);
          if (havedebug) {
            let debugOn = localStorage.getItem('debug');
            if (debugOn !== '1') {
              document.getElementById('__vconsole').style.display = 'block';
              localStorage.setItem('debug', '1');
            } else {
              document.getElementById('__vconsole').style.display = 'none';
              localStorage.setItem('debug', '0');
            }
          }
        }
      }, (res: Response) => {
        this.toastService.show(res.text());
      });
    }
  }
  // 判断用户是否可以打开开发者模式
  in_arrays(list, deviceid) {
    for (let i = 0; i < list.length; i++) {
      if (list[i]['name'] === deviceid) {
        return true;
      }
    }
    return false;
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
            this.appVersionUpdateService.doUpdateVersion(deviceInfo.deviceType, this.versionData);
          }
        }
      ]
    });
    this.confirmAlert.present();
    this.alertOpen = true;
  }

}
