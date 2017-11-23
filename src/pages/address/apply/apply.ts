import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'page-apply',
  templateUrl: 'apply.html',
})
export class ApplyPage {


  private applyList: Array<Object> = [];

  /**
   * 构造函数
   */
  constructor(private toastService: ToastService,
    private http: Http) {

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
      this.toastService.show('已同意');
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 拒绝申请
   */
  refuseApply(item: Object) {
    this.http.put('/im/notices/' + item['noticeId'], {type: '2'}).subscribe(() => {
      this.toastService.show('已拒绝');
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 删除申请
   */
  deleteApply(item: Object) {
    this.removeArrayValue(this.applyList, item);
    this.http.delete('/im/notices/' + item['noticeId']).subscribe(() => {
      this.toastService.show('已删除');
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 删除数组中某元素
   */
  removeArrayValue(array: Array<Object>, item: Object) {
    for (let i = 0; i < array.length; i++) {
      if (array[i] === item) {
        array.splice(i, 1);
        break;
      }
    }
  }
}
