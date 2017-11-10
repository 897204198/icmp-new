import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { FormControl } from '@angular/forms';
import { CreateGroupPage } from './createGroup';

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

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
    private http: Http) {
    this.titleFilter.valueChanges.debounceTime(500).subscribe(
      value => this.keyword = value
    );
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    this.allGroups = [
      {
        'nickName': '测试群组1',
        'toChatUsername': '31962609811457',
        'chatType': 'groupChat'
      },
      {
        'nickName': '测试群组2',
        'toChatUsername': '31962609811457',
        'chatType': 'groupChat'
      },
      {
        'nickName': '测试群组3',
        'toChatUsername': '31962609811457',
        'chatType': 'groupChat'
      }];
  }

  addGroup() {
    this.navCtrl.push(CreateGroupPage);
  }

  chatToGroup(group: Object) {
    let params = group;
    (<any>window).huanxin.chat(params, (retData) => {

    }, (retData) => { });
  }
}
