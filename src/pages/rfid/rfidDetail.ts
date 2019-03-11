import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../app/services/toast.service';
import { FileService } from '../../app/services/file.service';
import { TranslateService } from '@ngx-translate/core';
import { RfidOpinionPage } from './rfidOpinion';

/**
 * 待办详情页面
 */
@Component({
  selector: 'page-rfidDetail',
  templateUrl: 'rfidDetail.html',
})
export class RfidDetailPage {

  // 是否显示审批按钮
  private hasApprovalBtn: boolean = false;
  // 审批按钮名称
  private btnText: string = '';
  // 提示文字
  private promptInfo: string = '';
  // 待办详细
  private todoDetail: Object = {};
  // 附件列表
  private fileList: Object[];
  // 国际化文字
  private transateContent: Object;

  /**
   * 构造函数
   */
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private http: Http,
    private toastService: ToastService,
    private fileService: FileService,
    private translate: TranslateService) {
    let translateKeys: string[] = ['SUBMIT_SUCCESS', 'SUBMIT_ERROR', 'TODO_CANNOT_USE', 'READ', 'APPROVAL'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    this.getTodoDetail();
  }

  /**
   * 取得待办详细
   */
  getTodoDetail(): void {
    this.todoDetail = {};
    this.fileList = [];
    let params: URLSearchParams = new URLSearchParams();
    params.append('id', this.navParams.get('id'));
    params.append('assetsNum', this.navParams.get('assetsNum'));
    params.append('serviceName', this.navParams.get('serviceName'));
    this.http.post('/webController/getAssetsInventoryRecordIndex', params).subscribe((res: Response) => {
      this.todoDetail = res.json();
      this.btnText = this.todoDetail['shenpi_btn_text'];
      if (this.btnText == null || this.btnText === '') {
        if (this.todoDetail['shenpi_type'] === 'forward') {
          this.btnText = this.transateContent['READ'];
        } else {
          this.btnText = this.transateContent['APPROVAL'];
        }
      }

      if (this.todoDetail['shenpi_type'] === 'viewonly') {
        this.hasApprovalBtn = false;
        this.promptInfo = this.transateContent['TODO_CANNOT_USE'];
      } else {
        this.promptInfo = this.todoDetail['prompt_info'];
        this.hasApprovalBtn = true;
      }

      for (let i = 0; i < this.todoDetail['forms'].length; i++) {
        let form = this.todoDetail['forms'][i];
        if (form['type'] === 'filelist' && form['values'] != null && form['values'].length > 0) {
          this.fileList.push(this.todoDetail['forms'][i]);
        }
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 审批办理
   */
  approval(): void {
    let submitUtl: string = this.todoDetail['submit_path'];
    if (submitUtl == null || submitUtl === '') {
      submitUtl = '/webController/getInventoryStatus';
    }
    let params: Object = {
      id: this.navParams.get('id'),
      assetsNum: this.navParams.get('assetsNum'),
      approval: this.todoDetail['approval'],
      submitUtl: submitUtl,
      hideComment: this.todoDetail['shenpi_hide_comment'],
      commentDefault: this.todoDetail['shenpi_comment_default']
    };
    this.navCtrl.push(RfidOpinionPage, params);
  }

  /**
   * 下载附件
   */
  downloadFile(file: Object): void {
    this.fileService.downloadFile(file['id'], file['name']);
  }

  /**
   * 取得文件类型
   */
  getFileType(fileName: string): string {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length).toLowerCase();
  }
}
