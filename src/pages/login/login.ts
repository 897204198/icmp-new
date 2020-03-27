import { Component, Inject, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController, Events, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Platform } from 'ionic-angular';
import { BackButtonService } from '../../app/services/backButton.service';
import { AlertController } from 'ionic-angular';
import { AdminPage } from './admin/admin';
import { SetPasswordPage } from './setPassword/setPassword';
import { CheckPage } from '../check/check';
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
import { DeviceInfoState } from '../../app/services/device.service';
import { WebSocketService } from '../../app/services/webSocket.service';
import { SecureStorageService } from '../../app/services/secureStorage.service';
import { ICMP_CONSTANT, IcmpConstant } from '../../app/constants/icmp.constant';
import { MyDatabaseService } from '../../app/services/mydatabase';
import { SQLiteService } from '../../app/services/sqlite.service';
declare let cordova: any;

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
  // 激活码checkup
  private checkupStr: string = '';

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
    private secureStorageService: SecureStorageService,
    private nativeStorage: NativeStorage,
    private pushService: PushService,
    private cryptoService: CryptoService,
    private backButtonService: BackButtonService,
    private platform: Platform,
    private alertCtrl: AlertController,
    private mydatabase: MyDatabaseService,
    private sqlService: SQLiteService,
    private navParams: NavParams,
    @Inject(APP_CONSTANT) private appConstant: AppConstant,
    @Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
    private configsService: ConfigsService,
    private translate: TranslateService,
    private toastService: ToastService,
    private deviceService: DeviceService,
    private zone: NgZone,
    private http: Http,
    private events: Events,
    private userService: UserService,
    private wsService: WebSocketService,
    private appVersionUpdateService: AppVersionUpdateService) {
    let translateKeys: string[] = ['DEVELOPER_MODE', 'PLEASE_ENTER_PASSWORD', 'CANCEL', 'CONFIRM', 'PASSWORD_WRONG', 'PLEASE_ENTER_ACCOUNT', 'ERROR_ACCOUNT_PASSWORD', 'ERROR_DEVICE', 'PLEASE_LOGIN', 'PLEASE_ENTER_CHECKCODEFIRST'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
    // 注册安卓物理返回键
    // noinspection TypeScriptUnresolvedFunction
    this.platform.ready().then(() => {
      // 初始化sqlite数据库
      this.sqlService.initDB();
      this.backButtonService.registerBackButtonAction(null);
      
    });
    // 通过推送通知打开应用事
    document.removeEventListener('Properpush.openNotification', this.doOpenNotification.bind(this), false);
    document.addEventListener('Properpush.openNotification', this.doOpenNotification.bind(this), false);
    document.addEventListener('jpush.openNotification', this.doOpenNotification.bind(this), false);
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad() {
    let permissions = cordova.plugins.permissions;
    permissions.hasPermission(permissions.READ_PHONE_STATE, checkPermissionCallback, null);
    function checkPermissionCallback(status: any) {
      if (!status.hasPermission) {
        let errorCallback = function () {
          console.warn('电话权限没有打开');
        };
        permissions.requestPermission(
          permissions.READ_PHONE_STATE,
          function () {
            if (!status.hasPermission) {
              errorCallback();
              console.log('获取权限成功！');
            }
          },
          errorCallback);
      }
    }

    if (localStorage.getItem('login') === '1') {
      this.appVersionUpdateService.checkAppVersion(true, true);
      localStorage.setItem('login', '0');
    }
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
      if (!JSON.parse(localStorage.getItem('stopStreamline'))) {
        if (!localStorage.getItem('checkUp')) {
         // 取出激活码
        this.mydatabase.select(['1216'], (data: any) => {
          if (data.hasOwnProperty('err')) {
            this.toastService.show(this.transateContent['PLEASE_ENTER_CHECKCODEFIRST']);
          } else {
            this.checkupStr = data.res.rows.item(0).checkup;
            console.log('是否激活' + this.checkupStr);
            // 判断是否激活
            if (!this.checkupStr) {
              this.toastService.show(this.transateContent['PLEASE_ENTER_CHECKCODEFIRST']);
            } else {
              if (localStorage.getItem('pushinit') !== '1') {
                this.pushService.init();
                localStorage.setItem('pushinit', '1');
              }
              this.deviceService.setDeviceInfo();
              this.loginNetService(username.value, password.value);
            }
          }
        });
      }else{
          if (localStorage.getItem('pushinit') !== '1') {
            this.pushService.init();
            localStorage.setItem('pushinit', '1');
          }
          this.checkupStr = localStorage.getItem('checkUp');
          this.deviceService.setDeviceInfo();
          this.loginNetService(username.value, password.value);
        }
      } else {
        if (localStorage.getItem('pushinit') !== '1') {
          this.pushService.init();
          localStorage.setItem('pushinit', '1');
        }
        this.deviceService.setDeviceInfo();
        this.loginNetService(username.value, password.value);
      }
    }
  }

  /**
   * 校验事件
   */
  checkUp(username: HTMLInputElement, password: HTMLInputElement): void {
    this.navCtrl.push(CheckPage, { isAutoLogin: false }).then(() => {
    });
  }
  forget(): void {
    this.navCtrl.push(SetPasswordPage, { isAutoLogin: false }).then(() => {
    });
  }
  /**
   * 登录请求
   */
  loginNetService(account: string, password: string): void {
    localStorage.removeItem('serviceheader');
    if (!JSON.parse(localStorage.getItem('stopStreamline'))) {
      let getServicekeyUrl;
      if (localStorage.getItem('getServiceKeyUrl')) {
        getServicekeyUrl = localStorage.getItem('getServiceKeyUrl') + this.checkupStr + '?access_token=8dc26ea2-e0ab-4fc5-a605-ff7a890ed026';
      } else {
        getServicekeyUrl = this.configsService.getServiceKeyUrl() + this.checkupStr + '?access_token=8dc26ea2-e0ab-4fc5-a605-ff7a890ed026';
      }
      this.http.get(getServicekeyUrl).subscribe((res: Response) => {
        // 存储servicekey
        localStorage.setItem('serviceheader', res.headers.get('x-service-key'));
        // 传给原生
        this.nativeStorage.setItem('serviceKey', localStorage.getItem('serviceheader'));
        if (res.headers.get('x-service-key') === 'propersoft') {
          // 普日项目有环信
          localStorage.setItem('properSoft', '1');
        } else {
          localStorage.setItem('properSoft', '0');
        }
        this.loginService(account, password);
      });
    } else {
      if (JSON.parse(localStorage.getItem('OA'))) {
        localStorage.setItem('todoState', '2');
      } else {
        localStorage.setItem('haveIM', '');
      }
      this.loginService(account, password);
    }
  }
  loginService(account: string, password: string): void {
    // 登录接口请求
    // 加密密码
    let md5password: string = password;
    if (this.appConstant.oaConstant.md5Encryption) {
      md5password = this.cryptoService.hashMD5(md5password, true);
    }
    // 请求参数
    let params: Object = {
      'username': account,
      'pwd': md5password
    };
    this.http.post('/auth/login', params).subscribe((data) => {
      localStorage.token = data['_body'];
      this.http.get('/auth/current/user').subscribe((res3: Response) => {
        let userData = res3.json()['data'];
        let status: string = '';
        if (userData['status'] != null && userData['status'] !== '') {
          status = userData['status']['code'];
        }
        let sex: string = '';
        let sexCode: string = '';
        if (userData['sex'] != null && userData['sex'] !== '') {
          if (userData['sex']['code'] === '0' || userData['sex']['code'] === 0) {
            sex = '男';
          } else {
            sex = '女';
          }
          sexCode = userData['sex']['code'];
        }
        let newUserInfo: UserInfoState = {
          account: account,
          loginName: userData['username'],
          password: md5password,
          password0: password,
          savePassword: this.userInfo.savePassword,
          userId: userData['id'],
          userName: userData['name'],
          headImage: userData['headImageContent'] ? userData['headImageContent'] : '',
          jobNumber: userData['jobNumber'],
          phone: userData['phone'],
          email: userData['email'],
          outter: userData['outter'],
          sexCode: sexCode,
          sex: sex,
          status: status
        };
        this.userService.saveUserInfo(newUserInfo);
        this.userService.login();
        let tabParams: Object = {
          catalog: 'APPLICATION_TAB'
        };
        this.wsService.connection(localStorage.token, () => {
          localStorage.setItem('sock', '1');
          console.log('连接成功');
        });
        // 极光推送需要的参数
        if (localStorage.getItem('properSoft') !== '1') {
          // 普日项目不使用极光推送
          let pushParams: URLSearchParams = new URLSearchParams();
          let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
          pushParams.append('appKey', '95183265e6d2173b2375cdf3');
          pushParams.append('deviceId', deviceInfo.deviceId);
          pushParams.append('userId', userData['id']);
          pushParams.append('deviceType', deviceInfo.deviceType);
          pushParams.append('phoneType', deviceInfo.deviceModel);
          pushParams.append('manufacturer', deviceInfo.manufacturer);
          pushParams.append('phoneModel', deviceInfo.deviceModel);
          let jpushRegisterId = this.secureStorageService.getObject('registerId');
          pushParams.append('registerID', jpushRegisterId);
          this.http.post('/webController/afterLoginRegisterForJiGuang', pushParams).subscribe((res1: Response) => {
            let data1 = res1.json();
            if (data1.result === this.icmpConstant.reqResultSuccess) {
              console.log('推送信息成功');
            } else {
              this.toastService.show(data1.errMsg);
            }
          }, (res1: Response) => {
            this.toastService.show(res1.text());
          });
        }
        // 获取底部tabs
        this.http.get('/application/tab', { params: tabParams }).subscribe((res4: Response) => {
          let tabsData = res4.json();
          localStorage.setItem('tabsData', JSON.stringify(tabsData));
          const result = JSON.parse(localStorage.getItem('tabsData'));
          let haveSettingpage = false;
          for (let index = 0; index < result.length; index++) {
            const element = result[index];
            if (element['root'] === 'ChatListPage') {
              // 首页底部有消息环信功能呢
              localStorage.setItem('haveIM', '1');
            }
            if (element['root'] === 'TodoListPage1') {
              // 待办是新版打开react页面
              localStorage.setItem('todoState', '1');
            }
            if (element['root'] === 'TodoListPage2') {
              // 待办是旧版版打开angular页面
              localStorage.setItem('todoState', '2');
            }
            if (element['root'] === 'SettingPage') {
              // 是否有我的页面
              haveSettingpage = true;
            }
          }
          if (!haveSettingpage) {
            // 后台没有返回手动添加我的页面
            let settingPage = { 'root': 'SettingPage', 'tabTitle': '我的', 'tabIcon': 'person', 'params': { 'processName': '', 'name': '' } };
            tabsData.push(settingPage);
            localStorage.setItem('tabsData', JSON.stringify(tabsData));
          }
          // 避免在 web 上无法显示页面
          let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
          if (deviceInfo.deviceType) {
            let imparams = {
              username: newUserInfo.loginName,
              password: password,
              baseUrl: this.configsService.getBaseUrl(),
              pushUrl: this.configsService.getBaseUrl(),
              chatKey: this.configsService.getChatKey(),
              token: 'Bearer ' + localStorage['token'],
              chatId: newUserInfo.userId,
              pushAppId: this.appConstant.properPushConstant.appId,
              ext: {
                from_user_id: newUserInfo.loginName,
                from_username: newUserInfo.userName,
                from_headportrait: newUserInfo.headImage
              }
            };
            if (localStorage.getItem('haveIM') === '1') {
              (<any>window).huanxin.imlogin(imparams, (loginData) => {
                this.zone.run(() => {
                  if (loginData === 'user_not_found') {
                    localStorage.setItem('imIsOpen', '0');
                  } else {
                    localStorage.setItem('imIsOpen', '1');
                  }
                  // 如果是从登录页登录的，则在 tabs 页不执行自动登录
                  this.navCtrl.push(TabsPage, { isAutoLogin: false, tabsArr: tabsData }).then(() => {
                    const startIndex = this.navCtrl.getActive().index - 1;
                    this.navCtrl.remove(startIndex, 1);
                    this.events.publish('logined');
                  });
                });
              });
            } else {
              // 如果是从登录页登录的，则在 tabs 页不执行自动登录
              this.navCtrl.push(TabsPage, { isAutoLogin: false, tabsArr: tabsData }).then(() => {
                const startIndex = this.navCtrl.getActive().index - 1;
                this.navCtrl.remove(startIndex, 1);
                this.events.publish('logined');
              });
            }
            this.pushService.bindUserid(newUserInfo.userId);
          } else {
            // Web 版不进行推送绑定，直接进首页
            this.navCtrl.push(TabsPage, { isAutoLogin: false, tabsArr: tabsData }).then(() => {
              const startIndex = this.navCtrl.getActive().index - 1;
              this.navCtrl.remove(startIndex, 1);
              this.events.publish('logined');
            });
          }
        });
      }, (err: Response) => {
        this.toastService.show(err.text());
      });
    }, (res2: Response) => {
      this.toastService.show(res2.text());
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
    if (event.hasOwnProperty('properCustoms')) {
      if ('updatesoftware' === event.properCustoms.gdpr_mpage) {
        this.appVersionUpdateService.checkAppVersion(true);
      } else {
        if (!this.userService.isLogin()) {
          this.toastService.show(this.transateContent['PLEASE_LOGIN']);
        }
      }
    } else {
      // 极光推送
      if ('updatesoftware' === event.extras.gdpr_mpage) {
        this.appVersionUpdateService.checkAppVersion(true);
      } else {
        if (!this.userService.isLogin()) {
          this.toastService.show(this.transateContent['PLEASE_LOGIN']);
        }
      }
    }
  }
}
