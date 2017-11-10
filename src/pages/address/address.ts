import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ConfigsService } from '../../app/services/configs.service';
import { AddFriendPage } from './addFriend/addFriend';
import { ApplyPage } from './apply/apply';
import { GroupPage } from './group/group';
import { FormControl } from '@angular/forms';

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
    private http: Http,
    private configsService: ConfigsService) {
    this.titleFilter.valueChanges.debounceTime(500).subscribe(
      value => this.keyword = value
    );
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {

  }

  ionViewDidEnter(): void {
    this.loadUserContactInfos();
  }

  loadUserContactInfos() {
    this.contactInfos = [
      {
        'toChatNickName': '测试用户1',
        'toChatUsername': 'a1',
        'chatType': 'singleChat'
      },
      {
        'toChatNickName': '测试用户2',
        'toChatUsername': 'a2',
        'chatType': 'singleChat'
      },
      {
        'toChatNickName': '测试用户3',
        'toChatUsername': 'a3',
        'chatType': 'singleChat'
      }];
  }

  applyAndNotification() {
    this.navCtrl.push(ApplyPage);
  }

  addFriend() {
    this.navCtrl.push(AddFriendPage);
  }

  myGroup() {
    this.navCtrl.push(GroupPage);
  }

  chatToUser(item: Object) {
    let params = item;
    (<any>window).huanxin.chat(params, (retData) => {

    }, (retData) => { });
  }

}
