import { Injectable, Inject } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { ICMP_CONSTANT, IcmpConstant } from '../constants/icmp.constant';
import { QueryNoticeDetailPage2 } from '../../pages2/query/queryNoticeDetail/queryNoticeDetail';
import { ToastService } from './toast.service';
import { TranslateService } from '@ngx-translate/core';
import { QueryListPage2 } from '../../pages2/query/queryList/queryList';
import { TodoListPage2 } from '../../pages2/todo/todoList/todoList';
import { QueryDetailPage2 } from '../../pages2/query/queryDetail/queryDetail';
import { InstaShotPage } from '../../pages/instaShot/instaShot';
import { StatisticsQueryPage } from '../../pages/statistics/statisticsQuery/statisticsQuery';
import { StatisticsViewPage } from '../../pages/statistics/statisticsView/statisticsView';
import { ExamCustomFramePage } from '../../pages/exam/customFrame/customFrame';
import { MacAddressPage } from '../../pages/macAddress/macAddress';
import { EmailPage } from '../../pages/email/email';
import { ApplicationPage } from '../../pages/application/application';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { DeviceInfoState, DeviceService } from './device.service';
import { Store } from '@ngrx/store';
import { ConfigsService } from '../services/configs.service';
import { EmergencyTreatmentPage } from '../../pages2/emergencyTreatment/emergencyTreatment';
import { RfidPage } from '../../pages/rfid/rfid';
import { PhotoService } from './photo.service';
import { QueryDetailPage } from '../../pages/query/queryDetail/queryDetail';

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
  constructor(@Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
    private configsService: ConfigsService,
    private toastService: ToastService,
    private translate: TranslateService,
    private deviceService: DeviceService,
    private store: Store<string>,
    private events: Events,
    private photoService: PhotoService,
    private iab: InAppBrowser) {
    this.translate.get(['NO_DETAILED_INFO']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 页面跳转
   */
  pageForward(navCtrl: NavController, menu: any): void {
    if (menu.page === this.icmpConstant.page.queryList) {
      navCtrl.push(QueryListPage2, menu);
    } else if (menu.page === this.icmpConstant.page.queryDetail) { // 查询详细页
      if (menu.style === 'notice_style') {
        navCtrl.push(QueryNoticeDetailPage2, menu);
      } else if (menu.style === 'no_detail') {
        this.toastService.show(this.transateContent['NO_DETAILED_INFO']);
      } else {
        navCtrl.push(QueryDetailPage2, menu);
      }
    } else if (menu.page === this.icmpConstant.page.todoList) {
      navCtrl.push(TodoListPage2, menu);
    } else if (menu.page === this.icmpConstant.page.instaShot) {
      navCtrl.push(InstaShotPage);
    } else if (menu.page === this.icmpConstant.page.application) {
      navCtrl.push(ApplicationPage, menu);
    } else if (menu.page === this.icmpConstant.page.statisticsSearch) {
      navCtrl.push(StatisticsQueryPage, menu);
    } else if (menu.page === this.icmpConstant.page.statisticsView) {
      navCtrl.push(StatisticsViewPage, menu);
    }else if (menu.page === this.icmpConstant.page.emergency) {
      navCtrl.push(EmergencyTreatmentPage, menu);
    } else if (menu.page === this.icmpConstant.page.examList) {
      const deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
      if (deviceInfo.deviceType === 'android') {
        navCtrl.push(ExamCustomFramePage, menu);
      } else {
        let menuStr: string = menu.data.url;
        if (localStorage.getItem('stopStreamline') && JSON.parse(localStorage.getItem('stopStreamline'))) {
          menuStr = this.configsService.getBaseWebUrl() + menuStr;
        } else {
          if (localStorage.getItem('serviceheader') === 'null' || localStorage.getItem('serviceheader') === '') {
            menuStr = this.configsService.getBaseWebUrl() + 'standard' + menuStr;
          }else{
            menuStr = this.configsService.getBaseWebUrl() + localStorage.getItem('serviceheader') + menuStr;
          }
        }
        let url;

        if (menuStr.includes('?')) {
          url = menuStr + '&token=' + localStorage.getItem('token') + '&title=' + menu.name;
        } else {
          url = menuStr + '?token=' + localStorage.getItem('token') + '&title=' + menu.name;
        }
        url = url.replace('#', '?v=' + new Date().getTime() + '#');
        const browser = this.iab.create(url, '_blank', { 'location': 'no', 'toolbar': 'no' });
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
                console.log('看看浏览器走back哈哈');
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
    } else if (menu.page === this.icmpConstant.page.macAddress) {
      navCtrl.push(MacAddressPage, {menu});
    } else if (menu.page === this.icmpConstant.page.email) {
      navCtrl.push(EmailPage, menu);
    }else if (menu.systemId === this.icmpConstant.page.rfid) {
      navCtrl.push(RfidPage, menu);
    } else if (menu.systemId === this.icmpConstant.page.scan) {
      this.photoService.openScan(function(rfidInfo){
        if (rfidInfo) {
          const addInfo = Object.assign(menu, { 'rfid': rfidInfo['text'], 'scan': true});
          if (!rfidInfo['cancelled']){
            navCtrl.push(QueryDetailPage, addInfo);
            console.log('正确扫码 进入详情页');
          } else {
            console.log('未扫码 返回上一页');
            navCtrl.pop();
          }
        }
      });
    }else {
      this.toastService.show(this.transateContent['NO_DETAILED_INFO']);
    }
  }
}
