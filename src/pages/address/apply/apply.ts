import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'page-apply',
  templateUrl: 'apply.html',
})
export class ApplyPage {


  private applyList: Array<Object> = [];

  /**
   * 构造函数
   */
  constructor(private http: Http) {

  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    this.applyList = [{
      'nickName': '测试用户',
      'type': 'agree',
      'username': 'a3'
    }];
  }

  apply(group: Object) {
    let params = group;
    (<any>window).huanxin.apply(params, (retData) => {

    }, (retData) => { });
  }

}
