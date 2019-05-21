import { Component, Inject, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController, NavParams, Refresher, InfiniteScroll } from 'ionic-angular';
import { IcmpConstant, ICMP_CONSTANT } from '../../../app/constants/icmp.constant';
import { ToastService } from '../../../app/services/toast.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { TodoDetailPage2 } from '../todoDetail/todoDetail';
import { UserInfoState, UserService } from '../../../app/services/user.service';
import { TodoReplaceBadageAction } from '../../../app/redux/actions/todo.action';
import { Store } from '@ngrx/store';

/**
 * 待办列表页面
 */
@Component({
  selector: 'page-todo-list',
  templateUrl: 'todoList.html',
})
export class TodoListPage2 {
  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  // 页面标题
  private title: string = '';
  // 页码
  private pageNo: number = 0;
  // 待办列表
  private todoList: Object[] = [];
  // 待办总数
  private todoTotal: number = 0;
  // 下拉刷新事件
  private refresher: Refresher;
  // 国际化文字
  private transateContent: Object;

  /**
   * 构造函数
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              @Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
              private http: Http,
              private toastService: ToastService,
              private userService: UserService,
              private translate: TranslateService,
              private sanitizer: DomSanitizer,
              private store: Store<string>) {
    this.title = navParams.get('name');

    let translateKeys: string[] = ['CLAIM_SUCCESS', 'GOBACK_SUCCESS'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    this.todoTotal = 0;
    this.initTodoList();
  }

  /**
   * 初始化待办列表
   */
  initTodoList(): void {
    this.pageNo = 1;
    this.infiniteScroll.enable(true);
    this.getTodoList(true);
  }

  /**
   * 取得待办列表
   */
  getTodoList(isInit: boolean): void {
    let params: URLSearchParams = new URLSearchParams();
    params.append('pageNo', this.pageNo.toString());
    params.append('pageSize', this.icmpConstant.pageSize);
    params.append('processName', this.navParams.get('processName'));
    this.http.post('/webController/getPersonalAllTodoTask', params).subscribe((res: Response) => {
      this.todoList = [];
      let data = res.json();
      this.todoTotal = data.total;
      // 修复其他待办页会影响 tabs 上待办的角标
      if (!this.navCtrl.canGoBack()) {
        // redux传值
        if (data.total === 0) {
          this.store.dispatch(new TodoReplaceBadageAction(''));
        } else {
          this.store.dispatch(new TodoReplaceBadageAction(data.total));
        }
      }

      if (isInit) {
        this.todoList = data.rows;
      } else {
        for (let i = 0 ; i < data.rows.length ; i++) {
          this.todoList.push(data.rows[i]);
        }
      }
      this.infiniteScrollComplete();
      if ((data.rows == null || data.rows.length < Number(this.icmpConstant.pageSize)) && this.infiniteScroll != null) {
        this.infiniteScroll.enable(false);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    }, () => {
      this.refresherComplete();
    });
  }

  /**
   * 完成下拉刷新
   */
  refresherComplete(): void {
    if (this.refresher != null) {
      this.refresher.complete();
    }
  }

  /**
   * 完成瀑布流加载
   */
  infiniteScrollComplete(): void {
    if (this.infiniteScroll != null) {
      this.infiniteScroll.complete();
    }
  }

  /**
   * 下拉刷新
   */
  doRefresh(refresher: Refresher): void {
    this.refresher = refresher;
    this.initTodoList();
  }

  // 瀑布流加载
  doInfinite(): void {
    this.pageNo++;
    this.getTodoList(false);
  }

  /**
   * 签收
   */
  doClaim(item: Object): void {
    let params: URLSearchParams = new URLSearchParams();
    params.append('taskId', item['id']);
    this.http.post('/webController/claim', params).subscribe((res: Response) => {
      let data = res.json();
      if (data.result === '0') {
        this.toastService.show(this.transateContent['CLAIM_SUCCESS']);
        let userInfo: UserInfoState = this.userService.getUserInfo();
        item['assignee'] = userInfo.loginName;
      } else {
        this.toastService.show(data.errMsg);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 退回
   */
  doGoback(item: Object): void {
    let params: URLSearchParams = new URLSearchParams();
    params.append('taskId', item['id']);
    this.http.post('/webController/goback', params).subscribe((res: Response) => {
      let data = res.json();
      if (data.result === '0') {
        this.toastService.show(this.transateContent['GOBACK_SUCCESS']);
        item['assignee'] = '';
      } else {
        this.toastService.show(data.errMsg);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 办理
   */
  doHandle(item: Object): void {
    if (item['assignee'] === '') {
      let params: URLSearchParams = new URLSearchParams();
      params.append('taskId', item['id']);
      this.http.post('/webController/claim', params).subscribe((res: Response) => {
        let data = res.json();
        if (data.result === '0') {
          let userInfo: UserInfoState = this.userService.getUserInfo();
          item['assignee'] = userInfo.loginName;
          this.goTodoDetailPage(item);
        } else {
          this.toastService.show(data.errMsg);
        }
      }, (res: Response) => {
        this.toastService.show(res.text());
      });
    } else {
      this.goTodoDetailPage(item);
    }
  }

  /**
   * 办理
   */
  private goTodoDetailPage(item: Object): void {
    let params: Object = {
      systemId: 'bpm',
      taskId: item['id'],
      assignee: item['assignee'],
      step: item['variables']['step'],
      processName: item['variables']['processName']
    };
    this.navCtrl.push(TodoDetailPage2, params);
  }

  /**
   * 转换Html格式
   */
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
