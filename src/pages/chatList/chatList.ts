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
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    (<any>window).huanxin.getChatList('', (retData) => {
      this.chatList = retData;
    }, (retData) => { });
  }

  /**
   * 发起聊天插件
   */
  chatToUserOrGroup(item: Object) {
    let params = item;
    (<any>window).huanxin.chat(params, (retData) => {

    }, (retData) => {});
  }
}
