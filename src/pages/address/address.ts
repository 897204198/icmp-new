import { Component, NgZone } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ConfigsService } from '../../app/services/configs.service';
import { AddFriendPage } from './addFriend/addFriend';
import { ApplyPage } from './apply/apply';
import { GroupPage } from './group/group';
import { FormControl } from '@angular/forms';
import { ToastService } from '../../app/services/toast.service';
import { UserService, initUserInfo, UserInfoState } from '../../app/services/user.service';
import { DeviceService } from '../../app/services/device.service';

@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {

  private contactInfos: Array<Object> = [];
  // 查询拦截器
  private titleFilter: FormControl = new FormControl();
  // 查询keyword
  private keyword: string;
  // 用户信息数据
  private userInfo: UserInfoState = initUserInfo;
  // 隐藏顶部
  private hidTopItem: boolean = false;

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
    private configsService: ConfigsService,
    private toastService: ToastService,
    private userService: UserService,
    private deviceService: DeviceService,
    private zone: NgZone,
    private http: Http) {
    this.titleFilter.valueChanges.debounceTime(500).subscribe(
      value => {
        this.keyword = value;
        if (this.titleFilter.value === '') {
          this.hidTopItem = false;
        } else {
          this.hidTopItem = true;
        }
      }
    );
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad() {
    // 设置个人信息
    this.userInfo = this.userService.getUserInfo();
  }

  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    this.fetchContactInfos();
  }

  /**
   * 获取用户通讯录
   */
  fetchContactInfos() {
    this.http.get('/im/contacts').subscribe((res: Response) => {
      this.contactInfos = res.json();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 申请和通知
   */
  applyAndNotification() {
    this.navCtrl.push(ApplyPage);
  }

  /**
   * 添加好友
   */
  addFriend() {
    this.navCtrl.push(AddFriendPage);
  }

  /**
   * 我的群组
   */
  myGroup() {
    this.navCtrl.push(GroupPage);
  }

  /**
   * 发起聊天插件
   */
  chatToUser(item: Object) {
    let params: Object = {};
    params['from_user_id'] = this.userInfo.userId;
    params['from_username'] = this.userInfo.userName;
    params['from_headportrait'] = this.userInfo.headImage;
    params['to_user_id'] = item['userId'];
    params['to_username'] = item['nickName'];
    params['to_headportrait'] = item['headImage'];
    params['chatType'] = 'singleChat';
    (<any>window).huanxin.chat(params, (retData) => {

    }, (retData) => { });
  }

  /**
   * 后台没传头像 或 头像无法加载 时加载占位图头像
   * 如果是手机则获取原生缓存的图片
   * 如果是 web 版则显示默认占位图
   */
  setWordHeadImage(item: Object) {
    // 避免在 web 上无法显示页面
    if (this.deviceService.getDeviceInfo().deviceType) {
      let params: Object = {};
      let nickName: string = item['nickName'];
      params['nickName'] = nickName.substring(0, 1);
      (<any>window).huanxin.getWordHeadImage(params, (retData) => {
        this.zone.run(() => {
          item['headImage'] = retData;
        });
      });
    } else {
      item['headImage'] = './assets/images/user.jpg';
    }
  }
}

