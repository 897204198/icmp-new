import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, Alert, ModalController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { UtilsService } from '../../../app/services/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { SearchboxComponent } from '../../../app/component/searchbox/searchbox.component';

/**
 * 待办审批页面
 */
@Component({
  selector: 'page-todo-opinion',
  templateUrl: 'todoOpinion.html'
})
export class TodoOpinionPage {

  // 审批意见选项
  private opinionList: Object[];
  // 审批意见其他填写项目
  private opinionOtherList: Object[];
  // 控制项目是否显示
  private controls: Object = {};
  // 审批意见内容
  private approvalInput: Object = {};
  // 是否隐藏审批内容
  private hideComment: boolean = false;
  // 弹出框对象
  private confirmAlert: Alert;
  // 弹出框是否打开
  private alertOpen: boolean = false;
  // 国际化文字
  private transateContent: Object;

  /**
   * 构造函数
   */
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private http: Http,
    private toastService: ToastService,
    private utilsService: UtilsService,
    private translate: TranslateService,
    private modalCtrl: ModalController) {
    let translateKeys: string[] = ['VALI_REQUIRED', 'PROMPT_INFO', 'CANCEL', 'CONFIRM', 'SUBMIT_OPINION_CONFIRM', 'SUBMIT_SUCCESS', 'SUBMIT_ERROR', 'REQUIRE_NOT'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 首次次进入页面
   */
  ionViewDidLoad(): void {
    this.hideComment = this.navParams.get('hideComment');
    if (this.navParams.get('commentDefault') != null) {
      this.approvalInput['comments'] = this.navParams.get('commentDefault');
    }
    this.setApprovalItems();
  }

  /**
   * 离开页面
   */
  ionViewWillLeave(): void {
    if (this.alertOpen) {
      this.confirmAlert.dismiss();
    }
  }

  /**
   * 设置页面表单项
   */
  setApprovalItems(): void {
    let approval: any[] = this.navParams.get('approval');
    if (approval[0] != null && approval[0].length > 0) {
      this.opinionList = approval[0];
      for (let i = 0; i < this.opinionList.length; i++) {
        this.controls[this.opinionList[i]['value']] = this.opinionList[i]['control_name'];
      }
      this.approvalInput['opinion'] = approval[0][0]['value'];
    } else {
      this.opinionList = [];
    }
    if (approval[1] != null && approval[1].length > 0) {
      this.opinionOtherList = approval[1];
      for (let i = 0; i < this.opinionOtherList.length; i++) {
        let item = this.opinionOtherList[i];
        if (item['control_default'] != null && item['control_default'] !== '') {
          this.approvalInput[item['control_name']] = item['control_default'];
          if (item['control_type'] === 'select_searchbox') {
            this.approvalInput[item['control_name'] + '_name'] = item['control_default_name'];
          }
        }
        if (item['control_formatter'] != null && item['control_formatter'] !== '') {
          item['control_formatter'] = item['control_formatter'].replace(new RegExp('y', 'gm'), 'Y').replace(new RegExp('d', 'gm'), 'D');
        }
      }
    } else {
      this.opinionOtherList = [];
    }
  }

  /**
   * 提交审批意见
   */
  submitOpinion(): void {
    this.confirmAlert = this.alertCtrl.create({
      title: this.transateContent['PROMPT_INFO'],
      message: this.transateContent['SUBMIT_OPINION_CONFIRM'],
      buttons: [
        {
          text: this.transateContent['CANCEL'],
          handler: () => {
            this.alertOpen = false;
          }
        },
        {
          text: this.transateContent['CONFIRM'],
          handler: () => {
            this.alertOpen = false;
            this.submitOpinionHttp();
          }
        }
      ]
    });
    this.confirmAlert.present();
    this.alertOpen = true;
  }

  /**
   * 提交验证
   */
  submitValidate(): boolean {
    if (this.controls[this.approvalInput['opinion']] != null && this.controls[this.approvalInput['opinion']].length > 0) {
      for (let i = 0; i < this.controls[this.approvalInput['opinion']].length; i++) {
        let requireControl = this.controls[this.approvalInput['opinion']][i];
        let opinionItem = {};
        for (let j = 0; j < this.opinionOtherList.length ; j++) {
          if (requireControl === this.opinionOtherList[j]['control_name']) {
            opinionItem = this.opinionOtherList[j];
          }
        }
        if (opinionItem['validate'] != null && opinionItem['validate']['required'] != null && opinionItem['validate']['required']) {
          if (this.approvalInput[requireControl] == null || this.approvalInput[requireControl] === '') {
            this.toastService.show(this.transateContent['VALI_REQUIRED']);
            return false;
          }
        }
      }
      for (let i = 0; i < this.opinionOtherList.length; i++) {
        let item = this.opinionOtherList[i];
        if (item['status'] === 'display' && item['validate'] != null && item['validate']['required']) {
          if (this.approvalInput[item['control_name']] == null || this.approvalInput[item['control_name']] === '') {
            this.toastService.show(this.transateContent['VALI_REQUIRED']);
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * 提交审批意见请求
   */
  submitOpinionHttp(): void {
    if (this.submitValidate()) {
      let submitUtl: string = this.navParams.get('submitUtl');
      let params: URLSearchParams = new URLSearchParams();
      for (let key in this.approvalInput) {
        if (this.approvalInput.hasOwnProperty(key)) {
          params.append(key, this.approvalInput[key]);
        }
      }
      params.append('processName', this.navParams.get('processName'));
      params.append('taskId', this.navParams.get('taskId'));
      params.append('step', this.navParams.get('step'));
      this.http.post(submitUtl, params).subscribe((res: Response) => {
        let data = res.json();
        if (data.result === '0') {
          this.toastService.show(this.transateContent['SUBMIT_SUCCESS']);
          this.navCtrl.popToRoot();
        } else {
          if (data.errMsg != null && data.errMsg !== '') {
            this.toastService.show(data.errMsg);
          } else {
            this.toastService.show(this.transateContent['SUBMIT_ERROR']);
          }
        }
      }, (res: Response) => {
        this.toastService.show(res.text());
      });
    }
  }

  /**
   * 查询框选择
   */
  searchboxSelect(item: Object): void {
    let multiple: boolean = item['control_more'];
    let searchUrl = item['search_url'];
    if (item['control_type'] === 'select_person') {
      searchUrl = '/webController/searchPerson';
    }
    let params: Object = { 'title': item['control_label'], 'multiple': multiple, 'searchUrl': searchUrl };
    let modal = this.modalCtrl.create(SearchboxComponent, params);
    modal.onDidDismiss(data => {
      if (data != null) {
        this.approvalInput[item['control_name'] + '_name'] = data.name;
        this.approvalInput[item['control_name']] = data.id;
      }
    });
    modal.present();
  }

  /**
   * 是否显示表单项目
   */
  isDisplayFormItem(item: Object): boolean {
    if (item['control_type'] === 'hidden') {
      return false;
    }
    if (this.controls[this.approvalInput['opinion']] != null) {
      if (this.controls[this.approvalInput['opinion']].indexOf(item['control_name']) >= 0) {
        return true;
      }
    }
    if (item['status'] === 'display') {
      return true;
    }
    return false;
  }

  /**
   * 设置日期控件默认值
   */
  setDatetime(item: Object): void {
    if (this.approvalInput[item['control_name']] == null || this.approvalInput[item['control_name']] === '') {
      this.approvalInput[item['control_name']] = this.utilsService.formatDate(new Date(), item['control_formatter']);
    }
  }

  /**
   * 清空日期控件
   */
  clearDatetime(item: Object): void {
    this.approvalInput[item['control_name']] = '';
  }

  /**
   * 下拉选择事件
   */
  selectChange(item: Object): void {
    let data = item['control_list'];
    for (let i = 0 ; i < data.length ; i++) {
      this.setControl(item, data[i]);
    }
  }

  /**
   * 意见改变
   */
  opinionChange(): void {
    for (let i = 0 ; i < this.opinionOtherList.length ; i++) {
      delete this.opinionOtherList[i]['status'];
      let item = this.opinionOtherList[i];
      this.approvalInput[item['control_name']] = item['control_default'];
      if (item['control_type'] === 'select_searchbox') {
        this.approvalInput[item['control_name'] + '_name'] = item['control_default_name'];
      }
    }
  }

  /**
   * 设置控制事件
   */
  setControl(item: Object, option: Object) {
    if (option['controls'] != null) {
      for (let j = 0 ; j < option['controls'].length ; j++) {
        let control = option['controls'][j];
        if (control['type'] === 'display') {
          if (this.approvalInput[item['control_name']] != null && this.approvalInput[item['control_name']].indexOf(option['id']) >= 0) {
            for (let k = 0 ; k < control.models.length ; k++) {
              this.setInputStatus(control.models[k], 'display');
            }
          } else {
            for (let k = 0 ; k < control.models.length ; k++) {
              this.setInputStatus(control.models[k], 'hidden');
            }
          }
        }
      }
    }
  }

  /**
   * 设置表单控件状态
   */
  setInputStatus(model: string, status: string): void {
    for (let i = 0 ; i < this.opinionOtherList.length ; i++) {
      if (this.opinionOtherList[i]['control_name'] === model) {
        this.opinionOtherList[i]['status'] = status;
        if (status === 'hidden') {
          this.approvalInput[model] = null;
          if (this.opinionOtherList[i]['type'] === 'select_searchbox') {
            this.approvalInput[model + '_name'] = null;
          }
        }
        break;
      }
    }
  }
}
