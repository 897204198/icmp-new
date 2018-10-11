import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController, AlertController  } from 'ionic-angular';
import { ToastService } from '../../../app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfigsService } from '../../../app/services/configs.service';
import { LoginPage } from '../login';

/**
 * 开发者设置页面
 */
@Component({
  selector: 'page-setPassword',
  templateUrl: 'setPassword.html'
})
export class SetPasswordPage {
  // 账号
  private username: string = '';
  private newPassword: string = '';
  // 推送服务器地址
  private email: string = '';
  private time: number = 60;
  // 国际化文字
  private transateContent: Object;
  private goPage: Boolean = true;
  private isActive: Boolean = true;
  private reSend: Boolean = false;
  private isTime: Boolean = false;
  private getCode: Boolean = true;
  private showPassword: Boolean = true;
  private changIconColor: Boolean = false;
  timer = null;
  /**
   * 构造函数
   */
  constructor(
              private http: Http,
              public alertCtrl: AlertController,
              public navCtrl: NavController,
              private toastService: ToastService,
              private configsService: ConfigsService,
              private translate: TranslateService) {
    this.translate.get(['SETTING_SUCCESS', 'FINDFASS_PROMPT', 'ERROR_PROMPT']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  submit(): void {
    // this.toastService.show('您输入的验证码有误，请核对后重试');
    // this.toastService.show('验证码已超时，请重新获取');
    const req = /^\S{6,20}$/;
    let params: Object = {
      'username': this.username.trim(),
      'validCode': this.email.trim(),
      'password': this.newPassword
    };
    if (this.username === '' || this.email === '' || !req.test(this.newPassword)) {
      this.toastService.show(this.transateContent['FINDFASS_PROMPT']);
      return;
    };
    this.http.put('/auth/users/password/reset', params).subscribe((res: Response) => {
      if (res.status === 200) {
        this.goPage = false;
      } else {
        this.toastService.show(res.text());
      };
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }
  getVerificationCode(): void {
    const isPhone = /^([0-9]{3,4})?[0-9]{7,8}$/;
    if (this.username.length < 11) {
      return;
    }
    if (!isPhone.test(this.username)) {
      this.toastService.show('电话格式错误');
      return;
    };
    this.http.get(`/auth/users/${this.username}/validCode`).subscribe((res: Response) => {
      this.toastService.show(res['_body']);
      // this.toastService.show(`已将验证码发至您的邮箱 ${arr.join('@')}`);
      // this.toastService.show('请联系HR将邮箱填写到你的个人信息中');
      // this.toastService.show('账户不存在，请核对后重试');
      this.getCode = false;
      this.reSend = false;
      this.isTime = true;
      clearInterval(this.newMethod());
      this.timer = setInterval(() => {
        this.time--;
        if (this.time <= 0) {
          clearInterval(this.newMethod_1());
          this.isTime = false;
          this.reSend = true;
        };
      }, 1000);
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }
  private newMethod_1(): NodeJS.Timer {
    return this.timer;
  }

  private newMethod(): NodeJS.Timer {
    return this.timer;
  }

  ionViewDidLeave(): void {
    const newLocal = this.timer;
    clearInterval(newLocal);
  }
  sendVerificationCode(): void {
    this.isTime = true;
    this.reSend = false;
    this.time = 60;
    this.getVerificationCode();
  }
  seePassword(): void {
    if (this.newPassword.length === 0) {
      return;
    };
    if (this.showPassword) {
      this.showPassword = false;
    } else {
      this.showPassword = true;
    };
  }
  changePhone(username): void {
    if (username.length > 10) {
      this.isActive = false;
    } else {
      this.isActive = true;
    };
  }
  changePassword(password): void {
    if (password.length > 0) {
      this.changIconColor = true;
    } else {
      this.changIconColor = false;
    };
  }
  goLogIn(): void {
    this.navCtrl.push(LoginPage);
  }
}
