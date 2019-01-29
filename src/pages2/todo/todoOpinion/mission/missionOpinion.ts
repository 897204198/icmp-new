import { Component } from '@angular/core';
import { NavParams, NavController, AlertController, Alert, ModalController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { DeviceService } from '../../../../app/services/device.service';
import { UserService } from '../../../../app/services/user.service';
import { ConfigsService } from '../../../../app/services/configs.service';
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
    private transfer: FileTransfer,
    private deviceService: DeviceService,
    private userService: UserService,
    private configsService: ConfigsService,
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
    let initItem: Object = {
      sponsor: {
        id: '',
        name: ''
      },
      comment: '',
      fileList: []
    };
    this.opinionInputList['list'].push(initItem);
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
    this.sponsorList = this.navParams.get('approval')[0].sponsor;
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
      const inputSubList = this.opinionInputList['list'];
      let assigneeId = [];
      let taskContent = [];
      let assigneeFile = [];
      let submitUtl: string = this.navParams.get('submitUtl');
      let params: URLSearchParams = new URLSearchParams();

      // 选择否时的附件
      if (this.selectOpinion === 'no') {
        let fileArray = [];
        for (let i = 0; i < this.fileList.length; i++) {
          const fileId = this.fileList[i]['id'];
          fileArray.push(fileId);
        }
        params.append('uploadFileId', fileArray.toString());
      } else {
        for (let i = 0; i < inputSubList.length; i++) {
          assigneeId.push(inputSubList[i]['sponsor']['id']);
          taskContent.push(inputSubList[i]['comment']);
          if (inputSubList[i]['fileList'].length > 0) {
            let fileArray = [];
            for (let j = 0; j < inputSubList[i]['fileList'].length; j++) {
              const fileId = inputSubList[i]['fileList'][j]['id'];
              fileArray.push(fileId);
            }
            assigneeFile.push(fileArray.toString());
          }
        }
      }

      params.append('passOther', this.selectOpinion);
      params.append('opinion', this.comment);

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
    let initItem: Object = {
      sponsor: {
        id: '',
        name: ''
      },
      comment: '',
      fileList: []
    };
    this.opinionInputList['list'].push(initItem);
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
  fileChoose(iList: number): void {
    let item: Object = this.opinionInputList[iList];
    this.fileChooser.open().then((uri) => {
      this.filePath.resolveNativePath(uri).then((filePath) => {
        let file: Object = {
          name: filePath.substr(filePath.lastIndexOf('/') + 1)
        };
        this.uploadFile(filePath, item, file, iList);
      }, () => {
        this.toastService.show(this.transateContent['FILE_UPLOAD_ERROR']);
      });
    });
  }

  /**
   * 上传文件
   */
  uploadFile(filePath: string, item: Object, file: Object, iList: number): void {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: filePath.substr(filePath.lastIndexOf('/') + 1),
      mimeType: 'multipart/form-data'
    };
    let userInfo = this.userService.getUserInfo();
    fileTransfer.upload(filePath, this.configsService.getBaseUrl() + '/webController/uploadFile?loginName=' + userInfo.loginName, options).then((data) => {
      file['id'] = data.response;
      if (this.selectOpinion === 'no') {
        this.fileList.push(file);
      } else {
        this.opinionInputList['list'][iList]['fileList'].push(file);
      }
    }, () => {
      this.toastService.show(this.transateContent['FILE_GET_ERROR']);
    });
  }

  /**
   * 删除文件
   */
  deleteFile(file: Object, iList: number): void {
    let item: Object = this.opinionInputList['list'][iList];
    if (file['id'] != null && file['id'] !== '') {
      let params: URLSearchParams = new URLSearchParams();
      params.append('fileId', file['id']);
      this.http.post('/webController/deleteFile', params).subscribe((res: Response) => { });
      if (this.selectOpinion === 'no') {
        for (let i = 0; i < this.fileList.length; i++) {
          if (this.fileList[i]['id'] === file['id']) {
            this.fileList.splice(i, 1);
            break;
          }
        }
      } else {
        for (let i = 0; i < item['fileList'].length; i++) {
          if (item['fileList'][i]['id'] === file['id']) {
            this.opinionInputList['list'][iList]['fileList'].splice(i, 1);
            break;
          }
        }
      }
    }
  }

}
