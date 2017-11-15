import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ConfigsService } from '../../app/services/configs.service';
import { AddFriendPage } from './addFriend/addFriend';
import { ApplyPage } from './apply/apply';
import { GroupPage } from './group/group';
import { FormControl } from '@angular/forms';
import { ToastService } from '../../app/services/toast.service';

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

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
    private configsService: ConfigsService,
    private toastService: ToastService,
    private http: Http) {
    this.titleFilter.valueChanges.debounceTime(500).subscribe(
      value => this.keyword = value
    );
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
    let params: URLSearchParams = new URLSearchParams();
    this.http.post('/im/fetchContactInfos', params).subscribe((res: Response) => {
      let data = res.json().data;
      console.log(JSON.stringify(data));
      if (res.json().result === '0') {
        this.contactInfos = data;
      } else {
        this.toastService.show(res.json().errMsg);
      }
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
    let params = item;
    (<any>window).huanxin.chat(params, (retData) => {

    }, (retData) => { });
  }

}
