import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserInfoState, initUserInfo, UserService } from '../../app/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../app/services/toast.service';
import { Http, Response } from '@angular/http';

@Component({
  selector: 'page-mac-address',
  templateUrl: 'macAddress.html'
})
export class MacAddressPage {

  // 国际化文字
  private transateContent: Object;
  // segment 选项卡
  private segmentPage = '';
  // 用户信息
  private userInfo: UserInfoState = initUserInfo;
  // 提交信息
  private submitInfo: Object = {};
  // 绑定状态列表
  private bindArray: Array<Object> = [];
  /**
   * 构造函数
   */
  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private translate: TranslateService,
    private toastService: ToastService,
    private http: Http) {

    this.translate.get(['REQUIRE_NOT', 'SUBMIT_SUCCESS']).subscribe((res: Object) => {
      this.transateContent = res;
    });

    this.segmentPage = 'apply';
    this.userInfo = this.userService.getUserInfo();

    this.submitInfo['appliTypeCode'] = '0';
    this.submitInfo['applicant'] = this.userInfo.userName;
    this.submitInfo['username'] = '';
    this.submitInfo['name'] = '';
    this.submitInfo['macAddress'] = '';

  }

  /**
   * 点击 segment
   */
  segmentChanged() {
    if (this.segmentPage === 'state') {
      this.getBindInfo();
    }
  }

  /**
   * 获取绑定信息
   */
  getBindInfo() {
    this.http.get('/mac/app').subscribe((res: Response) => {
      this.bindArray = res.json();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 构造函数
   */
  submit() {
    if (this.submitInfo['username'].length === 0 ||
      this.submitInfo['macAddress'].length === 0 ||
      this.submitInfo['name'].length === 0) {
      this.toastService.show(this.transateContent['REQUIRE_NOT']);
    } else {
      this.http.post('/mac/app', this.submitInfo).subscribe((res: Response) => {
        this.toastService.show(this.transateContent['SUBMIT_SUCCESS']);
        this.navCtrl.pop();
      }, (res: Response) => {
        this.toastService.show(res.text());
      });
    }
  }

  /**
   * 修改绑定状态
   */
  changeBind(info: Object) {
    let params: Object = {
      macAddress: info['macAddress'],
      appliTypeCode: info['actualTypeCode'] === '1' ? '0' : '1'
    };
    this.http.put('/mac/app', params).subscribe((res: Response) => {
      this.toastService.show(this.transateContent['SUBMIT_SUCCESS']);
      this.getBindInfo();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

}
