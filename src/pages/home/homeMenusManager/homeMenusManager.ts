import { Component, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { FormControl } from '@angular/forms';
import 'rxjs/Rx';
import { DragulaService } from 'ng2-dragula';
import { ModalController, NavController, Events } from 'ionic-angular';
import { MenuFolderComponent } from '../../../app/component/menuFolder/menuFolder.component';
import { RoutersService } from '../../../app/services/routers.service';
import { TranslateService } from '@ngx-translate/core';
import { SearchFilterPipe } from '../../../app/pipes/searchFilter/searchFilter';
import { AlertController } from 'ionic-angular';
import { ToastService } from '../../../app/services/toast.service';
import { LoginPage } from '../../login/login';
/**
 * 首页应用组件
 */
@Component({
  selector: 'page-home-menus-manager',
  templateUrl: 'homeMenusManager.html'
})
export class HomeMenusManagerPage {

  // 我的应用
  private myMenus: Object[] = [];
  // 各种类型的应用
  private categoryMenus: Object[] = [];
  // 是否进入管理模式
  private isManage: boolean = false;
  // 查询拦截器
  private titleFilter: FormControl = new FormControl();
  // 查询keyword
  private keyword: string;
  // 应用所占的宽度
  private menuWidth: string;
  // 国际化文字
  private transateContent: Object;
  // 搜索匹配的条数
  private count: number = 0;
  // 是否显示placeholder
  private isShow: boolean = false;
  // 待办个数
  public waitNum: number = 0;

  /**
   * 构造函数
   */
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private toastService: ToastService,
    private dragulaService: DragulaService,
    public http: Http,
    private modalCtrl: ModalController,
    private SearchFilter: SearchFilterPipe,
    private translate: TranslateService,
    private routersService: RoutersService,
    private zone: NgZone,
    public events: Events) {

    // 设置功能区列数
    if (screen.width <= 375) {
      this.menuWidth = 25 + '%';
    } else if (screen.width > 375 && screen.width <= 590) {
      this.menuWidth = 20 + '%';
    } else {
      this.menuWidth = 16.6 + '%';
    }

    let translateKeys: string[] = ['NO_GROUP'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });

    this.titleFilter.valueChanges.debounceTime(500).subscribe(
      value => {
        this.isShow = true;
        this.count = 0;
        this.keyword = value;
        if (this.titleFilter.value) {
          for (let option of this.categoryMenus) {
            let len = this.SearchFilter.transform(option['menus'], 'name', value).length;
            this.count += len;
          }
        } else {
          this.isShow = false;
        }
      }
    );
    // 从网页回来刷新首页角标
    if (localStorage.getItem('haveIM') === '1') {
      events.subscribe('refresh', () => {
        this.getWaitNum();
      });
    }
  }
  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    this.getWaitNum();
  }
  /**
   * 进入页面
   */
  ionViewDidLoad() {
    // this.getMyMenus();
    // this.getAllMenus();
    // this.getWaitNum();
    this.dragulaService.drop.subscribe((value) => {
      this.saveMenus();
    });
  }
  /**
   * 获取待办数量
   */
  getWaitNum(): void {
    this.http.get('/workflow/task/todo/count').subscribe((res: any) => {
      this.waitNum = 0;
      if (res._body != null && res._body !== '') {
        let data = res.json(); // 待办个数
        this.waitNum = data;
      }
      this.getMyMenus();
      this.getAllMenus();
    }, (res: Response) => {
      this.toastService.show(res.text());
      this.getMyMenus();
      this.getAllMenus();
    });
  }
  /**
   * 取得全部应用
   */
  getAllMenus(): void {
    this.categoryMenus = [];
    this.http.get('/app/applications/all').subscribe((res: Response) => {
      let allMenus = res.json();
      let noGroupMenus = {};
      noGroupMenus['typeName'] = this.transateContent['NO_GROUP'];
      noGroupMenus['menus'] = [];
      console.log('获取全部应用');
      this.zone.run(() => {
        for (let i = 0; i < allMenus.length; i++) {
          let menu = allMenus[i];
          menu.menus = [];
          for (let apps of menu['apps']) {
            if (apps['name'] === '待办') {
              apps['total'] = this.waitNum;
              console.log('待办全部角标数' + apps['total']);
            }
            menu.menus.push(apps);
          }
          console.log('待办个数' + this.waitNum);
          this.categoryMenus.push(menu);
        }
      });
    }, (res: Response) => {
      if (localStorage.getItem('haveIM') !== '1') {
        if (res.status === 401) {
          console.log('抢登弹窗3');
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
          // this.toastService.show(res.text());
        }
      }else {
        // this.toastService.show(res.text());
      }
    });
  }

  /**
   * 取得自己的应用
   */
  getMyMenus(): void {
    this.myMenus = [];
    const arr = [];
    this.http.get('/app/applications').subscribe((res: any) => {
      if (res._body != null && res._body !== '') {
        let data = res.json();
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === '待办') {
            data[i].total = this.waitNum;
          }
          arr.push(data[i]);
          console.log('新待办我的应用角标数' + data[i].total);
        }
        this.zone.run(() => {
          this.myMenus = arr;
        });
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }
  // 取得发送长按事件的图标
  getPressIcon(target: any): any {
    if (target.className.indexOf('setting-menu') >= 0) {
      return target;
    } else {
      return target.offsetParent;
    }
  }

  // 应用长按事件
  pressEvent(event: any): void {
    if (!this.isManage) {
      this.isManage = true;
    }

    let target = this.getPressIcon(event.target);
    if (target != null) {
      target.className = target.className + ' pressActive';
    }
  }

  // 结束长按事件取消样式
  touchendEvent(event: any, menu: Object): void {
    let target = this.getPressIcon(event.target);
    if (target != null) {
      target.className = 'setting-menu';
    }
  }

  /**
   * 点击管理按钮
   */
  manageMenus(): void {
    this.isManage = !this.isManage;
  }

  /**
   * 判断全部中是否选中
   */
  isMenuSelected(menu: Object): boolean {
    let isSelected = false;
    for (let i = 0; i < this.myMenus.length; i++) {
      if (this.myMenus[i]['id'] === menu['id']) {
        isSelected = true;
        break;
      }
    }
    return isSelected;
  }

  /**
   * 编辑时在我的应用中点击删除
   */
  currentMenuRemove(menu: Object): void {
    for (let i = 0; i < this.myMenus.length; i++) {
      if (this.myMenus[i]['id'] === menu['id']) {
        this.myMenus.splice(i, 1);
        this.saveMenus();
        break;
      }
    }
  }

  /**
   * 编辑时在全部应用中点击删除
   */
  listMenuRemove(menu: Object): void {
    for (let i = 0; i < this.myMenus.length; i++) {
      if (this.myMenus[i]['id'] === menu['id']) {
        this.myMenus.splice(i, 1);
        this.saveMenus();
        break;
      }
    }
  }

  /**
   * 编辑时在全部应用中点击添加
   */
  menuAdd(menu: Object): void {
    this.myMenus.push(menu);
    this.saveMenus();
  }

  /**
   * 保存应用
   */
  saveMenus(): void {
    let ids = [];
    for (let i = 0; i < this.myMenus.length; i++) {
      ids.push(this.myMenus[i]['id']);
    }
    localStorage.mainMenus = ids.join(',');

    let params: Object = {
      'ids': ids.join(',')
    };
    this.http.put('/app/applications', params).subscribe(() => {
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 打开应用
   */
  openApp(menu: any): void {
    if (!this.isManage) {
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
      }
    }
  }

  // 非管理模式阻止拖拽
  dragulaMove(event: any): void {
    if (!this.isManage) {
      event.stopPropagation();
    }
  }

  // 禁止长按出现菜单事件
  contextmenuEvent(event: any): void {
    event.preventDefault();
  }

  // 管理模式禁止touchstart
  touchstartEvent(event: any): void {
    event.preventDefault();
  }
}
