import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { ResetPasswordPage } from '../resetPassword/resetPassword';

/**
 * 安全与隐私设置
 */
@Component({
  selector: 'page-safe-and-privacy',
  templateUrl: 'safeAndPrivacy.html'
})
export class SafeAndPrivacyPage {
  // 重置密码页
  resetPasswordPage: any;
  // 安全级别
  data: Object[];
  // 选择的级别
  relationship: string;

  /**
   * 构造函数
   */
  constructor(
    private toastService: ToastService,
    private http: Http
  ) {
    this.resetPasswordPage = ResetPasswordPage;
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    this.getPowerLevel();
    this.getMyselfLevel();
  }
  /* 
  * 获取当前用户隐私级别状态
  */
 getPowerLevel(): void {
   const params = {
    catalog: 'PERSONALINFO'
   };
  this.http.get('/sys/datadic', { params: params }).subscribe((res) => {
    this.data = res.json()['data'];
  }, (res: Response) => {
    this.toastService.show(res.text());
  });
 }
  // radio 点击事件
  changeRadio(option: Object) {
    this.http.get('/hr/employee/current').subscribe((res) => {
      const employeeId = res.json()['id'];
      this.http.get('/hr/employee/' + employeeId).subscribe((res2) => {
        const params = {
          ...res2.json(),
          personalInfo: option['code']
        };
        this.http.put('/hr/employee/' + employeeId, params).subscribe((res3) => {
          this.toastService.show('修改隐私状态成功');
          }, (res3: Response) => {
            this.toastService.show(res3.text());
          });
        }, (res2: Response) => {
          this.toastService.show(res2.text());
        });
      }, (res: Response) => {
        this.toastService.show(res.text());
      });
  }
  // 获取当前隐私状态
  getMyselfLevel(){
    this.http.get('/hr/employee/current').subscribe((res) => {
      this.relationship = res.json()['data']['personalInfo'];
    });
  }
}
