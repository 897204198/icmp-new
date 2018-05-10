import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, Alert, ModalController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
// import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { DeviceService } from '../../../../app/services/device.service';
// import { UserService } from '../../../../app/services/user.service';
// import { ConfigsService } from '../../../../app/services/configs.service';
import { ToastService } from '../../../../app/services/toast.service';
import { UtilsService } from '../../../../app/services/utils.service';
import { SearchboxComponent } from '../../../../app/component/searchbox/searchbox.component';

/**
 * 待办审批页面
 */
@Component({
  selector: 'page-todo-opinion-mission',
  templateUrl: 'missionOpinion.html'
})
export class TodoMissionOpinionPage {

  // 审批意见选项
  private opinionList: Object[];
  // 选择的选项
  private selectOpinion: string = 'no';
  // 选择否时的textarea内容
  private comment: string = '';
  // 选择否时的附件列表
  private fileList: Object[] = [];
  // 选择是时的提交列表
  private opinionInputList: Object = {
    'list': []
  };
  // opinionInputList内的单项
  private opinionItem: Object = {
    sponsor: {
      id: '',
      name: ''
    },
    comment: '',
    fileList: []
  };
  // 转办人列表
  private sponsorList: Object = {};
  // 弹出框对象
  private confirmAlert: Alert;
  // 弹出框是否打开
  private alertOpen: boolean = false;
  // 国际化文字
  private transateContent: Object;
  // 设备类型
  deviceType: string = '';

  /**
   * 构造函数
   */
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    // private transfer: FileTransfer,
    private deviceService: DeviceService,
    // private userService: UserService,
    // private configsService: ConfigsService,
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
  }

  /**
   * 首次次进入页面
   */
  ionViewDidLoad(): void {
    this.deviceType = this.deviceService.getDeviceInfo().deviceType;
    this.setApprovalItems();
    this.opinionInputList['list'].push(this.opinionItem);
  }

  /**
   * 离开页面
   */
  ionViewWillLeave(): void {
    if (this.alertOpen) {
      this.confirmAlert.dismiss();
    }
    this.clearFile();
  }

  /**
   * 设置页面表单项
   */
  setApprovalItems(): void {
    this.sponsorList = this.navParams.get('approval')[0].sponsor;
    this.opinionList = [
      {value: 'yes', name: this.transateContent['YES']},
      {value: 'no', name: this.transateContent['NO']}
    ];
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
    if (this.selectOpinion === 'yes') {
      if (this.opinionInputList['list'].length > 0) {
        for (let i = 0; i < this.opinionInputList['list'].length; i++) {
          if (this.opinionInputList['list'][i]['sponsor'].id === '') {
            this.toastService.show(this.transateContent['VALI_REQUIRED']);
            return false;
          }
          if (this.opinionInputList['list'][i]['comment'] === '') {
            this.toastService.show(this.transateContent['VALI_REQUIRED']);
            return false;
          }
        }
      }
    } else if (this.selectOpinion === 'no') {
      if (this.comment === '') {
        this.toastService.show(this.transateContent['VALI_REQUIRED']);
        return false;
      }
    }
    return true;
  }

  /**
   * 提交审批意见请求
   */
  submitOpinionHttp(): void {
    if (this.submitValidate()) {
      let assigneeId = [];
      let taskContent = [];
      let assigneeFile = [];
      let submitUtl: string = this.navParams.get('submitUtl');
      let params: URLSearchParams = new URLSearchParams();
      for (let i = 0; i < this.opinionInputList['list'].length; i++) {
        assigneeId.push(this.opinionInputList['list'][i]['sponsor']['id']);
        taskContent.push(this.opinionInputList['list'][i]['comment']);
        if (this.opinionInputList['list'][i]['fileList'].length > 0) {
          assigneeFile.push(this.opinionInputList['list'][i]['fileList'].toString());
        }
      }
      params.append('passOther', this.selectOpinion);
      params.append('opinion', this.comment);
      // 选择否时的附件
      params.append('uploadFileId', this.fileList.toString());

      // 选择是时
      params.append('assigneeId', assigneeId.toString());
      params.append('taskContent', taskContent.toString());
      let assigneeFileStr = '';
      for (let i = 0; i < assigneeFile.length; i++) {
        assigneeFileStr += assigneeFile[i] + '%';
      }
      params.append('assigneeFile', assigneeFileStr.substr(0, assigneeFileStr.length - 2));

      params.append('pageId', this.navParams.get('pageId'));
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
    let multiple: boolean = false;
    let params: Object = { 'title': this.sponsorList['title'], 'multiple': multiple, 'searchUrl': this.sponsorList['url'] };
    let modal = this.modalCtrl.create(SearchboxComponent, params);
    modal.onDidDismiss(data => {
      if (data != null) {
        item['sponsor']['id'] = data.id;
        item['sponsor']['name'] = data.name;
      }
    });
    modal.present();
  }

  /**
   * 嵌套表格添加行
   */
  addListRow(): void {
    this.opinionItem = {
      sponsor: {
        id: '',
        name: ''
      },
      comment: '',
      fileList: []
    };
    this.opinionInputList['list'].push(this.opinionItem);
  }

  /**
   * 嵌套表格删除行
   */
  deleteListRow(iList: number): void {
    this.opinionInputList['list'].splice(iList, 1);
  }

  /**
   * 选择附件
   */
  fileChoose(item: Object): void {
  }

  /**
   * 上传文件
   */
  uploadFile(filePath: string, item: Object, file: Object): void {
  }

  /**
   * 删除文件
   */
  deleteFile(file: Object): void {
  }

  /**
   * 清空未提交的附件
   */
  clearFile(): void {
  }
}
