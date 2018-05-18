import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, Alert, ModalController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../../../app/services/user.service';
import { ToastService } from '../../../../app/services/toast.service';
import { UtilsService } from '../../../../app/services/utils.service';
import { SearchboxComponent } from '../../../../app/component/searchbox/searchbox.component';

/**
 * 待办审批页面
 */
@Component({
  selector: 'page-todo-work-contact',
  templateUrl: 'workContact.html'
})
export class TodoWorkContactPage {
  // 初始化的数据
  private workContact: Object;
  // 办理状态选项
  private handleStatus: string = '1';
  // 办理结果选项
  private handleResult: string = '1';

  // 办理
  private handleOpinion: Array<Object> = [];
  // 办理情况
  handleSituation: string = '';
  // 协办意见
  joinComments: string = '';

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
    private userService: UserService,
    private http: Http,
    private toastService: ToastService,
    private utilsService: UtilsService,
    private translate: TranslateService,
    private modalCtrl: ModalController) {
    let translateKeys: string[] = ['VALI_REQUIRED', 'PROMPT_INFO', 'CANCEL', 'YES', 'NO',
      'CONFIRM', 'SUBMIT_OPINION_CONFIRM', 'SUBMIT_SUCCESS', 'SUBMIT_ERROR', 'REQUIRE_NOT'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
    this.workContact = this.navParams.get('approval')[0].workContact;
  }

  /**
   * 首次次进入页面
   */
  ionViewDidLoad(): void {
    this.handleOpinion = [
      {
        deptLabel: this.workContact['deptTitle'],
        deptId: '',
        deptName: '',
        deptUrl: this.workContact['deptUrl'],
        personLabel: this.workContact['personTitle'],
        personId: '',
        personName: '',
        personUrl: this.workContact['personUrl'],
        deptPerson: []
      }
    ];
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
   * 科室查询框选择
   */
  searchboxSelect(item: Object): void {
    let multiple: boolean = false;
    let params: Object = { 'title': item['deptLabel'], 'multiple': multiple, 'searchUrl': item['deptUrl'] };
    let modal = this.modalCtrl.create(SearchboxComponent, params);
    modal.onDidDismiss(data => {
      if (data != null) {
        item['deptId'] = data.id;
        item['deptName'] = data.name;
        this.getDeptPerson(item, data.id);
      }
    });
    modal.present();
  }

  /**
   * 获取科室人员
   */
  getDeptPerson(item: Object, deptId: string) {
    let params: URLSearchParams = new URLSearchParams();
    params.append('deptId', deptId);
    this.http.post(item['personUrl'], params).subscribe(data => {
      item['deptPerson'] = JSON.parse(data.json().deptpersons).list;
      item['personId'] = data.json().pId;
      item['personName'] = data.json().pName;
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 确认提交意见的提示框
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
    if (this.handleStatus === '1') {
      if (this.handleSituation === '') {
        this.toastService.show(this.transateContent['VALI_REQUIRED']);
        return false;
      }
    } else {
      if (this.joinComments === '') {
        this.toastService.show(this.transateContent['VALI_REQUIRED']);
        return false;
      }
      for (let i = 0; i < this.handleOpinion.length; i++) {
        const item = this.handleOpinion[i];
        if (item['deptId'] === '' || item['personId'] === '') {
          this.toastService.show(this.transateContent['VALI_REQUIRED']);
          return false;
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
      let params: URLSearchParams = new URLSearchParams();
      params.append('pageId', this.navParams.get('pageId'));
      params.append('processName', this.navParams.get('processName'));
      params.append('taskId', this.navParams.get('taskId'));
      params.append('step', this.navParams.get('step'));

      params.append('handleStatus', this.handleStatus);
      params.append('handleResult', this.handleResult);
      if (this.handleStatus === '1') {
        params.append('handleSituation', this.handleSituation);
      } else {
        params.append('joinComments', this.joinComments);
        for (let i = 0; i < this.handleOpinion.length; i++) {
          const item = this.handleOpinion[i];
          params.append('coDeptName' + i, item['deptId']);
          params.append('copersonname' + i, item['personId']);
        }
      }
      this.http.post(this.navParams.get('submitUtl'), params).subscribe((res: Response) => {
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
   * 嵌套表格添加行
   */
  addListRow(): void {
    let initItem: Object = {
      deptLabel: this.workContact['deptTitle'],
      deptId: '',
      deptName: '',
      deptUrl: this.workContact['deptUrl'],
      personLabel: this.workContact['personTitle'],
      personId: '',
      personName: '',
      personUrl: this.workContact['personUrl']
    };
    this.handleOpinion.push(initItem);
  }

  /**
   * 嵌套表格删除行
   */
  deleteListRow(iList: number): void {
    this.handleOpinion.splice(iList, 1);
  }

}
