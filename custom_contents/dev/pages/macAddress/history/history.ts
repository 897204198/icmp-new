import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController  } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../app/services/toast.service';
import { DeviceService } from '../../../app/services/device.service';
import { MacFramePage } from '../macFrame/macFrame';
import { Http, Response } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
  private macMenuUrl:  Object = {}
  /**
   * 构造函数
   */
  constructor(
    public navCtrl: NavController,
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
       this.getHistoryList()
       this.macMenuUrl = this.params.get('data')['url'];
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
          const response = res.json()
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
        }
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
    let url = `${this.macMenuUrl}/workflowMainPop?param=${data}`;
    url = url.replace('#', '?v=' + new Date().getTime() + '#') + '&token=' + localStorage.getItem('token') + '&title=' + '发起申请详细' ;
    const dataALL = {
      name: '发起申请详细',
      isPush: true,
      data: {
        url
      }
    };
    if (this.deviceService.getDeviceInfo().deviceType === 'android') {
      this.navCtrl.push(MacFramePage, dataALL);
    }else {
    const browser = this.iab.create(dataALL.data.url, '_blank', { 'location': 'no', 'toolbar': 'no' });
    // 返回首页
    browser.on('loadstop').subscribe(event => {
      browser.executeScript({ code: 'localStorage.setItem("If_Can_Back", "" );' });
      let loop = setInterval(() => {
        browser.executeScript({
          code: 'localStorage.getItem("If_Can_Back");'
        }).then(values => {
          let If_Can_Back = values[0];
          if (If_Can_Back === 'back') {
            clearInterval(loop);
            this.navCtrl.popToRoot();
            browser.close();
          }
        });
      }, 500);
    });
  }
}
}
