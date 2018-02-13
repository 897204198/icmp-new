import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GeneralPage } from './general/general';
import { AboutPage } from './about/about';
import { LoginPage } from '../login/login';
import { TranslateService } from '@ngx-translate/core';
import { UserInfoPage } from './userInfo/userInfo';
import { NewsNoticePage } from './newsNotice/newsNotice';
import { SafeAndPrivacyPage } from './safeAndPrivacy/safeAndPrivacy';
import { DeviceInfoState, DeviceService } from '../../app/services/device.service';
import { PushService } from '../../app/services/push.service';
import { UserService, initUserInfo, UserInfoState } from '../../app/services/user.service';
import { AppVersionUpdateService } from '../../app/services/appVersionUpdate.service';

/**
 * 设置首页
 */
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {

  // 用户信息数据
  userInfo: UserInfoState = initUserInfo;
  // 当前程序的版本名
  appVersionName: string;
  // 国际化文字
  transateContent: Object;
  // 用户详细信息页
  userInfoPage: any;
  // 新消息通知页
  newsNoticePage: any;
  // 安全与隐私页
  safeAndPrivacyPage: any;
  // 通用页
  generalPage: any;
  // 关于我们页
  aboutPage: any;

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
              private pushService: PushService,
              private userService: UserService,
              private deviceService: DeviceService,
              private translate: TranslateService,
              private appVersionUpdateService: AppVersionUpdateService) {
    this.userInfoPage = UserInfoPage;
    this.newsNoticePage = NewsNoticePage;
    this.safeAndPrivacyPage = SafeAndPrivacyPage;
    this.generalPage = GeneralPage;
    this.aboutPage = AboutPage;

    this.translate.get(['ALREADY_LATEST_VERSION']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    // 设置个人信息
    this.userInfo = this.userService.getUserInfo();
    // 获取当前程序的版本名
    let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
    if (deviceInfo == null) {
      this.appVersionName = '';
    } else {
      this.appVersionName = deviceInfo.versionNumber;
    }
  }

  /**
   * 检查更新
   */
  checkVersion(): void {
    this.appVersionUpdateService.checkAppVersion(false);
  }

  /**
   * 退出登录
   */
  logOut(): void {
    // 推送服务取消与当前用户的绑定关系
    this.pushService.unBindUserid();
    // 取消自动登录
    this.userService.logout();
    // 退出
    this.navCtrl.push(LoginPage).then(() => {
      const startIndex = this.navCtrl.getActive().index - 1;
      this.navCtrl.remove(startIndex, 1);
    });
  }
}
