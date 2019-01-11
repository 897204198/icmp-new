import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController  } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../app/services/toast.service';
import { DeviceService } from '../../../app/services/device.service';
import { Http, Response } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ExamCustomFramePage } from '../../exam/customFrame/customFrame';
import { ConfigsService } from '../../../app/services/configs.service';

/**
 * macAddress流程历史
 */
@Component({
  selector: 'page-mac-address-history',
  templateUrl: 'history.html'
})
export class MacAddressHistoy {

  // 国际化文字
  private transateContent: Object;
  // 历史记录列表
  private historyList: Array<Object> = [];
  // // 菜单信息
  private macMenu:  Object = {};
  /**
   * 构造函数
   */
  constructor(
    public navCtrl: NavController,
    private configsService: ConfigsService,
    private translate: TranslateService,
    private toastService: ToastService,
    private iab: InAppBrowser,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    private deviceService: DeviceService,
    private http: Http) {
        this.translate.get(['MAC_ADDRESS_HISTORY_LIST', 'START_BIND', 'APPLY_UNBIND']).subscribe((res: Object) => {
            this.transateContent = res;
       });
       this.getHistoryList();
       this.macMenu = this.params.get('data')['url'];
  }
    /**
     * 返回首页
     */
    backHome(): void {
        this.navCtrl.popToRoot();
    }
    /**
     * 获取历史列表
     */
    getHistoryList(): void {
      let loading = this.loadingCtrl.create({
        content: '正在加载数据...'
      });
      loading.present();
      this.http.get('/mac/app/history', { params: { 'pageNo': '1', 'pageSize': '9999' } }).subscribe((res: Response) => {
          if (res['_body'] != null && res['_body'] !== '') {
                this.historyList = res.json();
          }
          loading.dismiss();
      }, (res: Response) => {
      this.toastService.show(res.text());
      });
    }
    /**
     * 查看详情 拼接参数
     */
    checkProcess(info): void {
      let  businessObj;
      const { procInstId, processTitle,  processDefinitionId, stateCode } = info;
      this.http.get(`/workflow/process/${procInstId}/page`).subscribe((res: Response) => {
        if (res['_body'] != null && res['_body'] !== '') {
          const response = res.json();
          const forms = response['forms'];
          businessObj = forms.length ? forms[0] : null;
        }
        const params = {
          isLaunch: false,
          taskOrProcDefKey: null,
          tabActiveKey: 'progress',
          procInstId,
          businessObj,
          name: processTitle,
          processDefinitionId,
          stateCode,
        };
        this.openProcessCheck(params);
      }, (res: Response) => {
        this.toastService.show(res.text());
      });
    }
  /**
   * 跳转页面查看流程进度
   */
  openProcessCheck  = (params) => {
    const data = btoa(encodeURIComponent(JSON.stringify(params)));
    let url = `${this.macMenu}/workflowMainPop?param=${data}&close=true`;
    // url = `${url.replace('#', '?v=' + new Date().getTime() + '#')}&token=${localStorage.getItem('token')}&title=发起申请详细&close=true`;
    const dataALL = {
      name: '发起申请详细',
      isPush: false,
      data: {
        url
      }
    };
    if (this.deviceService.getDeviceInfo().deviceType === 'android') {
      this.navCtrl.push(ExamCustomFramePage, dataALL);
    }else {
      let menuStr: string = `${this.macMenu}/workflowMainPop?param=${data}&close=true`;
      if (localStorage.getItem('serviceheader') === 'null' || localStorage.getItem('serviceheader') === '') {
        menuStr = this.configsService.getBaseWebUrl() + 'standard' + menuStr;
      }else{
        menuStr = this.configsService.getBaseWebUrl() + localStorage.getItem('serviceheader') + menuStr;
      }
      let newurl: string;
      if (menuStr.includes('?')) {
        newurl = menuStr + '&token=' + localStorage.getItem('token') + '&title=' + dataALL.name;
      } else {
        newurl = menuStr + '?token=' + localStorage.getItem('token') + '&title=' + dataALL.name;
      }
      newurl = newurl.replace('#', '?v=' + new Date().getTime() + '#');
    const browser = this.iab.create(newurl, '_blank', { 'location': 'no', 'toolbar': 'no' });
    browser.on('loadstop').subscribe(event => {
      browser.executeScript({code: 'localStorage.setItem("If_Can_Back", "" );' });
      let loop = setInterval(() => {
        browser.executeScript({
          code: 'localStorage.getItem("If_Can_Back");'
        }).then(values => {
          let If_Can_Back = values[0];
          // 返回首页
          if (If_Can_Back === 'back') {
            clearInterval(loop);
               setTimeout(() => {
                browser.close();
               }, 500);
               this.navCtrl.popToRoot();
          }
          // 返回上一页
          if (If_Can_Back === 'close') {
            clearInterval(loop);
            browser.close();
          }
        });
      }, 500);
    });
    }
  }
}
