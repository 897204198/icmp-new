import { Component, NgZone } from '@angular/core';
import { ToastService } from '../../../app/services/toast.service';
import { Http, Response } from '@angular/http';
import { UserInfoState, UserService } from '../../../app/services/user.service';
import { DeviceService } from '../../../app/services/device.service';
import { NavParams } from 'ionic-angular/navigation/nav-params';

/**
 * 个人资料
 */
@Component({
  selector: 'page-user-profile',
  templateUrl: 'userProfile.html'
})
export class UserProfilePage {

  // 对方用户信息
  private toUserInfo: Object = {};
  // 自己用户信息
  private fromUserInfo: UserInfoState;
  /**
   * 构造函数
   */
  constructor(private http: Http,
    private zone: NgZone,
    private navParams: NavParams,
    private toastService: ToastService,
    private userService: UserService,
    private deviceService: DeviceService) { }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    // 设置个人信息
    this.fromUserInfo = this.userService.getUserInfo();
    let searchUserId: string = this.navParams.get('toUserId');
    this.getUserInfoFromNet(searchUserId);
  }

  /**
   * 取得用户信息
   */
  getUserInfoFromNet(userId: string): void {
    let params = {
      userId: userId
    };
    this.http.get('/user/base-info', { params: params }).subscribe((res: Response) => {
      let data: Object = res.json();
      if (data['sex']['code'] === '0' || data['sex']['code'] === 0) {
        data['sexName'] = '男';
      } else {
        data['sexName'] = '女';
      }
      this.toUserInfo = data;
    }, (err: Response) => {
      this.toastService.show(err.text());
    });
  }

  /**
   * 发起聊天插件
   */
  chatToUser() {
    let params: Object = {};
    params['from_user_id'] = this.fromUserInfo.userId;
    params['from_username'] = this.fromUserInfo.userName;
    params['from_headportrait'] = this.fromUserInfo.headImage;
    params['to_user_id'] = this.toUserInfo['userId'];
    params['to_username'] = this.toUserInfo['nickName'];
    params['to_headportrait'] = this.toUserInfo['headImageContent'];
    params['chatType'] = 'singleChat';
    (<any>window).huanxin.chat(params);
  }

  /**
   * 后台没传头像 或 头像无法加载 时加载占位图头像
   * 如果是手机则获取原生缓存的图片
   * 如果是 web 版则显示默认占位图
   */
  setWordHeadImage() {
    // 避免在 web 上无法显示页面
    if (this.deviceService.getDeviceInfo().deviceType) {
      let params: Object = {};
      let nickName: string = this.navParams.get('nickName');
      params['nickName'] = nickName.substring(0, 1);
      (<any>window).huanxin.getWordHeadImage(params, (retData) => {
        this.zone.run(() => {
          this.toUserInfo['headImage'] = retData;
        });
      });
    } else {
      this.toUserInfo['headImage'] = './assets/images/user.jpg';
    }
  }
}
