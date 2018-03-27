import { Injectable, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ICMP_CONSTANT, IcmpConstant } from '../constants/icmp.constant';
import { QueryNoticeDetailPage } from '../../pages/query/queryNoticeDetail/queryNoticeDetail';
import { ToastService } from './toast.service';
import { TranslateService } from '@ngx-translate/core';
import { QueryListPage } from '../../pages/query/queryList/queryList';
import { TodoListPage } from '../../pages/todo/todoList/todoList';
import { QueryDetailPage } from '../../pages/query/queryDetail/queryDetail';
import { InstaShotPage } from '../../pages/instaShot/instaShot';
import { ApplicationPage } from '../../pages/application/application';
import { StatisticsQueryPage } from '../../pages/statistics/statisticsQuery/statisticsQuery';
import { StatisticsViewPage } from '../../pages/statistics/statisticsView/statisticsView';
import { ExamListPage } from '../../pages/exam/examList/examList';

/**
 * 路由服务
 */
@Injectable()
export class RoutersService {

  // 国际化文字
  private transateContent: Object;

  /**
   * 构造函数
   */
  constructor( @Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
    private toastService: ToastService,
    private translate: TranslateService) {
    this.translate.get(['NO_DETAILED_INFO']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 页面跳转
   */
  pageForward(navCtrl: NavController, menu: any): void {
    if (menu.page === this.icmpConstant.page.queryList) {
      navCtrl.push(QueryListPage, menu);
    } else if (menu.page === this.icmpConstant.page.queryDetail) { // 查询详细页
      if (menu.style === 'notice_style') {
        navCtrl.push(QueryNoticeDetailPage, menu);
      } else if (menu.style === 'no_detail') {
        this.toastService.show(this.transateContent['NO_DETAILED_INFO']);
      } else {
        navCtrl.push(QueryDetailPage, menu);
      }
    } else if (menu.page === this.icmpConstant.page.todoList) {
      navCtrl.push(TodoListPage, menu);
    } else if (menu.page === this.icmpConstant.page.instaShot) {
      navCtrl.push(InstaShotPage);
    } else if (menu.page === this.icmpConstant.page.application) {
      navCtrl.push(ApplicationPage, menu);
    } else if (menu.page === this.icmpConstant.page.statisticsSearch) {
      navCtrl.push(StatisticsQueryPage, menu);
    } else if (menu.page === this.icmpConstant.page.statisticsView) {
      navCtrl.push(StatisticsViewPage, menu);
    } else if (menu.page === this.icmpConstant.page.examList) {
      navCtrl.push(ExamListPage, menu);
    } else {
      this.toastService.show(this.transateContent['NO_DETAILED_INFO']);
    }
  }
}
