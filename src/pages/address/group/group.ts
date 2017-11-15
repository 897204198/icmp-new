import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { FormControl } from '@angular/forms';
import { CreateGroupPage } from './createGroup';
import { ToastService } from '../../../app/services/toast.service';

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
    this.fetchGroupInfos();
  }

  /**
   * 获取用户所有群组
   */
  fetchGroupInfos(): void {
    let params: URLSearchParams = new URLSearchParams();
    this.http.post('/im/fetchGroupInfos', params).subscribe((res: Response) => {
      let data = res.json().data;
      if (res.json().result === '0') {
        this.allGroups = data;
      } else {
        this.toastService.show(res.json().errMsg);
      }
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
  chatToGroup(group: Object) {
    let params = group;
    (<any>window).huanxin.chat(params, (retData) => {

    }, (retData) => { });
  }
}
