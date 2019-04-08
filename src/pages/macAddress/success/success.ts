import { Component, NgZone } from '@angular/core';
import { NavController, Platform, NavParams, LoadingController  } from 'ionic-angular';
import { UserService } from '../../../app/services/user.service';
import { MacAddressHistoy } from '../history/history';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../app/services/toast.service';
import { Http, Response } from '@angular/http';
import { UtilsService } from '../../../app/services/utils.service';
import { DeviceService } from '../../../app/services/device.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ConfigsService } from '../../../app/services/configs.service';
import { ExamCustomFramePage } from '../../exam/customFrame/customFrame';

@Component({
  selector: 'page-mac-succ',
  templateUrl: 'success.html'
})
export class MacSuccPage {

  // 国际化文字
  private transateContent: Object;
  // 菜单信息
  private macMenu:  Object = {};
  // 流程id
  private proData:  Object = {};

  /**
   * 构造函数
   */
  constructor(
    public navCtrl: NavController,
    private configsService: ConfigsService,
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
      if (localStorage.getItem('stopStreamline') && JSON.parse(localStorage.getItem('stopStreamline'))) {
        menuStr = this.configsService.getBaseWebUrl() + menuStr;
      } else {
        if (localStorage.getItem('serviceheader') === 'null' || localStorage.getItem('serviceheader') === '') {
          menuStr = this.configsService.getBaseWebUrl() + 'standard' + menuStr;
        }else{
          menuStr = this.configsService.getBaseWebUrl() + localStorage.getItem('serviceheader') + menuStr;
        }
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
      };
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

