import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-addFriend',
  templateUrl: 'addFriend.html',
})
export class AddFriendPage {

  private searchInput: string;
  private userList: Array<Object> = [];
  // 国际化文字
  private transateContent: Object;
  /**
   * 构造函数
   */
  constructor(private toastService: ToastService,
    private translate: TranslateService,
    private http: Http) {
      this.translate.get(['ADD_SUCCESS']).subscribe((res: Object) => {
        this.transateContent = res;
      });
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {

  }

  onInput() {

  }

  onCancel() {

  }

  searchUser() {
    let params: URLSearchParams = new URLSearchParams();
    params.append('username', this.searchInput);
    this.http.post('/im/searchUser', params).subscribe((res: Response) => {
      let data = res.json().data;
      if (res.json().result === '0') {
        this.userList = data;
      } else {
        this.toastService.show(res.json().errMsg);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  addFriend(user: Object) {
    let params: URLSearchParams = new URLSearchParams();
    params.append('username', user['toChatUsername']);
    this.http.post('/im/addFriend', params).subscribe((res: Response) => {
      if (res.json().result === '0') {
        this.toastService.show(this.transateContent['ADD_SUCCESS']);
      } else {
        this.toastService.show(res.json().errMsg);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

}
