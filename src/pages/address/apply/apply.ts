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
    this.http.post('/im/fetchApplications', params).subscribe((res: Response) => {
      let data = res.json().data;
      if (res.json().result === '0') {
        this.applyList = data;
      } else {
        this.toastService.show(res.json().errMsg);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 同意申请
   */
  agreeApply(item: Object) {
    let params: URLSearchParams = new URLSearchParams();
    params.append('username', item['toChatUsername']);
    params.append('type', 'agree');
    this.applyNetRequest(params);
  }

  /**
   * 拒绝申请
   */
  refuseApply(item: Object) {
    let params: URLSearchParams = new URLSearchParams();
    params.append('username', item['toChatUsername']);
    params.append('type', 'refuse');
    this.applyNetRequest(params);
  }

  /**
   * 删除申请
   */
  deleteApply(item: Object) {
    this.removeArrayValue(this.applyList, item);
    let params: URLSearchParams = new URLSearchParams();
    params.append('username', item['toChatUsername']);
    params.append('type', 'delete');
    this.applyNetRequest(params);
  }

  applyNetRequest(params: URLSearchParams) {
    this.http.post('/im/userApply', params).subscribe((res: Response) => {
      if (res.json().result === '0') {
        this.toastService.show(res.json().successMsg);
      } else {
        this.toastService.show(res.json().errMsg);
      }
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
