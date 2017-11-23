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
    this.http.get('/im/users', {params: {'searchText': this.searchInput}}).subscribe((res: Response) => {
      this.userList = res.json();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  addFriend(user: Object) {
    let params: URLSearchParams = new URLSearchParams();
    params.append('userId', user['userId']);
    this.http.post('/im/contacts', params).subscribe((res: Response) => {
      this.toastService.show(this.transateContent['ADD_SUCCESS']);
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

}
