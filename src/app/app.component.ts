import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './services/user.service';
import { DeviceService } from './services/device.service';
import { PushService } from './services/push.service';
import { InitService } from './services/init.service';
import { JPush } from '@jiguang-ionic/jpush';
import { SecureStorageService } from './services/secureStorage.service';
import { SQLiteService } from './services/sqlite.service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  // app页面
  rootPage: any;

  /**
   * 构造函数
   */
  constructor(
    statusBar: StatusBar,
    jpush: JPush,
    secureStorageService2: SecureStorageService,
    splashScreen: SplashScreen,
    keyboard: Keyboard,
    private sqlService: SQLiteService,
    private platform: Platform,
    private userService: UserService,
    private deviceService: DeviceService,
    private pushService: PushService,
    private translate: TranslateService,
    private initService: InitService) {

    // 判断是否已登录
    if (this.userService.isLogin()) {
      localStorage.setItem('tabs', '1');
      this.rootPage = TabsPage;
    } else {
      localStorage.setItem('login', '1');
      this.rootPage = LoginPage;
    }

    // noinspection TypeScriptUnresolvedFunction
    this.platform.ready().then(() => {
      keyboard.disableScroll(true);
      statusBar.styleDefault();
      if (this.platform.is('android')) {
        statusBar.backgroundColorByHexString('#ffffff');
      }
      splashScreen.hide();

      // 设置设备信息
      this.deviceService.setDeviceInfo();
      if (localStorage['serviceheader']) {
       // 初始化推送插件
       this.pushService.init();
       console.log('Component里创建插件');
       localStorage.setItem('pushinit', '1');
       localStorage.setItem('addPushNotification', '0');
      }
      // 极光推送代码
      document.addEventListener('jpush.receiveRegistrationId', function (event: any) {
        secureStorageService2.putObject('registerId', event.registrationId);
        console.log('receiveRegistrationId' + event.registrationId);
      }, false);
      jpush.init();
      jpush.setDebugMode(true);
      let getRegistrationID = function () {
         jpush.getRegistrationID().then((res: any) => {
          console.log('存储极光id' + res);
          secureStorageService2.putObject('registerId', res);
        }).catch(err => alert(err));
      };
      window.setTimeout(getRegistrationID, 1000);
    });
    // 初始化sqlite数据库
    this.sqlService.initDB();
    // 初始国际化
    this.translate.setDefaultLang('zh-cn');
  }
  ngOnInit() : void {
    // this.initService.getActivityInfo();
  }
}
