import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { FileService } from '../../../app/services/file.service';
import { TodoOpinionPage } from '../todoOpinion/todoOpinion';
import { TranslateService } from '@ngx-translate/core';
import { ApplicationPage } from '../../application/application';
import { TodoMissionOpinionPage } from '../todoOpinion/mission/missionOpinion';
import { TodoWorkContactPage } from '../todoOpinion/workContact/workContact';

/**
 * 待办详情页面
 */
@Component({
  selector: 'page-todo-detail',
  templateUrl: 'todoDetail.html',
})
export class TodoDetailPage {

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
    params.append('taskId', this.navParams.get('taskId'));
    params.append('step', this.navParams.get('step'));
    params.append('processName', this.navParams.get('processName'));
    this.http.post('/webController/getSubSystemStandardIndex', params).subscribe((res: Response) => {
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

      for (let i = 0 ; i < this.todoDetail['forms'].length ; i++) {
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
      submitUtl = '/webController/dealProcess';
    }
    if (this.todoDetail['shenpi_type'] === 'forward') {
      let params: URLSearchParams = new URLSearchParams();
      params.append('taskId', this.navParams.get('taskId'));
      params.append('step', this.navParams.get('step'));
      params.append('processName', this.navParams.get('processName'));
      this.http.post(submitUtl, params).subscribe((res: Response) => {
        let data = res.json();
        if (data.result === '0') {
          this.toastService.show(this.transateContent['SUBMIT_SUCCESS']);
          this.navCtrl.pop();
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
    } else if (this.todoDetail['shenpi_type'] === 'shenpipage') {
      let params: Object = {
        approval: this.todoDetail['approval'],
        submitUtl: submitUtl,
        hideComment: this.todoDetail['shenpi_hide_comment'],
        commentDefault: this.todoDetail['shenpi_comment_default'],
        processName: this.navParams.get('processName'),
        taskId: this.navParams.get('taskId'),
        step: this.navParams.get('step'),
        pageId: this.todoDetail['pageId']
      };
      if (this.todoDetail['pageId'] === 'todo-opinion-mission') {
        this.navCtrl.push(TodoMissionOpinionPage, params);
      } else if (this.todoDetail['pageId'] === 'todo-work-contact') {
        this.navCtrl.push(TodoWorkContactPage, params);
      }  else {
        this.navCtrl.push(TodoOpinionPage, params);
      }
    } else if (this.todoDetail['shenpi_type'] === 'shenqingpage') {
      let params: Object = {
        assignee: this.navParams.get('assignee'),
        taskId: this.navParams.get('taskId'),
        step: this.navParams.get('step'),
        isChange: true
      };
      this.navCtrl.push(ApplicationPage, params);
    }
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
