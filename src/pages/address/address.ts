import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ConfigsService } from '../../app/services/configs.service';
import { AddFriendPage } from './addFriend/addFriend';
import { ApplyPage } from './apply/apply';
import { GroupPage } from './group/group';
import { FormControl } from '@angular/forms';
import { ToastService } from '../../app/services/toast.service';
import { UserService, initUserInfo, UserInfoState } from '../../app/services/user.service';

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
  userInfo: UserInfoState = initUserInfo;

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
    private configsService: ConfigsService,
    private toastService: ToastService,
    private userService: UserService,
    private http: Http) {
    this.titleFilter.valueChanges.debounceTime(500).subscribe(
      value => this.keyword = value
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

}
