import { Http } from '@angular/http';
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
import { ResetPasswordPage } from './resetPassword/resetPassword';
import { FeedbackPage } from './feedback/feedback';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import {ToastService} from "../../app/services/toast.service";

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
  // 意见反馈页
  feedbackPage: any = FeedbackPage;
  // 关于我们页
  aboutPage: any;
  resetPasswordPage: any;
  surname: string;

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
    private pushService: PushService,
    private http: Http,
    private userService: UserService,
    private deviceService: DeviceService,
    private translate: TranslateService,
    private statusBar: StatusBar,
    private platform: Platform,
    private toastService: ToastService,
    private appVersionUpdateService: AppVersionUpdateService) {

    this.userInfoPage = UserInfoPage;
    this.newsNoticePage = NewsNoticePage;
    this.safeAndPrivacyPage = SafeAndPrivacyPage;
    this.generalPage = GeneralPage;
    this.aboutPage = AboutPage;
    this.resetPasswordPage = ResetPasswordPage;
    this.translate.get(['ALREADY_LATEST_VERSION']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }
  /**
   * 首次进入页面
   */
  ionViewDidLoad() {
    // 设置个人信息
    this.userInfo = this.userService.getUserInfo();
    this.surname = this.userInfo.userName[0];
    // 获取当前程序的版本名
    let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
    if (deviceInfo == null) {
      this.appVersionName = '';
    } else {
      this.appVersionName = deviceInfo.versionNumber;
    }
  }

  /**
   * 每次进入页面
   */
  ionViewWillEnter() {
    if (this.platform.is('android')) {
      this.statusBar.backgroundColorByHexString('#0079fa');
    }
  }

  /**
   * 每次离开页面
   */
  ionViewWillLeave() {
    if (this.platform.is('android')) {
      this.statusBar.backgroundColorByHexString('#ffffff');
    }
  }

  /**
   * 检查更新
   */
  checkVersion() {
    this.appVersionUpdateService.checkAppVersion(false);
  }

  /**
   * 退出登录
   */
  logOut() {
    // 推送服务取消与当前用户的绑定关系
    this.toastService.show("src-Setting-logOut");
    this.pushService.unBindUserid(this.userInfo.userId);
    // 取消自动登录
    this.userService.logout();
    this.http.post('/user/logoff', {}).subscribe(() => { }, () => { });
    // 退出
    const data = {
      loginStatus: 'logout'
    };
    this.navCtrl.push(LoginPage, data).then(() => {
      const startIndex = this.navCtrl.getActive().index - 1;
      this.navCtrl.remove(startIndex, 1);
    });
    (<any>window).huanxin.imlogout();
  }
}
