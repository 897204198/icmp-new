import { Component, NgZone } from '@angular/core';
import { UserService, initUserInfo, UserInfoState } from '../../app/services/user.service';

@Component({
  selector: 'page-chat-list',
  templateUrl: 'chatList.html',
})
export class ChatListPage {

  private chatList: Array<Object> = [];
  // 用户信息数据
  userInfo: UserInfoState = initUserInfo;

  /**
   * 构造函数
   */
  constructor(private zone: NgZone,
    private userService: UserService) {

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
    (<any>window).huanxin.getChatList('', (retData) => {
      this.zone.run(() => {
        this.chatList = retData;
      });
    }, (retData) => { });
  }

  /**
   * 发起聊天插件
   */
  chatToUserOrGroup(item: Object) {
    item['from_user_id'] = this.userInfo.userId;
    item['from_username'] = this.userInfo.userName;
    item['from_headportrait'] = this.userInfo.headImage;
    item['to_user_id'] = item['toChatUsername'];
    item['to_username'] = item['toChatNickName'];
    item['to_headportrait'] = item['headImage'];
    (<any>window).huanxin.chat(item, (retData) => {

    }, (retData) => { });
  }
}
