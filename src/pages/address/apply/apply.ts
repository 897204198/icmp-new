import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-apply',
  templateUrl: 'apply.html',
})
export class ApplyPage {


  private applyList: Array<Object> = [];
  // 国际化文字
  private transateContent: Object;
  /**
   * 构造函数
   */
  constructor(private toastService: ToastService,
    private translate: TranslateService,
    private http: Http) {
      this.translate.get(['AGREED', 'REFUSED', 'DELETED']).subscribe((res: Object) => {
        this.transateContent = res;
      });
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    this.fetchApplications();
  }

  /**
   * 获取所有申请通知
   */
  fetchApplications(): void {
    let params: URLSearchParams = new URLSearchParams();
    this.http.get('/im/notices', {params: params}).subscribe((res: Response) => {
      this.applyList = res.json();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 同意申请
   */
  agreeApply(item: Object) {
    this.http.put('/im/notices/' + item['noticeId'], {type: '1'}).subscribe(() => {
      this.toastService.show(this.transateContent['AGREED']);
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 拒绝申请
   */
  refuseApply(item: Object) {
    this.http.put('/im/notices/' + item['noticeId'], {type: '2'}).subscribe(() => {
      this.toastService.show(this.transateContent['REFUSED']);
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 删除申请
   */
  deleteApply(item: Object) {
    let index = this.applyList.indexOf(item);
    this.applyList.splice(index, 1);
    this.http.delete('/im/notices/' + item['noticeId']).subscribe(() => {
      this.toastService.show(this.transateContent['DELETED']);
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

}
