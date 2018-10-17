import { Component, NgZone } from '@angular/core';
import { NavController, Platform, NavParams, LoadingController  } from 'ionic-angular';
import { UserInfoState, initUserInfo, UserService } from '../../app/services/user.service';
import { MacAddressHistoy } from './history/history';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../app/services/toast.service';
import { Http, Response } from '@angular/http';
import { UtilsService } from '../../app/services/utils.service';
import { DeviceService, DeviceInfoState } from '../../app/services/device.service';
import { MacFramePage } from '../macAddress/macFrame/macFrame';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-mac-address',
  templateUrl: 'macAddress.html'
})
export class MacAddressPage {

  // 国际化文字
  private transateContent: Object;
  // segment 选项卡
  private segmentPage = '';
  // 用户信息
  private userInfo: UserInfoState = initUserInfo;
  // 提交信息
  private submitInfo: Object = {};
  // 绑定状态列表
  private bindArray: Array<Object> = [];
  // 提交状态
  private succPage: Boolean = false;
  // 菜单信息
  private macMenu:  Object = {};
  // 流程数据
  private macProcessData:  Object = {};

  /**
   * 构造函数
   */
  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private translate: TranslateService,
    private toastService: ToastService,
    private deviceService: DeviceService,
    private zone: NgZone,
    public platform: Platform,
    private utils: UtilsService,
    private iab: InAppBrowser,
    public params: NavParams,
    public loadingCtrl: LoadingController,
    private http: Http) {
    this.translate.get([
      'CHECK_APPLY_PROGRESS', 'PLEASE_ENTER_MAC_ADDRESS', 'PLEASE_ENTER_NAME',
      'PLEASE_ENTER_USERNAME', 'SUBMIT_SUCCESS', 'PLEASE_ENTER_RIGHT_MAC_ADDRESS',
      'PLEASE_NOT_ENTER_EMOJI_IN_USERNAME', 'USERNEMA_OVER_MAX_LENGTH', 'PLEASE_NOT_ENTER_EMOJI_IN_NAME', 'NAME_OVER_MAX_LENGTH'
    ]).subscribe((res: Object) => {
      this.transateContent = res;
    });
    this.segmentPage = 'apply';
    this.userInfo = this.userService.getUserInfo();
    this.macMenu = this.params.get('menu')['data'].url;
    this.submitInfo['appliTypeCode'] = '0';
    this.submitInfo['applicant'] = this.userInfo.userName;
    this.submitInfo['username'] = this.userInfo.userName;
    this.submitInfo['name'] = '';
    this.submitInfo['macAddress'] = '';
    let deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
    this.platform.ready().then(() => {
      if (deviceInfo.deviceType === 'android') {
        (<any>window).MacPlugin.getMacAddress('', (macAddress) => {
          this.zone.run(() => {
            this.submitInfo['macAddress'] = macAddress;
          });
        });
      }
    });
  }
  /**
   * 点击 segment
   */
  segmentChanged() {
    if (this.segmentPage === 'state') {
      this.getBindInfo();
    }
  }

  /**
   * 获取绑定信息
   */
  getBindInfo() {
    let loading = this.loadingCtrl.create({
      content: '正在加载数据...',

    });
    loading.present();
    this.http.get('/mac/app/state', { params: { 'pageNo': '1', 'pageSize': '9999' } }).subscribe((res: Response) => {
      loading.dismiss();
      this.bindArray = res.json();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }
  /**
   * 提交表单
   */
  submit() {
    const emojiSymbol = /\ud83d[\udc00-\ude4f\ude80-\udfff]/g; // emoji表情
    const username = this.submitInfo['username'].trim(); // .replace(/\ud83d[\udc00-\ude4f\ude80-\udfff]/g, '')
    const name = this.submitInfo['name'].trim();
    if (username === ''){
      this.toastService.show(this.transateContent['PLEASE_ENTER_USERNAME']);
    }
    else if (emojiSymbol.test(username)) {
      this.toastService.show(this.transateContent['PLEASE_NOT_ENTER_EMOJI_IN_USERNAME']);
    }
    else if (username.length > 12){
      this.toastService.show(this.transateContent['USERNEMA_OVER_MAX_LENGTH']);
    }
    else if (name === ''){
      this.toastService.show(this.transateContent['PLEASE_ENTER_NAME']);
    }
    else if (emojiSymbol.test(name)) {
      this.toastService.show(this.transateContent['PLEASE_NOT_ENTER_EMOJI_IN_NAME']);
    }
    else if (name.length > 12){
      this.toastService.show(this.transateContent['NAME_OVER_MAX_LENGTH']);
    }
    else if (this.submitInfo['macAddress'].length === 0){
      this.toastService.show(this.transateContent['PLEASE_ENTER_MAC_ADDRESS']);
    }
    else if (!this.utils.isMacAddress(this.submitInfo['macAddress'])) {
      this.toastService.show(this.transateContent['PLEASE_ENTER_RIGHT_MAC_ADDRESS']);
    }
    else {
      this.submitInfo['appliTypeName'] = this.submitInfo['appliTypeCode'] === '0' ? '绑定' : '解绑';
      this.submitInfo['actualTypeCode'] = this.submitInfo['appliTypeCode'];
      this.submitInfo['actualTypeName'] = this.submitInfo['appliTypeCode'] === '0' ? '绑定' : '解绑';
      this.submitApply(this.submitInfo)
    }
  }
  /**
   * 提交流程申请
  */
  submitApply = (data) => {
    this.http.post('/workflow/process/mac', data).subscribe((res: Response) => {
      this.getBindInfo() // 刷新列表数据
      this.toastService.show(this.transateContent['SUBMIT_SUCCESS']);
      setTimeout(() => {
        this.succPage = true;
        if (res['_body'] != null && res['_body'] !== '') {
          this.macProcessData = res.json();
        }
      }, 1000)
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 修改绑定状态
  */
  changeBind(info: Object) {
    const postData = {
      actualTypeCode: info['actualTypeCode'] === '1' ? '0' : '1',
      actualTypeName: info['actualTypeCode'] === '1' ? '绑定' : '解绑',
      appliTypeCode:  info['actualTypeCode'] === '1' ? '0' : '1',
      appliTypeName:  info['actualTypeCode'] === '1' ? '绑定' : '解绑',
      applicant: this.submitInfo['applicant'],
      name: info['deviceName'],
      username: info['userName'],
      macAddress: info['macAddress']
    };
    this.submitApply(postData)
  }
  /**
   * 查看当前状态
   */
  checkType(info: Object){
    this.succPage = false;
    this.checkProgress(info)
  }
  /**
   * 检查申请进度
   */
  checkProgress = (record) => {
    let data = (typeof(record) !== 'undefined' ) ? record : this.macProcessData;
    const procInstId = data['procInstId'];
    let  businessObj;
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
        name: data['processTitle'],
        processDefinitionId:  data['processDefinitionId'],
        stateCode:  data['stateCode'],
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
    let url = `${this.macMenu}/workflowMainPop?param=${data}`;
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
    } else {
    const browser = this.iab.create(dataALL.data.url, '_blank', { 'location': 'no', 'toolbar': 'no' });
     // 未看到实际效果 如何返回 TODO
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
          }
        });
      }, 500);
    });
  }
  }

  /**
   * 跳转历史列表
   */
  openHistory = () => {
    this.navCtrl.push(MacAddressHistoy, this.params.get('menu') );
  }
}
