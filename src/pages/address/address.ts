import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ConfigsService } from '../../app/services/configs.service';

@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {

  private searchInput: string;

  private contactInfos: Array<Object> = [];

  /**
   * 构造函数
   */
  constructor(private http: Http,
    private configsService: ConfigsService) {

  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {

  }

  ionViewDidEnter(): void {
    this.loadUserContactInfos();
  }

  loadUserContactInfos() {
    // 获取列表
    let emptyParams: URLSearchParams = new URLSearchParams();
    this.http.post(this.configsService.getIMUrl() + '/api/contact/getAllContacts', emptyParams).subscribe((data: Response) => {
      let dataArray: Array<Object> = data.json().data.rows;
      let tempArray: Array<string> = [];
      for (let i = 0; i < dataArray.length; i++) {
        tempArray.push(dataArray[i]['userid']);
      }
      // 获取详细信息
      let params: URLSearchParams = new URLSearchParams();
      params.append('extendIds', JSON.stringify(tempArray));
      this.http.post('/webController/im/fetchContactInfos', params).subscribe((res: Response) => {
        this.contactInfos = res.json().rows;
        this.saveContacts(this.contactInfos);
      }, (err2: Response) => {

      });
    }, (err1: Response) => {
    });
  }

  getUserDetailInfo(userid: string) {

  }

  onInput() {
    console.log(this.searchInput);
  }

  onCancel() {

  }

  saveContacts(info: Array<Object>) {
    let params = {
      'systemId': 'saveContacts',
      'data': info
    };
    (<any>window).cmbpay.payment(params, (retData) => {

    }, (retData) => {
      console.log('retData:', retData);
    });
  }

  applyAndNotification() {
    let params = {
      'systemId': 'apply'
    };
    (<any>window).cmbpay.payment(params, (retData) => {

    }, (retData) => {
      console.log('retData:', retData);
    });
  }

  addFriend() {
    let params = {
      'systemId': 'addFriend'
    };
    (<any>window).cmbpay.payment(params, (retData) => {

    }, (retData) => {
      console.log('retData:', retData);
    });
  }

  myGroup() {
    let params = {
      'systemId': 'group'
    };
    (<any>window).cmbpay.payment(params, (retData) => {

    }, (retData) => {
      console.log('retData:', retData);
    });
  }

  chatToUser(item: Object) {
    let params = {
      'systemId': 'userProfile',
      'data': item
    };
    (<any>window).cmbpay.payment(params, (retData) => {

    }, (retData) => {
      console.log('retData:', retData);
    });
  }

}
