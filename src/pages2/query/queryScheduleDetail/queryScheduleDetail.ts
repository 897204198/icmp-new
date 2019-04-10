import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ToastService } from '../../../app/services/toast.service';
import { Http, Response } from '@angular/http';

/**
 * 日程查询详细页面
 */
@Component({
  selector: 'page-query-schedule-detail',
  templateUrl: 'queryScheduleDetail.html',
})
export class QueryScheduleDetailPage {

  // 消费列表
  private opinionList: Object[] = [];
  // 消费列表keys
  private keysList: string[] = [];

  /**
   * 构造函数
   */
  constructor(public navParams: NavParams, private http: Http, private toastService: ToastService) {}

  /**
   * 每次进入页面
   */
  ionViewDidEnter(): void {
    this.getList();
  }

  /**
   * 取得待办详细
   */
  getList(): void {
    let params: URLSearchParams = new URLSearchParams();
    params.append('serviceName', this.navParams.get('serviceName'));
    params.append('date', this.navParams.get('date'));
    this.http.post('/webController/getScheduleDetail', params).subscribe((res: Response) => {
      let data = res.json();
      const { opinion } = data;
      for (let item of opinion) {
        this.keysList = Object.keys(item);
        break;
      }
      this.opinionList = opinion;
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }
}
