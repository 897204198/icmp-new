import { Component, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController, ModalController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Platform } from 'ionic-angular';
import { BackButtonService } from '../../app/services/backButton.service';
import { AlertController } from 'ionic-angular';
import { AdminPage } from './admin/admin';
import { APP_CONSTANT, AppConstant } from '../../app/constants/app.constant';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../app/services/toast.service';
import { ICMP_CONSTANT, IcmpConstant } from '../../app/constants/icmp.constant';
import { CryptoService } from '../../app/services/crypto.service';
import { PushService } from '../../app/services/push.service';
import { UserInfoState, initUserInfo, UserService } from '../../app/services/user.service';
import { AppVersionUpdateService } from '../../app/services/appVersionUpdate.service';

/**
 * 登录页面
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  // 用户信息（用户名、密码、昵称等）
  private userInfo: UserInfoState = initUserInfo;
  // 国际化文字
  private transateContent: Object;

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
    private modalCtrl: ModalController,
    private pushService: PushService,
    private cryptoService: CryptoService,
    private backButtonService: BackButtonService,
    private platform: Platform,
    private alertCtrl: AlertController,
    @Inject(APP_CONSTANT) private appConstant: AppConstant,
    @Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
    private translate: TranslateService,
    private toastService: ToastService,
    private http: Http,
    private userService: UserService,
    private appVersionUpdateService: AppVersionUpdateService) {
    let translateKeys: string[] = ['DEVELOPER_MODE', 'PLEASE_ENTER_PASSWORD', 'CANCEL', 'CONFIRM', 'PASSWORD_WRONG', 'PLEASE_ENTER_ACCOUNT', 'ERROR_ACCOUNT_PASSWORD', 'ERROR_DEVICE', 'PLEASE_LOGIN'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
    // 注册安卓物理返回键
    // noinspection TypeScriptUnresolvedFunction
    this.platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(null);
    });

    // 通过推送通知打开应用事
    document.addEventListener('Properpush.openNotification', this.doOpenNotification.bind(this), false);
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
   * 登录事件
   */
  logIn(username: HTMLInputElement, password: HTMLInputElement): void {
    if (username.value == null || username.value === '') {
      this.toastService.show(this.transateContent['PLEASE_ENTER_ACCOUNT']);
    } else if (password.value == null || password.value === '') {
      this.toastService.show(this.transateContent['PLEASE_ENTER_PASSWORD']);
    } else {
      this.loginNetService(username.value, password.value);
    }
  }

  /**
   * 登录请求
   */
  loginNetService(loginName: string, password: string): void {

    // 加密密码
    let md5password: string = password;
    if (this.appConstant.oaConstant.md5Encryption) {
      md5password = this.cryptoService.hashMD5(md5password, true);
    }

    // 请求参数
    let params: URLSearchParams = new URLSearchParams();
    params.append('loginName', loginName);
    params.append('password', md5password);
    this.http.post('/webController/checkUserByLoginNameAndPassword', params).subscribe((res: Response) => {
      let data = res.json();
      if (data.result === this.icmpConstant.reqResultSuccess) {
        let newUserInfo: UserInfoState = {
          loginName: loginName,
          password: md5password,
          userName: data['user']['name'],
          password0: password,
          userId: data['userId'],
          savePassword: this.userInfo.savePassword
        };

        this.userService.saveUserInfo(newUserInfo);
        this.userService.login();
        this.pushService.bindUserid(data['userId'], loginName);

        let modal = this.modalCtrl.create(TabsPage);
        modal.present();
      } else if (data.result === '2') {
        if (data.errMsg != null && data.errMsg !== '') {
          this.toastService.show(data.errMsg);
        } else {
          this.toastService.show(this.transateContent['ERROR_ACCOUNT_PASSWORD']);
        }
      } else if (data.result === '3') {
        this.toastService.show(this.transateContent['ERROR_DEVICE']);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 长按启动管理按钮
   */
  pressEvent(): void {
    let adminConsolePass: string = this.appConstant.oaConstant.adminConsolePass;
    if (adminConsolePass != null && adminConsolePass !== '') {
      let alert = this.alertCtrl.create({
        title: this.transateContent['DEVELOPER_MODE'],
        inputs: [
          {
            name: 'password',
            type: 'password',
            placeholder: this.transateContent['PLEASE_ENTER_PASSWORD']
          }
        ],
        buttons: [
          {
            text: this.transateContent['CANCEL']
          },
          {
            text: this.transateContent['CONFIRM'],
            handler: data => {
              if (data.password === adminConsolePass) {
                this.navCtrl.push(AdminPage);
              } else {
                if (data.password == null || data.password === '') {
                  this.toastService.show(this.transateContent['PLEASE_ENTER_PASSWORD']);
                } else {
                  this.toastService.show(this.transateContent['PASSWORD_WRONG']);
                }
                return false;
              }
            }
          }
        ]
      });
      alert.present();
    }
  }

  /**
   * 推送打开事件处理
   */
  doOpenNotification(event: any): void {
    if ('updatesoftware' === event.properCustoms.gdpr_mpage) {
      this.appVersionUpdateService.checkAppVersion();
    } else {
      if (!this.userService.isLogin()) {
        this.toastService.show(this.transateContent['PLEASE_LOGIN']);
      }
    }
  }
}
