import { Component, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController, NavParams, Refresher, InfiniteScroll, ModalController } from 'ionic-angular';
import { ICMP_CONSTANT, IcmpConstant } from '../../../app/constants/icmp.constant';
import { ToastService } from '../../../app/services/toast.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QueryListConditionPage } from '../queryListCondition/queryListCondition';
import { QueryDetailPage } from '../queryDetail/queryDetail';
import { QueryNoticeDetailPage } from '../queryNoticeDetail/queryNoticeDetail';

/**
 * 查询列表页面
 */
@Component({
  selector: 'page-query-list',
  templateUrl: 'queryList.html',
})
export class QueryListPage {

  // 页面标题
  title: string = '';
  // 页码
  pageNo: number = 0;
  // 是否为一级查询列表
  isTabQuery: boolean = true;
  // 是否有查询条件
  hasCondition: boolean = false;
  // 查询结果列表
  queryList: Object[];
  // 查询条件列表
  conditionList: Object[];
  // 查询条件
  queryInput: Object;
  // 下拉刷新事件
  private refresher: Refresher;
  // 上拉分页加载事件
  private infiniteScroll: InfiniteScroll;

  /**
   * 构造函数
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              @Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
              private http: Http,
              private toastService: ToastService,
              private sanitizer: DomSanitizer,
              private modalCtrl: ModalController) {}

  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    this.hasCondition = false;
    this.conditionList = [];
    this.title = this.navParams.get('title');
    this.initQueryList();
  }

  // 初始化查询结果列表
  initQueryList(): void {
    this.queryList = null;
    this.pageNo = 1;
    this.getQueryList(true);
  }

  /**
   * 取得查询结果列表
   */
  getQueryList(isInit: boolean): void {
    let params: URLSearchParams = new URLSearchParams();
    params.append('pageNo', this.pageNo.toString());
    params.append('pageSize', this.icmpConstant.pageSize);
    params.append('serviceName', this.navParams.get('serviceName'));
    params.append('defaultTab', this.navParams.get('defaultTab'));
    if (this.queryInput != null) {
      for (let key in this.queryInput) {
        if (this.queryInput.hasOwnProperty(key)) {
          params.append(key, this.queryInput[key]);
        }
      }
    }
    this.http.post('/webController/getSystemMsgList', params).subscribe((res: any) => {
      let data = res.json();
      let defaultTab = this.navParams.get('defaultTab');
      if (data.tab_list == null || data.tab_list.length <= 1 || (defaultTab != null && defaultTab !== '' && defaultTab !== 'default')) {
        this.isTabQuery = false;
      } else {
        this.isTabQuery = true;
      }
      if (!this.isTabQuery) {
        if (isInit) {
          this.queryList = data.result_list;
          if (data.query_conditon != null && data.query_conditon.length > 0) {
            this.hasCondition = true;
            this.conditionList = data.query_conditon;
          }
        } else {
          for (let i = 0 ; i < data.result_list.length ; i++) {
            this.queryList.push(data.result_list[i]);
          }
        }
        this.infiniteScrollComplete();
        if ((data.result_list == null || data.result_list.length < Number(this.icmpConstant.pageSize)) && this.infiniteScroll != null) {
          this.infiniteScroll.enable(false);
        }
      } else {
        this.queryList = data.tab_list;
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    }, () => {
      this.refresherComplete();
    });
  }

  /**
   * 打开查询条件输入页面
   */
  queryConditonOpen(): void {
    let modal = this.modalCtrl.create(QueryListConditionPage, {'conditionList': this.conditionList, 'queryInput': this.queryInput});
    modal.onDidDismiss(data => {
      if (data != null) {
        this.queryInput = data;
        this.initQueryList();
      }
    });
    modal.present();
  }

  /**
   * 跳转到二级查询列表
   */
  goQuerySubList(item: Object): void {
    let menu = {...this.navParams.data};
    menu.title = item['tab_name'];
    menu.defaultTab = item['tab_value'];
    this.navCtrl.push(QueryListPage, menu);
  }

  /**
   * 跳转到查询详细页面
   */
  goQueryDetail(item: Object): void {
    let detailTitle = item['detailTitleBarText'];
    if (detailTitle == null || detailTitle === '') {
      detailTitle = this.title + '详细';
    }
    let params: Object = {
      title: detailTitle,
      businessId: item['id'],
      serviceName: this.navParams.get('serviceName'),
      defaultTab: this.navParams.get('defaultTab')
    };
    if (item['style'] === 'notice_style') {
      this.navCtrl.push(QueryNoticeDetailPage, params);
    } else {
      this.navCtrl.push(QueryDetailPage, params);
    }
  }

  /**
   * 转换Html格式
   */
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * 下拉刷新
   */
  doRefresh(refresher: Refresher): void {
    this.refresher = refresher;
    this.initQueryList();
  }

  // 瀑布流加载
  doInfinite(infiniteScroll: InfiniteScroll): void {
    if (this.isTabQuery) {
      infiniteScroll.enable(false);
    } else {
      this.infiniteScroll = infiniteScroll;
      this.pageNo++;
      this.getQueryList(false);
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
}
