import { Component, Inject, ElementRef, ViewChild } from '@angular/core';
import { NavParams, Refresher, InfiniteScroll, ViewController } from 'ionic-angular';
import { ICMP_CONSTANT, IcmpConstant } from '../../constants/icmp.constant';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { ToastService } from '../../services/toast.service';

/**
 * 查询选择器
 */
@Component({
  selector: 'icmp-searchbox',
  templateUrl: 'searchbox.component.html',
})
export class SearchboxComponent {

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  // 页面标题
  title: string = '';
  // 是否多选
  multiple: boolean = false;
  // 查询条件
  searchName: string = '';
  // 查询结果列表
  searchResults: Object[] = [];
  // 多选结果
  searchSelect: {} = {};
  // 页面默认选中id
  defaultId: string[] = [];
  // 页面默认选中name
  defaultName: string[] = [];
  // 页码
  pageNo: number = 0;
  // 下拉刷新事件
  private refresher: Refresher;

  /**
   * 构造函数
   */
  constructor(
    public navParams: NavParams,
    @Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
    private http: Http, private el: ElementRef,
    private toastService: ToastService,
    public viewCtrl: ViewController) {
    this.title = navParams.get('title');
    this.multiple = navParams.get('multiple');
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    let searchInput = this.el.nativeElement.querySelector('#search_input');
    Observable.fromEvent(searchInput, 'keyup').subscribe((event) => { this.doSearch(event); });
  }

  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    this.initSearchResults();
  }

  /**
   * 初始化查询结果
   */
  initSearchResults(): void {
    this.searchResults = null;
    this.pageNo = 1;
    this.infiniteScroll.enable(true);
    this.getSearchResults(true);
  }

  /**
   * 初始化查询结果
   */
  getSearchResults(isInit: boolean): void {
    let params: URLSearchParams = new URLSearchParams();
    params.append('pageNo', this.pageNo.toString());
    params.append('pageSize', this.icmpConstant.pageSize);
    params.append('searchName', this.searchName);
    this.http.post(this.navParams.get('searchUrl'), params).subscribe((res: Response) => {
      let data = res.json().result_list;
      if (isInit) {
        this.searchResults = data;
      } else {
        for (let i = 0; i < data.length; i++) {
          this.searchResults.push(data[i]);
        }
      }
      this.infiniteScrollComplete();
      if ((data == null || data.length < Number(this.icmpConstant.pageSize)) && this.infiniteScroll != null) {
        this.infiniteScroll.enable(false);
      }
      if (this.navParams.get('id')) {
        this.defaultId = this.navParams.get('id').split(',');
        for (const item of this.searchResults) {
          for (const id of this.defaultId) {
            if (item['id'] === id) {
              this.searchSelect[id] = true;
            }
          }
        }
      }
      if (this.navParams.get('name')) {
        this.defaultName = this.navParams.get('name').split(',');
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    }, () => {
      this.refresherComplete();
    });
  }

  /**
   * 下拉刷新
   */
  doRefresh(refresher: Refresher): void {
    this.refresher = refresher;
    this.initSearchResults();
  }

  /**
   * 瀑布流加载
   */
  doInfinite(): void {
    this.pageNo++;
    this.getSearchResults(false);
  }

  /**
   * 查询事件
   */
  doSearch(event): void {
    if (event.keyCode === 13) {
      this.initSearchResults();
    }
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
   * 关闭页面
   */
  dismiss(): void {
    this.viewCtrl.dismiss();
  }

  /**
   * 选择事件
   */
  searchboxSelect(result?: Object): void {
    let params: Object = new Object();
    if (result == null) {
      for (const key in this.searchSelect) {
        if (key) {
          for (let i = 0; i < this.defaultId.length; i++) {
            if (!this.searchSelect[key] && key === this.defaultId[i]) {
              this.defaultId.splice(i, 1);
              this.defaultName.splice(i, 1);
            }
          }
        }
      }
      let ids: string[] = [...this.defaultId];
      let names: string[] = [...this.defaultName];
      for (const keys in this.searchSelect) {
        if (keys) {
          for (const item of this.defaultId) {
            if (keys === item) {
              delete this.searchSelect[keys];
            }
          }
        }
      }
      for (const keys in this.searchSelect) {
        if (this.searchSelect[keys]) {
          ids.push(keys);
          for (const item of this.searchResults) {
            if (item['id'] === keys) {
              names.push(item['name']);
            }
          }
        }
      }
      this.viewCtrl.dismiss({ id: ids.join(','), name: names.join(',') });
    } else {
      params = {
        id: result['id'],
        name: result['name'],
        controls: result['controls']
      };
      this.viewCtrl.dismiss(params);
    }
  }
}
