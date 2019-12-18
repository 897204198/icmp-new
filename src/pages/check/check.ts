import { Component, Inject, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController, Events, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { BackButtonService } from '../../app/services/backButton.service';
import { AlertController } from 'ionic-angular';
import { APP_CONSTANT, AppConstant } from '../../app/constants/app.constant';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../app/services/toast.service';
import { CryptoService } from '../../app/services/crypto.service';
import { PushService } from '../../app/services/push.service';
import { UserInfoState, initUserInfo, UserService } from '../../app/services/user.service';
import { AppVersionUpdateService } from '../../app/services/appVersionUpdate.service';
import { DeviceService } from '../../app/services/device.service';
import { ConfigsService } from '../../app/services/configs.service';
import { NativeStorage } from '@ionic-native/native-storage';
import { LoginPage } from '../../pages/login/login';
import { MyDatabaseService } from '../../app/services/mydatabase';

/**
 * 登录页面
 */
@Component({
  selector: 'page-check',
  templateUrl: 'check.html'
})
export class CheckPage {

  // 用户信息（用户名、密码、昵称等）
  private userInfo: UserInfoState = initUserInfo;
  // 国际化文字
  private transateContent: Object;

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
    private nativeStorage: NativeStorage,
    private pushService: PushService,
    private cryptoService: CryptoService,
    private backButtonService: BackButtonService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    private mydatabase: MyDatabaseService,
    @Inject(APP_CONSTANT) private appConstant: AppConstant,
    private configsService: ConfigsService,
    private translate: TranslateService,
    private toastService: ToastService,
    private deviceService: DeviceService,
    private zone: NgZone,
    private http: Http,
    private events: Events,
    private userService: UserService,
    private appVersionUpdateService: AppVersionUpdateService) {
    let translateKeys: string[] = ['DEVELOPER_MODE', 'PLEASE_ENTER_CHECKCODE', 'CANCEL', 'CONFIRM', 'PASSWORD_WRONG', 'PLEASE_ENTER_ACCOUNT', 'ERROR_ACCOUNT_PASSWORD', 'ERROR_DEVICE', 'PLEASE_LOGIN', 'ERROR_ACCOUNT_CHECKCODE', 'CHECKCODE_SUCCEED'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad() {
    this.mydatabase.initTable();
  }

  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    this.userInfo = this.userService.getUserInfo();
    if (!this.userInfo) {
      this.userInfo = initUserInfo;
    }
    if (this.userInfo['savePassword'] === false) {
      this.userInfo['password0'] = '';
    }
  }

  /**
   * 激活事件
   */
  logIn(password: HTMLInputElement): void {
    if (password.value == null || password.value === '') {
      this.toastService.show(this.transateContent['PLEASE_ENTER_CHECKCODE']);
    } else {
      if (password.value !== null || password.value !== '') {
        let url;
        if (localStorage.getItem('getServiceKeyUrl')) {
          url = localStorage.getItem('getServiceKeyUrl') + 'signature' + '?access_token=8dc26ea2-e0ab-4fc5-a605-ff7a890ed026';
        } else {
          url = this.configsService.getServiceKeyUrl() + 'signature' + '?access_token=8dc26ea2-e0ab-4fc5-a605-ff7a890ed026';
        }
        localStorage.removeItem('__proper_SecureStorage_deviceInfo');
        localStorage.removeItem('serviceheader');
        this.http.post(url, password.value).subscribe((data) => {
          localStorage.token = data['_body'];
          this.toastService.show(this.transateContent['CHECKCODE_SUCCEED']);
          this.navCtrl.push(LoginPage);
          this.mydatabase.insert(['1216', password.value], function(data){
            console.log('插入成功' + data);
          });
          // 设置设备信息
          this.deviceService.setDeviceInfo();
        }, (res2: Response) => {
          this.toastService.show(res2.text());
        });
      }else{
        this.toastService.show(this.transateContent['ERROR_ACCOUNT_CHECKCODE']);
      }
    }
  }
}
