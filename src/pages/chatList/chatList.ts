import { Component } from '@angular/core';

@Component({
  selector: 'page-chat-list',
  templateUrl: 'chatList.html',
})
export class ChatListPage {

  private chatList: Array<Object> = [];

  /**
   * 构造函数
   */
  constructor() {

  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    this.chatList = [{
      'title': '测试用户',
      'lastTime': '2017.10.26'
    }];
  }

  ionViewDidEnter(): void {

  }

  chatToUserOrGroup(item: Object) {
    let params = item;
    (<any>window).huanxin.chat(params, (retData) => {

    }, (retData) => {});
  }
}
