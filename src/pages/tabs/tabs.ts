import { Component, ViewChild, NgZone, ElementRef, Renderer, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Platform, Tabs, AlertController, NavController, Events, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SettingPage } from '../setting/setting';
import { BackButtonService } from '../../app/services/backButton.service';
import { AppVersionUpdateService } from '../../app/services/appVersionUpdate.service';
import { TodoDetailPage2 } from '../../pages2/todo/todoDetail/todoDetail';
import { UserService, UserInfoState } from '../../app/services/user.service';
import { ToastService } from '../../app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { QueryDetailPage2 } from '../../pages2/query/queryDetail/queryDetail';
import { QueryNoticeDetailPage2 } from '../../pages2/query/queryNoticeDetail/queryNoticeDetail';
import { AddressPage } from '../address/address';
import { ChatListPage } from '../chatList/chatList';
import { TodoListPage2 } from '../../pages2/todo/todoList/todoList';

import { Store } from '@ngrx/store';
import { IM_BADGE_STATE } from '../../app/redux/app.reducer';
import { ImReplaceBadageAction } from '../../app/redux/actions/im.action';
import { Home_BADGE_STATE } from '../../app/redux/app.reducer'; // 替换首页tab角标
import { HomeReplaceBadageAction } from '../../app/redux/actions/home.action';
import { TODO_BADGE_STATE } from '../../app/redux/app.reducer';
import { ConfigsService } from '../../app/services/configs.service';
import { AppConstant, APP_CONSTANT } from '../../app/constants/app.constant';
import { DeviceService } from '../../app/services/device.service';
import { LoginPage } from '../login/login';
import { PushService } from '../../app/services/push.service';
import { FeedbackPage } from '../setting/feedback/feedback';
import { ExamCustomFramePage } from '../exam/customFrame/customFrame';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { WaitDonePage } from '../exam/waitDone/waitDone';
import { OrganizationAddressPage } from '../../pages/address/organizationAddress/organizationAddress';
import { RoutersService } from '../../app/services/routers.service';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // Tab对象
  @ViewChild('myTabs') tabRef: Tabs;
  // Tab的所有页面
  tabRoots: Object[];
  // 国际化文字
  private transateContent: Object;
  // margin-bottom
  mb: any;
  // 用户信息
  userInfo: UserInfoState = this.userService.getUserInfo();
  // 是否是首次加载，用于解决杀进程状态点击推送跳转时还未登录问题
  private isFirst: boolean = true;
  bottomTabs: Object = {
    HomePage,
    ChatListPage,
    AddressPage,
    SettingPage,
    TodoListPage2,
    WaitDonePage,
    OrganizationAddressPage
  };

  /**
   * 构造函数
   */
  constructor(public navCtrl: NavController,
    private routersService: RoutersService,
    public platform: Platform,
    private navParams: NavParams,
    private http: Http,
    private zone: NgZone,
    private toastService: ToastService,
    private pushService: PushService,
    private userService: UserService,
    private backButtonService: BackButtonService,
    private appVersionUpdateService: AppVersionUpdateService,
    public alertCtrl: AlertController,
    private translate: TranslateService,
    private store: Store<string>,
    private elementRef: ElementRef,
    private configsService: ConfigsService,
    @Inject(APP_CONSTANT) private appConstant: AppConstant,
    private deviceService: DeviceService,
    private events: Events,
    private iab: InAppBrowser,
    private renderer: Renderer) {
    let translateKeys: string[] = ['PROMPT_INFO', 'CANCEL', 'VIEW', 'PUSH_OPEN_PROMPT_ONE', 'PUSH_OPEN_PROMPT_TWO', 'IM_CLOSE', 'IM_OPEN'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
    this.tabRoots = this.getTabInfo();
    // 通过推送通知打开应用事件
    if (localStorage.getItem('addPushNotification') !== '1') {
      document.addEventListener('Properpush.openNotification', this.doOpenNotification.bind(this), false);
      localStorage.setItem('addPushNotification', '1');
    }
    platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(this.tabRef);
      // debugger
      // alert('添加推送监听测试');
      // 自动登录
      this.autoLogin();
      if (localStorage.getItem('addPushNotification') !== '1') {
        document.addEventListener('Properpush.openNotification', this.doOpenNotification.bind(this), false);
        localStorage.setItem('addPushNotification', '1');
      }
      // app icon角标个数
      let iconNum: number = 0;
      let messageIconNum: number = 0;
      let homewaitIconNum: number = 0;

      if (localStorage.getItem('haveIM') === '1') {
        // 普日项目带聊天
        // 消息角标绑定
        this.store.select(IM_BADGE_STATE).subscribe((data: string) => {
          for (let i = 0; i < this.tabRoots.length; i++) {
            if (this.tabRoots[i]['tabTitle'] === '消息') {
              this.tabRoots[i]['tabBadge'] = data;
              messageIconNum = Number(data);
              iconNum = homewaitIconNum + messageIconNum;
              this.pushService.sendBadgeNotification(iconNum);
            }
          }
        });
        // 首页消息绑定
        this.store.select(Home_BADGE_STATE).subscribe((data: string) => {
          for (let i = 0; i < this.tabRoots.length; i++) {
            if (this.tabRoots[i]['tabTitle'] === '首页') {
              console.log('首页待办角标个数' + data);
              this.tabRoots[i]['tabBadge'] = data;
              homewaitIconNum = Number(data);
              iconNum = messageIconNum + homewaitIconNum;
              console.log('消息数' + iconNum);
              this.pushService.sendBadgeNotification(iconNum);
            }
          }
        });
      } else if (localStorage.getItem('haveIM') === '2') {
        // 袁艺项目
        // 待办tab消息绑定
        this.store.select(TODO_BADGE_STATE).subscribe((data: string) => {
          this.tabRoots[1]['tabBadge'] = data;
          iconNum = Number(data);
          this.pushService.sendBadgeNotification(iconNum);
        });
      } else {
        // 标准版本
        // 待办tab消息绑定
        this.store.select(TODO_BADGE_STATE).subscribe((data: string) => {
          this.tabRoots[1]['tabBadge'] = data;
          iconNum = Number(data);
          this.pushService.sendBadgeNotification(iconNum);
        });
      }
    });
  }

  /**
   * 进入页面时监听键盘事件
   */
  ionViewDidLoad() {
    let tabs = this.queryElement(this.elementRef.nativeElement, '.tabbar');
    let tabsHeight = tabs.clientHeight + 'px';
    this.events.subscribe('hideTabs', () => {
      this.renderer.setElementStyle(tabs, 'display', 'none');
      let SelectTab = this.tabRef.getSelected()._elementRef.nativeElement;
      let content = this.queryElement(SelectTab, '.scroll-content');
      this.mb = tabsHeight;
      this.renderer.setElementStyle(content, 'margin-bottom', '0');
    });
    this.events.subscribe('showTabs', () => {
      this.renderer.setElementStyle(tabs, 'display', '');
      let SelectTab = this.tabRef.getSelected()._elementRef.nativeElement;
      let content = this.queryElement(SelectTab, '.scroll-content');
      this.renderer.setElementStyle(content, 'margin-bottom', this.mb);
    });
    if (localStorage.getItem('tabs') === '1') {
      this.appVersionUpdateService.checkAppVersion(true, true);
      localStorage.setItem('tabs', '0');
    }
  }
  ionViewDidEnter(): void {
    // 通过推送通知打开应用事件
    if (localStorage.getItem('addPushNotification') !== '1') {
      document.addEventListener('Properpush.openNotification', this.doOpenNotification.bind(this), false);
      localStorage.setItem('addPushNotification', '1');
    }
  }
  /**
   * 取DOM元素
   */
  queryElement(elem: HTMLElement, q: string): HTMLElement {
    return <HTMLElement>elem.querySelector(q);
  }

  /**
   * 取得Tab配置信息
   */
  getTabInfo(): Object[] {
    const result  = JSON.parse(localStorage.getItem('tabsData'));
    if (result && result.length) {
      return  result.map(it => ({
        ...it,
        root: this.bottomTabs[it.root]
      }));
    }
    // if (localStorage.getItem('haveIM') === '1') {
    //   // 网页调试注销掉的，真机测试再打开
    //   // if (this.userService.imIsOpen()) { 
    //   return [
    //     { root: HomePage, tabTitle: '首页', tabIcon: 'home' },
    //     { root: ChatListPage, tabTitle: '消息', tabIcon: 'chatboxes' },
    //     { root: AddressPage, tabTitle: '通讯录', tabIcon: 'contacts' },
    //     { root: SettingPage, tabTitle: '我的', tabIcon: 'person' }
    //   ];
    //   // } else {
    //   //   return [
    //   //     { root: HomePage, tabTitle: '首页', tabIcon: 'home' },
    //   //     { root: SettingPage, tabTitle: '更多', tabIcon: 'person' }
    //   //   ];
    //   // }
    // } else if (localStorage.getItem('haveIM') === '2') {
    //   // 项目
    //   return [
    //     { root: HomePage, tabTitle: '首页', tabIcon: 'home' },
    //     {
    //       root: TodoListPage2, tabTitle: '待办', tabIcon: 'chatboxes', params: {
    //         processName: '',
    //         name: '待办列表'
    //       }
    //     },
    //     { root: SettingPage, tabTitle: '更多', tabIcon: 'person' }
    //   ];
    // } else {
    //   return [
    //     { root: HomePage, tabTitle: '首页', tabIcon: 'home' },
    //     { root: WaitDonePage, tabTitle: '待办', tabIcon: 'time' },
    //     { root: OrganizationAddressPage, tabTitle: '通讯录', tabIcon: 'contacts' },
    //     { root: SettingPage, tabTitle: '我的', tabIcon: 'person' }
    //   ];
    // }

  }

  /**
   * 推送打开事件处理
   */
  doOpenNotification(event: any) {
    // 获取修改tab角标数
    if (localStorage.getItem('haveIM') !== '2') {
      this.getWaitToDoNumber();
    } else {
      this.getTodoNumber(); // 项目获取待办数量
    }
    // 刷新首页待办角标和组件
    this.events.publish('refresh');
    if ('updatesoftware' === event.properCustoms.gdpr_mpage) {
      this.appVersionUpdateService.checkAppVersion(true);
    } else if (event.properCustoms.bean) {
      if (event.properAlert) {
        // 应用内
      } else if (event.properCustoms.push_type === 'chat') {
        let chatInfo: any = JSON.parse(event.properCustoms.bean);
        let params: Object = {};
        if (event.properCustoms.chatType === 'singleChat') {
          params['to_user_id'] = chatInfo.from_user_id;
          params['to_username'] = chatInfo.from_username;
          params['to_headportrait'] = chatInfo.from_headportrait;
          params['from_user_id'] = chatInfo.to_user_id;
          params['from_username'] = chatInfo.to_username;
          params['from_headportrait'] = chatInfo.to_headportrait;
        } else {
          params['from_user_id'] = this.userInfo.loginName;
          params['from_username'] = this.userInfo.userName;
          params['from_headportrait'] = this.userInfo.headImage;
          params['to_user_id'] = chatInfo.to_user_id;
          params['to_username'] = chatInfo.to_username;
          params['to_headportrait'] = chatInfo.to_headportrait;
        }
        params['chatType'] = event.properCustoms.chatType;
        params['chatId'] = chatInfo.chatId;
        params['isPush'] = '1';
        if (localStorage.getItem('haveIM') === '1') {
          (<any>window).huanxin.chat(params);
        }
      }
    } else {
      if (event.properAlert) {
        let messagesPrompt = this.alertCtrl.create({
          title: this.transateContent['PROMPT_INFO'],
          message: this.transateContent['PUSH_OPEN_PROMPT_ONE'] + event.properCustoms._proper_title + this.transateContent['PUSH_OPEN_PROMPT_TWO'],
          buttons: [
            {
              text: this.transateContent['CANCEL']
            },
            {
              text: this.transateContent['VIEW'],
              handler: data => {
                if ('todotasks' === event.properCustoms.gdpr_mpage) {
                  this.doOpenNotificationTodo(event.properCustoms);
                } else if ('noticetasks' === event.properCustoms.gdpr_mpage) {
                  this.doOpenNotificationNoticeQuery(event.properCustoms);
                } else if ('querytasks' === event.properCustoms.gdpr_mpage) {
                  this.doOpenNotificationQuery(event.properCustoms);
                } else if ('feedback' === event.properCustoms.gdpr_mpage) {
                  this.doOpenNotificationFeedback(event.properCustoms);
                } else if ('examList' === event.properCustoms.gdpr_mpage) {
                  this.doOpenNotificationExamlist(event.properCustoms);
                }
              }
            }
          ]
        });
        messagesPrompt.present();
      } else {
        if ('todotasks' === event.properCustoms.gdpr_mpage) {
          this.doOpenNotificationTodo(event.properCustoms);
        } else if ('noticetasks' === event.properCustoms.gdpr_mpage) {
          this.doOpenNotificationNoticeQuery(event.properCustoms);
        } else if ('querytasks' === event.properCustoms.gdpr_mpage) {
          this.doOpenNotificationQuery(event.properCustoms);
        } else if ('feedback' === event.properCustoms.gdpr_mpage) {
          this.doOpenNotificationFeedback(event.properCustoms);
        } else if ('examList' === event.properCustoms.gdpr_mpage) {
          this.doOpenNotificationExamlist(event.properCustoms);
        }
      }
    }
  }

  /**
   * 推送通知打开待办
   */
  doOpenNotificationTodo(customsDic: any) {
    let item: Object = {
      systemId: customsDic['systemId'],
      taskId: customsDic['taskId'],
      sign: customsDic['sign'],
      step: customsDic['step'],
      processName: customsDic['processName']
    };

    if (item['sign'] == null || item['sign'] === '') {
      let params: URLSearchParams = new URLSearchParams();
      params.append('taskId', item['taskId']);
      this.http.post('/webController/claim', params).subscribe((res: Response) => {
        let userInfo: UserInfoState = this.userService.getUserInfo();
        item['assignee'] = userInfo.loginName;
        this.navCtrl.push(TodoDetailPage2, item);
      }, (res: Response) => {
        this.toastService.show(res.text());
      });
    } else {
      this.navCtrl.push(TodoDetailPage2, item);
    }
  }

  // 推送通知打开查询
  doOpenNotificationQuery(customsDic: any) {
    this.navCtrl.push(QueryDetailPage2, customsDic);
  }

  // 推送通知打开通知查询
  doOpenNotificationNoticeQuery(customsDic: any) {
    this.navCtrl.push(QueryNoticeDetailPage2, customsDic);
  }

  // 推送通知打开意见反馈
  doOpenNotificationFeedback(customsDic: any) {
    // 首次不加载
    if (!this.isFirst) {
      this.navCtrl.push(FeedbackPage);
    }
    this.isFirst = false;
    this.events.subscribe('logined', () => {
      this.navCtrl.push(FeedbackPage);
    });
  }
  // 推送通知打开流程
  doOpenNotificationExamlist(customsDic: any) {
    // 首次不加载
    if (!this.isFirst) {
      this.openExamlist(customsDic);
    }
    this.isFirst = false;
    this.events.subscribe('logined', () => {
      this.openExamlist(customsDic);
    });
  }

  // 打开推送通知
  openExamlist(customsDic: any) {
    let menuStr: string = customsDic.url;
    const data = {
      name: customsDic.title,
      isPush: true,
      data: {
        url: menuStr.replace('#', '?v=' + new Date().getTime() + '#') + '&token=' + localStorage.getItem('token') + '&title=' + customsDic.title + '&close=true'
      }
    };
    if (this.deviceService.getDeviceInfo().deviceType === 'android') {
      this.navCtrl.push(ExamCustomFramePage, data);
    } else {
      const browser = this.iab.create(data.data.url, '_blank', { 'location': 'no', 'toolbar': 'no' });
      browser.on('loadstop').subscribe(event => {
        browser.executeScript({ code: 'localStorage.setItem("If_Can_Back", "" );' });
        let loop = setInterval(() => {
          browser.executeScript({
            code: 'localStorage.getItem("If_Can_Back");'
          }).then(values => {
            let If_Can_Back = values[0];
            if (If_Can_Back === 'back') {
              clearInterval(loop);
              browser.close();
              console.log(' 推送浏览器走back刷新');
              // 刷新首页角标
              this.events.publish('refresh');
            }
            if (If_Can_Back === 'close') {
              clearInterval(loop);
              browser.close();
              this.events.publish('refresh');
            }
          });
        }, 500);
      });
    }
  }

  // 自动登录
  autoLogin() {
    // 如果是从登录页进来，则直接获取会话列表未读数
    if (this.navParams.get('isAutoLogin') === false) {
      this.isFirst = false;
      if (this.deviceService.getDeviceInfo().deviceType) {
        // 获取未读消息数量
        this.getUnreadMessageNumber();
      }
    } else {
      // 调用 bind 接口更新 token
      let params: Object = {
        'username': this.userInfo.account,
        'pwd': this.userInfo.password
      };
      this.http.post('/auth/login', params).subscribe((data: Response) => {
        localStorage.token = data['_body'];
        this.events.publish('logined');
        this.isFirst = false;
        // 防止在 web 上报错
        if (this.deviceService.getDeviceInfo().deviceType) {
          if (localStorage.getItem('haveIM') === '1') {
            // im 自动登录
            this.imlogin();
          }
        }
      }, (res: Response) => {
        this.toastService.show(res.text());
      });
    }
  }

  // im 自动登录
  imlogin() {
    if (localStorage.getItem('haveIM') === '1') {
      // 获取未读消息前先登录并将 chatKey 传入
      let params = {
        username: this.userInfo.loginName,
        password: this.userInfo.password0,
        baseUrl: this.configsService.getBaseUrl(),
        pushUrl: this.configsService.getPushUrl(),
        chatKey: this.configsService.getChatKey(),
        token: 'Bearer ' + localStorage['token'],
        chatId: this.userInfo.userId,
        pushAppId: this.appConstant.properPushConstant.appId,
        ext: {
          from_user_id: this.userInfo.loginName,
          from_username: this.userInfo.userName,
          from_headportrait: this.userInfo.headImage
        }
      };
      (<any>window).huanxin.imlogin(params, (loginData) => {
        this.zone.run(() => {
          if (loginData === 'user_not_found' && this.userService.imIsOpen()) {
            this.logOut('0');
          } else if (loginData !== 'user_not_found' && !this.userService.imIsOpen()) {
            this.logOut('1');
          }
          this.getUnreadMessageNumber();
        });
      });
    }
  }

  // 获取未读消息数量
  getUnreadMessageNumber() {
    if (localStorage.getItem('haveIM') === '1') {
      (<any>window).huanxin.getChatList('', (retData: Array<Object>) => {
        (<any>window).huanxin.loginState('', () => {
          // 推送服务取消与当前用户的绑定关系
          // this.pushService.unBindUserid(this.userInfo.userId);
          // 取消自动登录
          this.userService.logout();
          // this.http.post(' /auth/logout', {}).subscribe(() => { }, () => { });
          // 退出
          this.navCtrl.push(LoginPage).then(() => {
            const startIndex = this.navCtrl.getActive().index - 1;
            this.navCtrl.remove(startIndex, 1);
          });
          // (<any>window).huanxin.imlogout();
        });
        this.zone.run(() => {
          if (retData.length === 0) {
            this.store.dispatch(new ImReplaceBadageAction(''));
          } else {
            let total: number = 0;
            let i: number = retData.length;
            while (i) {
              i--;
              total += Number(retData[i]['unreadMessagesCount']);
            }
            if (total === 0) {
              this.store.dispatch(new ImReplaceBadageAction(''));
            } else {
              this.store.dispatch(new ImReplaceBadageAction(total.toString()));
            }
          }
        });
      }, (retData) => { });
    }
  }
  // 获取首页tab总数
  getWaitToDoNumber() {
    this.http.get('/notices/mainPageCount').subscribe((res: any) => {
      if (res._body != null && res._body !== '') {
        let data = res.json(); // 待办个数
        // let data = 5;
        this.zone.run(() => {
          if (data === 0) {
            this.store.dispatch(new HomeReplaceBadageAction(''));
          } else {
            this.store.dispatch(new HomeReplaceBadageAction(data.toString()));
          }
        });
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }
  // 获取项目获取首页tab总数
  getTodoNumber() {
    let params: URLSearchParams = new URLSearchParams();
    params.append('pageNo', '1');
    params.append('pageSize', '0');
    params.append('processName', '');
    this.http.post('/webController/getPersonalAllTodoTask', params).subscribe((res: Response) => {
      let data = res.json();
      // redux传值
      if (data.total === 0) {
        this.store.dispatch(new HomeReplaceBadageAction(''));
      } else {
        this.store.dispatch(new HomeReplaceBadageAction(data.total));
      }
    });
  }
  /**
   * 退出登录
   */
  logOut(imIsOpen: string) {
    let params: Object = {};
    params['alertContent'] = imIsOpen === '0' ? this.transateContent['IM_CLOSE'] : this.transateContent['IM_OPEN'];
    (<any>window).huanxin.showNativeAlert(params, () => {
      this.zone.run(() => {
        localStorage.setItem('imIsOpen', imIsOpen);
        // 推送服务取消与当前用户的绑定关系
        this.pushService.unBindUserid(this.userInfo.userId);
        // 取消自动登录
        this.userService.logout();
        this.http.post(' /auth/logout', {}).subscribe(() => { }, () => { });
        // 退出
        const data = {
          loginStatus: 'logout'
        };
        this.navCtrl.push(LoginPage, data).then(() => {
          const startIndex = this.navCtrl.getActive().index - 1;
          this.navCtrl.remove(startIndex, 1);
        });
        (<any>window).huanxin.imlogout();
      });
    });
  }
  changeValue(tab: any) {
    if (localStorage.getItem('haveIM') !== '1' && localStorage.getItem('haveIM') !== '2') {
      if (tab.tabTitle === '待办') {
        this.tabRef.select(0);
        const dataALL = {
          name: '待办',
          isPush: false,
          data: {
            url: '/#/webapp/workflow/todo'
          },
          page: 'examList'
        };
        this.routersService.pageForward(this.navCtrl, dataALL);
      }
      console.log('选择:' + tab.tabTitle);
    }
  }
}
