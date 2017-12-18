import { Component, NgZone } from '@angular/core';
import { UserService, initUserInfo, UserInfoState } from '../../app/services/user.service';
import { Store } from '@ngrx/store';
import { ImReplaceBadageAction } from '../../app/redux/actions/im.action';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'page-chat-list',
  templateUrl: 'chatList.html',
})
export class ChatListPage {

  private chatList: Array<Object> = [];
  // 用户信息数据
  userInfo: UserInfoState = initUserInfo;
  // 查询拦截器
  private titleFilter: FormControl = new FormControl();
  // 查询keyword
  private keyword: string;

  /**
   * 构造函数
   */
  constructor(private zone: NgZone,
    private userService: UserService,
    private store: Store<string>) {
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
    (<any>window).huanxin.addMessageListener('', (addRetData) => {
      (<any>window).huanxin.getChatList('', (retData) => {
        this.zone.run(() => {
          this.chatList = retData;
          this.changeUnreadMessageNumber();
        });
      }, (retData) => { });
    }, (addRetData) => { });
  }

  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    (<any>window).huanxin.getChatList('', (retData) => {
      this.zone.run(() => {
        this.chatList = retData;
        this.changeUnreadMessageNumber();
      });
    }, (retData) => { });
  }

  /**
   * 改变 Tab 的未读数量
   */
  changeUnreadMessageNumber() {
    if (this.chatList.length === 0) {
      this.store.dispatch(new ImReplaceBadageAction(''));
    } else {
      let total: number = 0;
      let i: number = this.chatList.length;
      while (i) {
        i--;
        total += Number(this.chatList[i]['unreadMessagesCount']);
      }
      this.store.dispatch(new ImReplaceBadageAction(total.toString()));
    }
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
    (<any>window).huanxin.chat(item);
  }

  /**
   * 侧滑删除
   */
  removeConversation(item: Object) {
    let index = this.chatList.indexOf(item);
    this.chatList.splice(index, 1);
    (<any>window).huanxin.removeConversation(item);
  }
}
