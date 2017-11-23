import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { FormControl } from '@angular/forms';
import { CreateGroupPage } from './createGroup';
import { ToastService } from '../../../app/services/toast.service';
import { UserService, initUserInfo, UserInfoState } from '../../../app/services/user.service';

@Component({
  selector: 'page-group',
  templateUrl: 'group.html',
})
export class GroupPage {

  // 全部群信息
  private allGroups: Array<Object> = [];
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
    this.fetchGroupInfos();
  }

  /**
   * 获取用户所有群组
   */
  fetchGroupInfos(): void {
    this.http.get('/im/groups').subscribe((res: Response) => {
      this.allGroups = res.json();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 创建群组
   */
  createGroup() {
    this.navCtrl.push(CreateGroupPage);
  }

  /**
   * 群聊
   */
  chatToGroup(item: Object) {
    let params: Object = {};
    params['from_user_id'] = this.userInfo.userId;
    params['from_username'] = this.userInfo.userName;
    params['from_headportrait'] = this.userInfo.headImage;
    params['to_user_id'] = item['groupId'];
    params['to_username'] = item['groupName'];
    params['to_headportrait'] = item['headImage'];
    params['chatType'] = 'groupChat';
    (<any>window).huanxin.chat(params, (retData) => {

    }, (retData) => { });
  }
}
