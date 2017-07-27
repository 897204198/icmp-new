import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ToastService } from '../../../app/services/toast.service';
import { Http, Response } from '@angular/http';
import { FileService } from '../../../app/services/file.service';

/**
 * 查询详细页面
 */
@Component({
  selector: 'page-query-detail',
  templateUrl: 'queryDetail.html',
})
export class QueryDetailPage {

  // 页面标题
  title: string = '';
  // 查询表单详细
  private queryDetail: Object[];
  // 意见列表
  private opinionList: Object[];
  // 附件列表
  private fileList: Object[];

  /**
   * 构造函数
   */
  constructor(public navParams: NavParams,
              private http: Http,
              private toastService: ToastService,
              private fileService: FileService) {}

  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    this.title = this.navParams.get('title');
    this.getQueryDetail();
  }

  /**
   * 取得待办详细
   */
  getQueryDetail(): void {
    this.queryDetail = [];
    this.fileList = [];
    this.opinionList = [];
    let params: URLSearchParams = new URLSearchParams();
    params.append('serviceName', this.navParams.get('serviceName'));
    params.append('defaultTab', this.navParams.get('defaultTab'));
    params.append('businessId', this.navParams.get('businessId'));
    this.http.post('/webController/getSystemMsgDetail', params).subscribe((res: Response) => {
      let data = res.json();
      for (let i = 0 ; i < data['forms'].length ; i++) {
        let form = data['forms'][i];
        if (form['type'] === 'filelist') {
          this.fileList.push(form);
        }
        this.queryDetail.push(form);
      }
      this.opinionList = data['opinion'];
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
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
    return fileName.substring(fileName.indexOf('.') + 1, fileName.length).toLowerCase();
  }
}
