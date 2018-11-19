import { Injectable, Inject } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ICMP_CONSTANT, IcmpConstant } from '../constants/icmp.constant';
import { QueryNoticeDetailPage } from '../../pages/query/queryNoticeDetail/queryNoticeDetail';
import { ToastService } from './toast.service';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { QueryListPage } from '../../pages/query/queryList/queryList';
import { TodoListPage } from '../../pages/todo/todoList/todoList';
import { QueryDetailPage } from '../../pages/query/queryDetail/queryDetail';
import { InstaShotPage } from '../../pages/instaShot/instaShot';
import { ApplicationPage } from '../../pages/application/application';
import { StatisticsQueryPage } from '../../pages/statistics/statisticsQuery/statisticsQuery';
import { StatisticsViewPage } from '../../pages/statistics/statisticsView/statisticsView';
import { EmergencyTreatmentPage } from '../../pages/statistics/emergencyTreatment/emergencyTreatment';

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
    private http: Http,
    public alertCtrl: AlertController,
    private translate: TranslateService) {
    this.translate.get(['PASSWORD_WRONG', 'PLEASE_ENTER_PASSWORD', 'NO_PASSWORD_INFO', 'NO_POWER_INFO', 'PROMPT_INFO', 'NO_DETAILED_INFO']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 页面跳转
   */
  pageForward(navCtrl: NavController, menu: any): void {
    if (menu.systemId === this.icmpConstant.systemId.queryList) {
      this.isHasPass(navCtrl, menu);
    } else if (menu.systemId === this.icmpConstant.systemId.queryDetail) { // 查询详细页
      if (menu.style === 'notice_style') {
        navCtrl.push(QueryNoticeDetailPage, menu);
      } else if (menu.style === 'no_detail') {
        this.toastService.show(this.transateContent['NO_DETAILED_INFO']);
      } else {
        navCtrl.push(QueryDetailPage, menu);
      }
    } else if (menu.systemId === this.icmpConstant.systemId.todoList) {
      navCtrl.push(TodoListPage, menu);
    } else if (menu.systemId === this.icmpConstant.systemId.instaShot) {
      navCtrl.push(InstaShotPage);
    } else if (menu.systemId === this.icmpConstant.systemId.application) {
      navCtrl.push(ApplicationPage, menu);
    } else if (menu.systemId === this.icmpConstant.systemId.statisticsSearch) {
      navCtrl.push(StatisticsQueryPage, menu);
    } else if (menu.systemId === this.icmpConstant.systemId.statisticsView) {
      navCtrl.push(StatisticsViewPage, menu);
    } else if (menu.systemId === this.icmpConstant.systemId.emergency) {
      navCtrl.push(EmergencyTreatmentPage, menu);
    } else {
      this.toastService.show(this.transateContent['NO_DETAILED_INFO']);
    }
  }
  /**
   * 判断是否是有权限进入该页面
   */
  isHasPass(navCtrl: any, menu: any): void {
    if (menu.hadpass === 'true') {
      let params: URLSearchParams = new URLSearchParams();
      params.append('serviceName', 'pushMsgQueryService');
      params.append('someTime', 'someTime');
      this.http.post('/webController/checkSalaryInquiryLogin', params).subscribe((res: Response) => {
        let dataCom = res.json();
        let passw = dataCom.password;
        let someTime = dataCom.someTime;
        if (someTime === '0') {
          let alert = this.alertCtrl.create({
            title: this.transateContent['PROMPT_INFO'],
            message: this.transateContent['NO_POWER_INFO'],
            buttons: ['OK']
          });
          alert.present();
        } else if (someTime === '1'){
          let alert = this.alertCtrl.create({
            title: this.transateContent['PROMPT_INFO'],
            message: this.transateContent['NO_PASSWORD_INFO'],
            buttons: ['OK']
          });
          alert.present();
        } else {
          let prompt = this.alertCtrl.create({
            title: this.transateContent['PROMPT_INFO'],
            inputs: [
              {
                name: 'password',
                placeholder: this.transateContent['PLEASE_ENTER_PASSWORD'],
                type: 'password'
              },
            ],
            buttons: [
              {
                text: this.transateContent['CANCEL']
              },
              {
                text: this.transateContent['CONFIRM'],
                handler: data => {
                  if ( data.password === passw) {
                    navCtrl.push(QueryListPage, menu);
                  } else {
                    if (data.password == null || data.password === '') {
                      this.toastService.show(this.transateContent['PLEASE_ENTER_PASSWORD']);
                    } else {
                      this.toastService.show(this.transateContent['PASSWORD_WRONG']);
                    }
                    return false;
                  }
                }
              }
            ]
          });
          prompt.present();
        }
      }, (res: Response) => {
        // todo
      });
    } else {
      navCtrl.push(QueryListPage, menu);
    }
  }
}
