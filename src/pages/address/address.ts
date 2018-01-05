import { Component, NgZone } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ConfigsService } from '../../app/services/configs.service';
import { AddFriendPage } from './addFriend/addFriend';
import { ApplyPage } from './apply/apply';
import { GroupPage } from './group/group';
import { FormControl } from '@angular/forms';
import { ToastService } from '../../app/services/toast.service';
import { DeviceService } from '../../app/services/device.service';
import { Keyboard } from '@ionic-native/keyboard';
import { UserProfilePage } from './userProfile/userProfile';

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
  // 隐藏顶部
  private hidTopItem: boolean = false;

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
    private configsService: ConfigsService,
    private toastService: ToastService,
    private deviceService: DeviceService,
    private zone: NgZone,
    private http: Http,
    private keyboard: Keyboard,
    private event: Events) {
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
    if (this.keyboard != null) {
      this.keyboard.onKeyboardShow().subscribe(() => this.event.publish('hideTabs'));
      this.keyboard.onKeyboardHide().subscribe(() => this.event.publish('showTabs'));
    }
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
   * 进入个人信息详情
   */
  lookUserProfile(item: Object) {
    this.navCtrl.push(UserProfilePage, item);
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

