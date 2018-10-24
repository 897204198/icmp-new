import { Component, NgZone } from '@angular/core';
import { NavController, Platform, NavParams, LoadingController  } from 'ionic-angular';
import { UserInfoState, initUserInfo, UserService } from '../../../app/services/user.service';
import { MacAddressHistoy } from '../history/history';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../app/services/toast.service';
import { Http, Response } from '@angular/http';
import { UtilsService } from '../../../app/services/utils.service';
import { DeviceService, DeviceInfoState } from '../../../app/services/device.service';
import { MacFramePage } from '../macFrame/macFrame';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-mac-succ',
  templateUrl: 'success.html'
})
export class MacSuccPage {

  // 国际化文字
  private transateContent: Object;
  // 提交信息
  private submitInfo: Object = {};
  // 绑定状态列表
  private bindArray: Array<Object> = [];
  // 菜单信息
  private macMenu:  Object = {};
  // 流程id
  private proData:  Object = {};
  // 流程数据
  private macProcessData:  Object = {};

  /**
   * 构造函数
   */
  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private translate: TranslateService,
    private deviceService: DeviceService,
    private zone: NgZone,
    public platform: Platform,
    private utils: UtilsService,
    private iab: InAppBrowser,
    public params: NavParams,
    private toastService: ToastService,
    public loadingCtrl: LoadingController,
    private http: Http) {
    this.translate.get(['CHECK_APPLY_PROGRESS']).subscribe((res: Object) => {
      this.transateContent = res;
    });
    this.macMenu = this.params.get('menu')['data'].url;
    this.proData = this.params.get('proData');
    let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
  }
  /**
   * 跳转页面查看流程进度
   */
  openProcessCheck  = (params) => {
    const data = btoa(encodeURIComponent(JSON.stringify(params)));
    let url = `${this.macMenu}/workflowMainPop?param=${data}`;
    url = `${url.replace('#', '?v=' + new Date().getTime() + '#')}&token=${localStorage.getItem('token')}&title=发起申请详细&close=true`;
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
               }, 500)
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
  /**
   * 检查申请进度
   */
  checkProgress = () => {
    let  businessObj;
    const procInstId = this.proData['procInstId'];
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
        name: this.proData['processTitle'],
        processDefinitionId:   this.proData['processDefinitionId'],
        stateCode:  this.proData['stateCode'],
      }
      this.openProcessCheck(params);
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }
  /**
   * 跳转历史列表
   */
  openHistory = () => {
    this.navCtrl.push(MacAddressHistoy, this.params.get('menu') );
  }
}

