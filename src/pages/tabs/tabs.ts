import { Component, ViewChild, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Platform, Tabs, AlertController, NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { SettingPage } from '../setting/setting';
import { BackButtonService } from '../../app/services/backButton.service';
import { AppVersionUpdateService } from '../../app/services/appVersionUpdate.service';
import { TodoDetailPage } from '../todo/todoDetail/todoDetail';
import { UserService, UserInfoState } from '../../app/services/user.service';
import { ToastService } from '../../app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { TodoListPage } from '../todo/todoList/todoList';
import { QueryDetailPage } from '../query/queryDetail/queryDetail';
import { QueryNoticeDetailPage } from '../query/queryNoticeDetail/queryNoticeDetail';
import { AddressPage } from '../address/address';
import { ChatListPage } from '../chatList/chatList';

import { Store } from '@ngrx/store';
import { TODO_BADGE_STATE, IM_BADGE_STATE } from '../../app/redux/app.reducer';
import { TodoReplaceBadageAction } from '../../app/redux/actions/todo.action';
import { ImReplaceBadageAction } from '../../app/redux/actions/im.action';

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

  /**
   * 构造函数
   */
  constructor(public navCtrl: NavController,
    public platform: Platform,
    private http: Http,
    private zone: NgZone,
    private toastService: ToastService,
    private userService: UserService,
    private backButtonService: BackButtonService,
    private appVersionUpdateService: AppVersionUpdateService,
    public alertCtrl: AlertController,
    private translate: TranslateService,
    private store: Store<string>) {
    let translateKeys: string[] = ['PROMPT_INFO', 'CANCEL', 'VIEW', 'PUSH_OPEN_PROMPT_ONE', 'PUSH_OPEN_PROMPT_TWO'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
    this.tabRoots = this.getTabInfo();
    platform.ready().then(() => {
      this.backButtonService.registerBackButtonAction(this.tabRef);
      // 通过推送通知打开应用事件
      document.addEventListener('Properpush.openNotification', this.doOpenNotification.bind(this), false);

      // 获取待办数量
      this.getTodoNumber();
      // 待办角标绑定
      this.store.select(TODO_BADGE_STATE).subscribe((data: string) => {
        this.tabRoots[1]['tabBadge'] = data;
      });

      // 获取未读消息数量
      this.getUnreadMessageNumber();
      // 消息角标绑定
      this.store.select(IM_BADGE_STATE).subscribe((data: string) => {
        this.tabRoots[2]['tabBadge'] = data;
      });
    });

  }

  /**
   * 取得Tab配置信息
   */
  getTabInfo(): Object[] {
    return [
      {
        root: HomePage,
        tabTitle: '首页',
        tabIcon: 'home'
      },
      {
        root: TodoListPage,
        tabTitle: '待办',
        tabIcon: 'list-box',
        tabBadge: '',
        params: {
          processName: '',
          title: '待办列表'
        }
      },
      {
        root: ChatListPage,
        tabTitle: '消息',
        tabIcon: 'chatboxes'
      },
      {
        root: AddressPage,
        tabTitle: '通讯录',
        tabIcon: 'contacts'
      },
      {
        root: SettingPage,
        tabTitle: '更多',
        tabIcon: 'person'
      }
    ];
  }

  /**
   * 推送打开事件处理
   */
  doOpenNotification(event: any): void {
    if ('updatesoftware' === event.properCustoms.gdpr_mpage) {
      this.appVersionUpdateService.checkAppVersion(true);
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
        }
      }
    }
  }

  /**
   * 推送通知打开待办
   */
  doOpenNotificationTodo(customsDic: any): void {
    let item: Object = {
      systemId: customsDic['systemId'],
      taskId: customsDic['taskId'],
      sign: customsDic['sign'],
      step: customsDic['step'],
      processName: customsDic['processName']
    };

    if (item['sign'] == null || item['sign'] === '') {
      this.http.get('/bpm/todos/' + item['id'] + 'claim').subscribe((res: Response) => {
        let userInfo: UserInfoState = this.userService.getUserInfo();
        item['assignee'] = userInfo.loginName;
        this.navCtrl.push(TodoDetailPage, item);
      }, (res: Response) => {
        this.toastService.show(res.text());
      });
    } else {
      this.navCtrl.push(TodoDetailPage, item);
    }
  }

  /** 
   * 推送通知打开查询 
   */
  doOpenNotificationQuery(customsDic: any): void {
    this.navCtrl.push(QueryDetailPage, customsDic);
  }

  /** 
   * 推送通知打开通知查询 
   */
  doOpenNotificationNoticeQuery(customsDic: any): void {
    this.navCtrl.push(QueryNoticeDetailPage, customsDic);
  }

  // 获取待办数量
  getTodoNumber() {
    let params: Object = {
      'pageNo': '1',
      'pageSize': '0'
    };
    this.http.get('/bpm/todos', { params: params }).subscribe((res: Response) => {
      let data = res.json();
      // redux传值
      if (data.total === 0) {
        this.store.dispatch(new TodoReplaceBadageAction(''));
      } else {
        this.store.dispatch(new TodoReplaceBadageAction(data.total));
      }
    });
  }

  // 获取未读消息数量
  getUnreadMessageNumber() {

    (<any>window).huanxin.getChatList('', (retData: Array<Object>) => {
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
          this.store.dispatch(new ImReplaceBadageAction(total.toString()));
        }
      });
    }, (retData) => { });

  }
}
