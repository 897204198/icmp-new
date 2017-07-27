import { Component} from '@angular/core';
import { ToastService } from '../../../app/services/toast.service';
import { Http, Response } from '@angular/http';

/**
 * 个人资料
 */
@Component({
  selector: 'page-user-info',
  templateUrl: 'userInfo.html'
})
export class UserInfoPage {

  // 用户信息
  private userInfo: Object;

  /**
   * 构造函数
   */
  constructor(private http: Http,
              private toastService: ToastService) {}

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    this.getUserInfo();
  }

  /**
   * 取得用户信息
   */
  getUserInfo(): void {
    this.http.post('/webController/getUserInfo', null).subscribe((res: Response) => {
      this.userInfo = res.json();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }
}
