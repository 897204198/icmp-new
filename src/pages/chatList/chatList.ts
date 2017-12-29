import { Component, NgZone } from '@angular/core';
import { UserService, initUserInfo, UserInfoState } from '../../app/services/user.service';
import { Store } from '@ngrx/store';
import { ImReplaceBadageAction } from '../../app/redux/actions/im.action';
import { FormControl } from '@angular/forms';
import { DeviceService } from '../../app/services/device.service';
import { Keyboard } from '@ionic-native/keyboard';
import { Events } from 'ionic-angular';

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
    private deviceService: DeviceService,
    private store: Store<string>,
    private keyboard: Keyboard,
    private event: Events) {
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
          this.checkRedMessage();
          this.changeUnreadMessageNumber();
        });
      }, (retData) => { });
    }, (addRetData) => { });
    if (this.keyboard != null) {
      this.keyboard.onKeyboardShow().subscribe(() => this.event.publish('hideTabs'));
      this.keyboard.onKeyboardHide().subscribe(() => this.event.publish('showTabs'));
    }
  }

  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    (<any>window).huanxin.getChatList('', (retData) => {
      this.zone.run(() => {
        this.chatList = retData;
        this.checkRedMessage();
        this.changeUnreadMessageNumber();
      });
    }, (retData) => { });
  }

  /**
   * 检查是否有需要标红的消息
   */
  checkRedMessage() {
    let i: number = this.chatList.length;
    while (i) {
      i--;
      if (this.chatList[i]['isRedMessage'] && this.chatList[i]['isRedMessage'] === '1') {
        let lastMessage: string = this.chatList[i]['lastMessage'];
        let redMessage: string = lastMessage.substr(0, lastMessage.indexOf(']') + 1);
        this.chatList[i]['redMessage'] = redMessage;
        this.chatList[i]['lastMessage'] = lastMessage.substr(redMessage.length, lastMessage.length - redMessage.length);
      }
    }
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
      if (total === 0) {
        this.store.dispatch(new ImReplaceBadageAction(''));
      } else {
        this.store.dispatch(new ImReplaceBadageAction(total.toString()));
      }
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

  /**
   * 后台没传头像 或 头像无法加载 时加载占位图头像
   * 如果是手机则获取原生缓存的图片
   * 如果是 web 版则显示默认占位图
   */
  setWordHeadImage(item: Object) {
    // 避免在 web 上无法显示页面
    if (this.deviceService.getDeviceInfo().deviceType) {
      let params: Object = {};
      let nickName: string = item['toChatNickName'];
      params['nickName'] = nickName.substring(0, 1);
      (<any>window).huanxin.getWordHeadImage(params, (retData) => {
        this.zone.run(() => {
          item['headImage'] = retData;
        });
      });
    } else {
      item['headImage'] = './assets/images/user.jpg';
    }
  }
}

