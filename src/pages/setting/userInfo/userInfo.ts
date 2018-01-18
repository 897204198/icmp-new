import { Component } from '@angular/core';
import { ToastService } from '../../../app/services/toast.service';
import { Http, Response } from '@angular/http';
import { UserInfoState, UserService } from '../../../app/services/user.service';

/**
 * 个人资料
 */
@Component({
  selector: 'page-user-info',
  templateUrl: 'userInfo.html'
})
export class UserInfoPage {

  // 用户信息
  private userInfo: Object = {};
  private localUserInfo: UserInfoState;

  /**
   * 构造函数
   */
  constructor(private http: Http,
    private toastService: ToastService,
    private userService: UserService) { }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    this.getUserInfoFromLocal();
    this.getUserInfoFromNet();
  }

  /**
    * 取得用户信息
    */
  getUserInfoFromLocal(): void {
    this.localUserInfo = this.userService.getUserInfo();
    this.userInfo['name'] = this.localUserInfo.userName;
    this.userInfo['phone'] = this.localUserInfo.phone;
    this.userInfo['email'] = this.localUserInfo.email;
    this.userInfo['ascription'] = this.localUserInfo.outter;
    this.userInfo['jobNum'] = this.localUserInfo.jobNumber;
    this.userInfo['sexName'] = this.localUserInfo.sex;
  }

  /**
   * 取得用户信息
   */
  getUserInfoFromNet(): void {
    let params = {
      userId: this.localUserInfo.userId
    };
    this.http.get('/user/base-info', { params: params }).subscribe((res: Response) => {
      let data = res.json();
      this.userInfo['deptName'] = data.deptName;
      this.userInfo['jobName'] = data.jobName;
    }, (err: Response) => {
      this.toastService.show(err.text());
    });
  }
}
