import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ConfigsService } from '../../app/services/configs.service';

@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {

  private searchInput: string;

  private contactInfos: Array<Object> = [];

  /**
   * 构造函数
   */
  constructor(private http: Http,
    private configsService: ConfigsService) {

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
    this.contactInfos = [{
      'nickName': '测试用户'
    }];
  }

  onInput() {
    console.log(this.searchInput);
  }

  onCancel() {

  }

  applyAndNotification() {
    (<any>window).huanxin.apply('', (retData) => {

    }, (retData) => {});
  }

  addFriend() {
    (<any>window).huanxin.addFriend('', (retData) => {

    }, (retData) => {});
  }

  myGroup() {
    (<any>window).huanxin.group('', (retData) => {

    }, (retData) => {});
  }

  chatToUser(item: Object) {
    let params = item;
    (<any>window).huanxin.userProfile(params, (retData) => {

    }, (retData) => {});
  }

}
