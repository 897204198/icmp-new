import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'page-addFriend',
  templateUrl: 'addFriend.html',
})
export class AddFriendPage {

  private searchInput: string;
  private contactInfos: Array<Object> = [];

  /**
   * 构造函数
   */
  constructor(private http: Http) {

  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {

  }

  onInput() {
    console.log(this.searchInput);
    this.contactInfos = [{
      'nickName': this.searchInput
    }];
  }

  onCancel() {

  }

  addFriend() {
    let params = {
      'username': this.searchInput
    };
    (<any>window).huanxin.addFriend(params, (retData) => {

    }, (retData) => { });
  }
}
