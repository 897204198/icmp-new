import { Component, ElementRef, ViewChild, NgZone, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController, ModalController, Slides, Events } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { AlertController } from 'ionic-angular';
import { ToastService } from '../../app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IcmpConstant, ICMP_CONSTANT } from '../../app/constants/icmp.constant';
import { RoutersService } from '../../app/services/routers.service';
import { SecureStorageService } from '../../app/services/secureStorage.service';
import { DeviceService } from '../../app/services/device.service';
import { Store } from '@ngrx/store';
import { HomeReplaceBadageAction } from '../../app/redux/actions/home.action';
import { HomeComponentPage } from './homeComponent/homeMenusManager';
import { MenuFolderComponent } from '../../app/component/menuFolder/menuFolder.component';
import timeago from 'timeago.js';
import { NoticePage } from '../notice/notice';
import { ConfigsService } from '../../app/services/configs.service';
import { LoginPage } from '../login/login';
import { TodoReplaceBadageAction } from '../../app/redux/actions/todo.action';

/**
 * 首页
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // 轮播图对象
  @ViewChild('ionCarouselSlides') slider: Slides;
  // 轮播图高度
  private bannerlHeight: string = '';
  // 是否显示页面头
  private shadowShow: boolean = false;
  // 我的应用列表
  private menus: Object[] = [];
  // 我的插件列表
  private plugins: Object[] = [];
  // 通知消息列表
  private notices: Object[] = [];
  noticeLists: Object[] = [];
  private componentList: Object[] = [];
  private workflow: Object[] = [];
  // 定时对象
  private intervalId: any = null;
  private intervalSlideId: any = null;
  // 通知消息滚动参数
  private noticeMarginIndex: number = 0;
  // 国际化文字
  private transateContent: Object;
  // 是否是首次加载
  private isFirst: boolean = true;
  // 全部图标的角标个数
  private allNum: number = 0;
  // 待办事件个数
  private waitNum: number = 0;
  // private hasInfo: boolean = false;
  private hasLoaded: boolean = false;
  private hasListLoaded: boolean = false;
  // 是否有IM功能
  haveIM: boolean = false;
  // 是否是普日项目判断首页插件组件
  properSoft: boolean = false;

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
    private configsService: ConfigsService,
    private modalCtrl: ModalController,
    private iab: InAppBrowser,
    private el: ElementRef,
    private deviceService: DeviceService,
    private zone: NgZone,
    private http: Http,
    public alertCtrl: AlertController,
    private toastService: ToastService,
    private translate: TranslateService,
    private routersService: RoutersService,
    private secureStorageService: SecureStorageService,
    private store: Store<string>,
    @Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
    public events: Events) {
    let translateKeys: string[] = ['NOTICE_DETAILED', 'PROCESS_SUCC'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
    // 轮播图高度
    let width = document.body.clientWidth;
    this.bannerlHeight = width * 572 / 1280 + 'px';
    this.getCache();
    // 保证登录成功后再请求接口
    let num = 0;
    events.subscribe('logined', () => {
      // 防止push一次logined方法执行多次
      num = num + 1;
      if (num === 1) {
        this.setPlugins();
        this.getComponentList();
        this.setAppList(); // 获取应用
        if (localStorage.getItem('todoState') !== '2') {
          // 新版项目获取首页角标总数
          this.getWaitNum();
          this.componentInit();
          this.getWaitToDoNum();
        } else {
          // oa项目获取待办数量
          this.getTodoNumber();
        }
      }
    });
    // 从网页回来刷新首页角标
    if (localStorage.getItem('haveIM') === '1') {
      events.subscribe('refresh', () => {
        this.getComponentList();
        this.setAppList(); // 获取应用
        if (localStorage.getItem('todoState') !== '2') {
          // 新版项目获取首页角标总数
          this.getWaitNum();
          this.componentInit();
          this.getWaitToDoNum();
        } else {
          // oa项目获取待办数量
          this.getTodoNumber();
        }
      });
    }
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    this.scrollHeader();
  }

  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    // 首次不加载
    if (!this.isFirst) {
      this.getCache();
      this.setNotice();
      this.setPlugins();
      this.getComponentList();
      this.setAppList(); // 获取应用
      if (localStorage.getItem('todoState') !== '2') {
        // 新版项目获取首页角标总数
        this.getWaitNum();
        this.componentInit();
        this.getWaitToDoNum();
      } else {
        // oa项目获取待办数量
        this.getTodoNumber();
      }
    }
    this.isFirst = false;
    // 轮播图处理
    this.zone.runOutsideAngular(() => {
      this.intervalSlideId = setInterval(() => {
        this.zone.run(() => {
          if (this.slider) {
            this.slider.slideNext();
          }
        });
      }, 3000);
    });

    if (localStorage.getItem('haveIM') === '1') {
      this.haveIM = true;
    } else {
      this.haveIM = false;
    }
    if (localStorage.getItem('properSoft') === '1') {
      this.properSoft = true;
    } else {
      this.properSoft = false;
    }
  }
  test_local_dict(number, index, total_sec): any {
    // number：xxx 时间前 / 后的数字；
    // index：下面数组的索引号；
    // total_sec：时间间隔的总秒数；
    return [
      ['刚刚', 'a while'],
      ['%s 秒前', 'in %s seconds'],
      ['1分钟前', 'in 1 minute'],
      ['%s分钟前', 'in %s minutes'],
      ['1小时前', 'in 1 hour'],
      ['%s小时前', 'in %s hours'],
      ['1天前', 'in 1 day'],
      ['%s天前', 'in %s days'],
      ['1星期前', 'in 1 week'],
      ['%s星期前', 'in %s weeks'],
      ['1月前', 'in 1 month'],
      ['%s月前', 'in %s months'],
      ['1年前', 'in 1 year'],
      ['%s年前', 'in %s years']
    ][index];
  };
  /**
   * 获取插件列表
   */
  getComponentList(): void {
    if (localStorage.getItem('properSoft') == '1') {
      this.http.get('/plugin/custom').subscribe((res: any) => {
        if (res._body != null && res._body !== '') {
          this.componentList = res.json();
          this.zone.run(() => {
            this.hasLoaded = true;
          });
        };
      }, (res: Response) => {
        if (res.status === 404) {
          const confirm = this.alertCtrl.create({
            title: '提示',
            message: '您的App版本太低，请下载最新版本',
            buttons: [
              {
                text: '确认',
                handler: () => {
                }
              }
            ]
          });
          confirm.present();
          // alert('您的账号已在其他手机登录，如非本人操作请尽快重新登录后修改密码');
          this.navCtrl.push(LoginPage).then(() => {
            const startIndex = this.navCtrl.getActive().index - 1;
            this.navCtrl.remove(startIndex, 1);
          });
        }
        this.toastService.show(res.text());
      });
    }
  }
  componentInit(): void {
    Date.prototype.toLocaleString = function () {
      return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate() + ' ' + this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds();
    };
    this.http.get('/search/query?moduleName=workflow_task&pageNo=1&pageSize=5').subscribe((res: any) => {
      if (res._body != null && res._body !== '') {
        this.workflow = res.json().data;
        this.workflow.forEach(element => {
          if (element['globalData']['workflow_icon']) {
            element['globalData']['workflow_icon'] = `./assets/images/db/${element['globalData']['workflow_icon']}`;
          } else {
            element['globalData']['workflow_icon'] = './assets/images/db/default.png';
          }
          timeago.register('test_local', this.test_local_dict);
          const timeagoa = timeago();
          element['createTime'] = timeagoa.format(element['createTime'], 'test_local');
          if (element['globalData']['formTodoDisplayFields'] && element['globalData']['formTodoDisplayFields'].length > 0) {
            element['hasFields'] = true;
            element['globalData']['formTodoDisplayFields'].forEach(item => {
              if (element['form']['formData'][`${item['name']}_text`]) {
                item['value'] = element['form']['formData'][`${item['name']}_text`];
              } else {
                item['value'] = element['form']['formData'][item['name']];
              }
              if (typeof (item['value']) === 'number' && item['value'].toString().length === 13) {
                item['value'] = new Date(item['value']).toLocaleString();
              }
            });
          } else {
            element['hasFields'] = false;
          };
        });
        this.zone.run(() => {
          this.hasListLoaded = true;
        });
      };
    }, (res: Response) => {
      if (localStorage.getItem('haveIM') !== '1') {
        if (res.status === 401) {
          const confirm = this.alertCtrl.create({
            title: '提示',
            message: '您的账号已在其他手机登录，如非本人操作请尽快重新登录后修改密码',
            buttons: [
              {
                text: '确认',
                handler: () => {
                }
              }
            ]
          });
          confirm.present();
          // alert('您的账号已在其他手机登录，如非本人操作请尽快重新登录后修改密码');
          this.navCtrl.push(LoginPage).then(() => {
            const startIndex = this.navCtrl.getActive().index - 1;
            this.navCtrl.remove(startIndex, 1);
          });
        } else {
          this.toastService.show(res.text());
        }
      } else {
        this.toastService.show(res.text());
      }
    });
  }
  /**
   * 获取缓存
   */
  getCache() {
    this.menus = this.secureStorageService.getObject('home_applist');
    this.plugins = this.secureStorageService.getObject('home_plugins');
  }

  /**
   * 页面离开
   */
  ionViewWillLeave(): void {
    clearInterval(this.intervalSlideId);
    clearInterval(this.intervalId);
  }

  /**
   * 窗口大小改变事件
   */
  onResize(): void {
    let width = document.body.clientWidth;
    this.bannerlHeight = width * 572 / 1280 + 'px';
    this.slider.resize();
  }

  /**
   * 导航栏透明，向下拖动显示
   */
  scrollHeader(): void {
    let scroll = this.el.nativeElement.querySelector('.scroll-content');
    let head = this.el.nativeElement.querySelector('.header');
    let header = this.el.nativeElement.querySelector('.toolbar-background');
    let iosHeader = this.el.nativeElement.querySelector('.toolbar-background-ios');
    this.shadowShow = false;
    if (iosHeader !== null) {
      iosHeader['style'].borderStyle = 'none';
    }
    head['style'].opacity = 0;
    Observable.fromEvent(scroll, 'scroll').subscribe(() => {
      let top = scroll.scrollTop;
      if (top > 140) {
        head['style'].opacity = 1;
        header['style'].background = 'rgba(255,255,255,1)';
        if (iosHeader !== null) {
          iosHeader['style'].borderStyle = 'solid';
        }
        this.shadowShow = true;
      } else {
        let op = top / 140;
        head['style'].opacity = op;
        header['style'].background = 'rgba(255,255,255,' + op + ')';
        if (op > 0.5) {
          this.shadowShow = true;
          if (iosHeader !== null) {
            iosHeader['style'].borderStyle = 'solid';
          }
        } else {
          this.shadowShow = false;
          if (iosHeader !== null) {
            iosHeader['style'].borderStyle = 'none';
          }
        }
      }
    });
  }

  /**
   * 设置首页应用列表
   */
  setAppList(): void {
    this.http.get('/sys/applications').subscribe((res: any) => {
      if (res._body != null && res._body !== '') {
        this.menus = [];
        let data = res.json();
        // let haveWait = 0;
        for (let i = 0; i < data.length; i++) {
          if (localStorage.getItem('todoState') === '2') {
            data[i]['serviceName'] = data[i]['data']['serviceName'];
            data[i]['processName'] = data[i]['data']['processName'];
            data[i]['total'] = data[i]['data']['total'];
          }
          // if (data[i].name === '待办') {
          //   data[i].total = this.waitNum;
          //   haveWait++;
          //   if (localStorage.getItem('haveIM') === '0') {
          //     // 存储待办模块
          //     localStorage.setItem('waitData', data[i].data.url);
          //   }
          // }
          this.menus.push(data[i]);
        }
        // 首页没有待办数量加在全部图标上
        // if (localStorage.getItem('haveIM') === '1') {
        //   if (haveWait === 0) {
        //     this.allNum = this.waitNum;
        //   } else {
        //     this.allNum = 0;
        //   }
        // }
        this.secureStorageService.putObject('home_applist', this.menus);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
    // TODO 模拟菜单接口
    // this.menus = [{
    //   "code": null,
    //   "createTime": "2017-02-20 00:00:00",
    //   "createUserId": "oa",
    //   "data": {},
    //   "defaultValue": true,
    //   "enable": true,
    //   "icon": "http://123.150.83.199:9999/img/邮件查询.png\n",
    //   "id": 55,
    //   "lastModifyTime": "2017-02-20 00:00:00",
    //   "lastModifyUserId": "oa",
    //   "name": "申请",
    //   "page": "application",
    //   "style": null,
    //   "serviceName": "EmployeesLeaveApplyService",
    //   "total": 0
    // }];
    this.allNum = 0;
    this.secureStorageService.putObject('home_applist', this.menus);
  }
  /**
  * 获取首页tab总数数量
  */
  getWaitNum(): void {
    this.http.get('/notices/mainPageCount').subscribe((res: any) => {
      if (res._body != null && res._body !== '') {
        let data = res.json();
        this.waitNum = data;
        if (data === 0) {
          this.store.dispatch(new HomeReplaceBadageAction(''));
        } else {
          this.store.dispatch(new HomeReplaceBadageAction(data.toString())); // 更新首页tab角标
        }
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }
  // 获取项目首页tab总数数量
  getTodoNumber() {
    let params: URLSearchParams = new URLSearchParams();
    params.append('pageNo', '1');
    params.append('pageSize', '0');
    params.append('processName', '');
    this.http.post('/webController/getPersonalAllTodoTask', params).subscribe((res: Response) => {
      let data = res.json();
      // redux传值
      if (data.total === 0) {
        this.store.dispatch(new TodoReplaceBadageAction(''));
      } else {
        this.store.dispatch(new TodoReplaceBadageAction(data.total));
      }
    });
  }
  /**
  * 获取待办数量
  */
  getWaitToDoNum(): void {
    this.http.get('/workflow/task/todo/count').subscribe((res: any) => {
      if (res._body != null && res._body !== '') {
        let data = res.json(); // 待办个数
        if (data.total === 0) {
          this.store.dispatch(new TodoReplaceBadageAction(''));
        } else {
          this.store.dispatch(new TodoReplaceBadageAction(data.toString()));
        }
      }
    }, (res: Response) => {
      if (localStorage.getItem('todoState') !== '2') {
        this.toastService.show(res.text());
      }
    });
  }

  /**
   * 设置首页插件列表
   */
  setPlugins(): void {
    this.http.get('/sys/plugins/user').subscribe((res: any) => {
      if (res._body != null && res._body !== '') {
        this.plugins = [];
        this.plugins = res.json();
        this.secureStorageService.putObject('home_plugins', this.plugins);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 获取通知消息列表
   */
  setNotice(): void {
    let params: Object = { infoType: 'NOTICE_INFORMATION' };
    this.http.get('/sys/announcement', { params: params }).subscribe((res: any) => {
      if (res._body != null && res._body !== '') {
        let data = res.json();
        this.notices = data;
        this.noticeLists = [...data];
        if (this.notices.length > 0) {
          this.notices.push({ title: this.notices[0]['title'], info: this.notices[0]['info'], beginTime: this.notices[0]['beginTime'] });
          this.noticeMarginIndex = 0;
          this.noticeScroll();
        }
      } else {
        this.notices = [];
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 通知消息滚动
   */
  noticeScroll(): void {
    this.zone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        let noticeFirst = this.el.nativeElement.querySelector('.notice-first');
        if (noticeFirst != null) {
          this.noticeMarginIndex++;
          if (this.noticeMarginIndex === this.notices.length - 1) {
            setTimeout(() => {
              noticeFirst.style.transition = 'margin 0s ease-in-out';
              noticeFirst.style.marginTop = '0px';
            }, 1000);
          } else if (this.noticeMarginIndex === this.notices.length) {
            this.noticeMarginIndex = 1;
          }
          noticeFirst.style.transition = 'margin 0.6s ease-in-out';
          noticeFirst.style.marginTop = '-' + 30 * this.noticeMarginIndex + 'px';
        }
      }, 3500);
    });
  }

  /**
   * 打开通知消息
   */
  // 点击通知跳转
  noticeClk(index: number): void {
    let noticeInfo = this.notices[index];
    this.navCtrl.push(NoticePage, { notices: this.noticeLists, index: index, title: noticeInfo['title'], info: noticeInfo['info'], beginTime: noticeInfo['beginTime'].substring(0, 10) });
  }
  openNotice(item: any): void {
    let title = item.detailTitleBarText ? item.detailTitleBarText : this.transateContent['NOTICE_DETAILED'];
    let menuItem: any = {
      'style': item.style,
      'id': item.id,
      'page': this.icmpConstant.page.queryDetail,
      'title': title,
      'serviceName': 'notifyPublishQueryService'
    };
    this.routersService.pageForward(this.navCtrl, menuItem);
  }

  openAllNotice(): void {
    let menuItem: any = {
      'style': 'notice_style',
      'page': 'query',
      'name': '公告通知',
      'serviceName': 'notifyPublishQueryService'
    };
    this.routersService.pageForward(this.navCtrl, menuItem);
  }

  handleAdd(): void {
    this.navCtrl.push(HomeComponentPage);
  }
  getMoreInfo(menu): void {
    if (menu['appType'] === 'folder') {
      let modal = this.modalCtrl.create(MenuFolderComponent, { name: menu });
      modal.onDidDismiss(data => {
        if (data) {
          this.routersService.pageForward(this.navCtrl, data);
        }
      });
      modal.present();
    } else {
      this.routersService.pageForward(this.navCtrl, menu);
    };
  }
  agreeDeal(record): void {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '确认同意审批此流程吗',
      buttons: [
        {
          text: '取消',
          handler: () => {
          }
        },
        {
          text: '确认',
          handler: () => {
            const { taskId, form } = record;
            if (record.form.formData) {
              const data = {
                ...form.formData,
                passOrNot: 1,
                approvalRemarks: ''
              };
              // const params = {
              //   formData: data
              // };
              this.http.post(`/workflow/task/${taskId}`, data).subscribe((res: any) => {
                this.toastService.show(this.transateContent['PROCESS_SUCC']);
                this.componentInit();
                // 刷新首页角标总数
                this.getWaitNum();
              }, (res: Response) => {
                this.toastService.show(res.text());
              });
            };
          }
        }
      ]
    });
    confirm.present();
  }
  getDetail(record, title, targetUrl): void {
    const { pepProcInst: { procInstId, processTitle }, taskId, name } = record;
    const param = btoa(encodeURIComponent(JSON.stringify({
      isLaunch: false,
      taskOrProcDefKey: taskId,
      procInstId,
      name,
      businessObj: { formTitle: processTitle },
      stateCode: undefined
    })));
    const dataALL = {
      name: title,
      isPush: false,
      data: {
        url: `#/webapp/workflow/workflowMainPop?param=${param}&title=${title}&close=true`
      },
      page: 'examList'
    };
    this.routersService.pageForward(this.navCtrl, dataALL);
  }
}
