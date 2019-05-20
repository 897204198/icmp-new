import { Component, Inject, ViewChild } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController, NavParams, Refresher, InfiniteScroll, ModalController } from 'ionic-angular';
import { ICMP_CONSTANT, IcmpConstant } from '../../../app/constants/icmp.constant';
import { ToastService } from '../../../app/services/toast.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { QueryListConditionPage2 } from '../queryListCondition/queryListCondition';
import { QueryDetailPage2 } from '../queryDetail/queryDetail';
import { QueryNoticeDetailPage2 } from '../queryNoticeDetail/queryNoticeDetail';
import { CalendarComponentOptions } from 'icon2-calendar-ng-v4';
import { QueryScheduleDetailPage } from '../queryScheduleDetail/queryScheduleDetail';
import { ApplicationPage } from '../../../pages/application/application';

/**
 * 查询列表页面
 */
@Component({
  selector: 'page-query-list',
  templateUrl: 'queryList.html',
})
export class QueryListPage2 {

  @ViewChild(InfiniteScroll) infiniteScroll: InfiniteScroll;
  // 页面标题
  title: string = '';
  // 页码
  pageNo: number = 0;
  // 是否为一级查询列表
  isTabQuery: boolean = true;
  // 是否为二级查询列表
  isAssetsType: boolean = false;
  // 默认tab参数
  defaultTab: string = '';
  // 日历当前选中月份
  nowMonth: string = '';
  // 日历标题
  caption: string = '';
  // 是否为日程查询
  isScheduleQuery: boolean = false;
  // 日历选项
  options: CalendarComponentOptions = {};
  // 查询类型
  queryType: string = '';
  // 选择日期
  date: string = '';
  // 是否有查询条件
  hasCondition: boolean = false;
  // 查询结果列表
  queryList: Object[];
  // 查询条件列表
  conditionList: Object[];
  // 查询条件
  queryInput: Object;
  // 是否选中时间
  private selectTime: string = '';
  // 下拉刷新事件
  private refresher: Refresher;
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
    this.queryType = this.navParams.get('serviceName');
    this.title = this.navParams.get('name');
    if (this.queryType === 'scheduleQueryService') {
      this.isScheduleQuery = true;
      const date = this.formatDate(new Date());
      this.caption = `${date.substring(0,4)}年${date.substring(5,7)}月${date.substring(8)}日`;
    }
    this.hasCondition = false;
    this.conditionList = [];
    this.initQueryList();
  }
  /**
   * 即将离开页面
   */
  onPageWillLeave(): void {
    this.date = '';
  }
  /**
   * 初始化查询结果列表
   */
  initQueryList(): void {
    this.queryList = null;
    this.pageNo = 1;
    this.infiniteScroll.enable(true);
    this.getQueryList(true, false);
    // 判断是否是首次
    if (this.selectTime !== '') {
      this.getQueryList(false, false);
    }
  }

  /**
   * 取得查询结果列表
   */
  getQueryList(isInit: boolean, isMonthChange: boolean): void {
    let params: URLSearchParams = new URLSearchParams();
    params.append('pageNo', this.pageNo.toString());
    params.append('pageSize', this.icmpConstant.pageSize);
    params.append('serviceName', this.navParams.get('serviceName'));
    params.append('defaultTab', this.navParams.get('defaultTab'));
    /* 全院资产-补充参数 */
    params.append('ASSETS_CODE', this.navParams.get('ASSETS_CODE'));
    if (isMonthChange){
      params.append('date', this.nowMonth);
    }else {
      params.append('date', this.formatDate(new Date()));
    }
    if (isInit && this.isScheduleQuery) {
      params.append('date', this.selectTime);
    }
    /* 添加查询条件到二级查询 */
    if (this.navParams.get('queryInput')) {
      this.queryInput = this.navParams.get('queryInput');
    }
    if (this.queryInput != null) {
      for (let key in this.queryInput) {
        if (this.queryInput.hasOwnProperty(key)) {
          params.append(key, this.queryInput[key]);
        }
      }
    }
    if (this.isScheduleQuery) {
      // 日历默认配置
      this.options = {
        monthPickerFormat: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthFormat: 'YYYY年MM月',
        weekdays: ['日', '一', '二', '三', '四', '五', '六']
      };
      this.http.post('/webController/getScheduleInfo', params).subscribe((res: any) => {
        let data = res.json();
        const { startDate, endDate, daysConfig } = data;
        this.options = {
          ...this.options,
          from: startDate,
          to: endDate ?  new Date(Number(endDate.substring(0, 4)), Number(endDate.substring(5, 7)) - 1, Number(endDate.substring(8))) : 0,
          daysConfig: daysConfig
        };
      }, (res: Response) => {
        this.toastService.show(res.text());
      });
    } else {
      this.http.post('/webController/getSystemMsgList', params).subscribe((res: any) => {
        let data = res.json();
        let defaultTab = this.navParams.get('defaultTab');
        /* 下一级的defalut_tab */
        this.defaultTab = data.default_tab;
        if (data.tab_list == null || data.tab_list.length <= 1 || (defaultTab != null && defaultTab !== '' && defaultTab !== 'default')) {
          this.isTabQuery = false;
        } else {
          this.isTabQuery = true;
        }
        if (data.type_list == null || data.type_list.length <= 1 ) {
          this.isAssetsType = false;
        } else {
          this.isAssetsType = true;
        }
        /* 多级查询 */
        if (!this.isTabQuery) {
          const tempArray = this.isAssetsType ? data.type_list : data.result_list;
           if (isInit) {
            this.queryList = tempArray;
            if (data.query_conditon != null && data.query_conditon.length > 0) {
              this.hasCondition = true;
              this.conditionList = data.query_conditon;
            }
          } else {
            for (let i = 0 ; i < tempArray.length ; i++) {
              this.queryList.push(tempArray[i]);
            }
          }
          /* 更新分页 */
          this.infiniteScrollComplete();
          if ((tempArray == null || tempArray.length < Number(this.icmpConstant.pageSize)) && this.infiniteScroll != null) {
            this.infiniteScroll.enable(false);
          }
        } else if (this.isTabQuery && !this.isAssetsType){
          /* 二级查询-用车查询 */
          this.queryList = data.tab_list;
        }
      }, (res: Response) => {
        this.toastService.show(res.text());
      }, () => {
        this.refresherComplete();
      });
    }
  }

  /**
   * 打开查询条件输入页面
   */
  queryConditonOpen(): void {
    let modal = this.modalCtrl.create(QueryListConditionPage2, {'conditionList': this.conditionList, 'queryInput': this.queryInput});
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
    /* 二级查询 */
    if (!this.isAssetsType) {
      let menu = {...this.navParams.data};
      menu.title = item['tab_name'];
      menu.defaultTab = item['tab_value'];
      this.navCtrl.push(QueryListPage2, menu);
    } else {
      /* 多级查询 */
      let menu = {...this.navParams.data};
      /* 添加查询条件 */
      menu.queryInput = this.queryInput;
      menu.defaultTab = this.defaultTab;
      if (this.defaultTab !== 'assetsDetail') {
        menu.ASSETS_CODE = item['ASSETS_CODE'];
        this.navCtrl.push(QueryListPage2, menu);
      } else {
        this.goQueryDetail(item);
      }
    }
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
      businessId: item.hasOwnProperty('ID') ? item['ID'] : item['id'],
      serviceName: this.navParams.get('serviceName'),
      defaultTab: this.navParams.get('defaultTab')
    };
    if (item['style'] === 'notice_style') {
      this.navCtrl.push(QueryNoticeDetailPage2, params);
    } else if (item['style'] === 'application_style') {  // 收车查询
      // 跳转申请页 修改serviceName
      params ['serviceName'] = item['serviceName'];
      this.navCtrl.push(ApplicationPage, params);
    } else {
      this.navCtrl.push(QueryDetailPage2, params);
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

  /**
   * 瀑布流加载
   */
  doInfinite(): void {
    if (this.isTabQuery) {
      this.infiniteScroll.enable(false);
    } else {
      this.pageNo++;
      this.getQueryList(false, false);
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
   * 日历选择事件
   */
  onSelect(e): void {
    const date = this.formatDate(new Date(e.time));
    this.selectTime = date;
    const params = {
      date
    };
    this.navCtrl.push(QueryScheduleDetailPage, params);
  }

  /**
   * 日历切换月份事件
   */
  monthChange(e): void {
    console.log(e.newMonth.string);
    this.nowMonth = e.newMonth.string;
    // 刷新日历数据
    this.getQueryList(false, true);
  }

  /**
   * @param date 日期格式化函数
   */
  formatDate(date: Date): string {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let monthStr = '';
    let day = date.getDate();
    let dayStr = '';
    if (month < 10) {
      monthStr = '0' + month;
    } else {
      monthStr = month.toString();
    }
    if (day < 10) {
      dayStr = '0' + day;
    } else {
      dayStr = day.toString();
    }
    return year + '-' + monthStr + '-' + dayStr;
  }
}
