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
  private time: any = 60;
  // 国际化文字
  private transateContent: Object;
  private goPage: Boolean = true;
  private isActive: Boolean = true;
  private reSend: Boolean = false;
  private isTime: Boolean = false;
  private getCode: Boolean = true;
  private disable: Boolean = true;
  private showPassword: Boolean = true;
  private changIconColor: Boolean = false;
  private canClick: Boolean = true;
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
    this.translate.get(['CODE_LENGTH_SIX', 'SETTING_SUCCESS', 'FINDFASS_PROMPT', 'ERROR_PROMPT', 'TIPS_EMPTY_EMAIL_USERNAME']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  submit(): void {
    // this.toastService.show('您输入的验证码有误，请核对后重试');
    // this.toastService.show('验证码已超时，请重新获取');
    const req = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
    let params: Object = {
      'username': this.username.trim(),
      'validCode': this.email.trim(),
      'password': this.newPassword
    };
    if (this.email.length !== 6) {
      this.toastService.show(this.transateContent['CODE_LENGTH_SIX']);
      return;
    }
    if (!req.test(this.newPassword)) {
      this.toastService.show(this.transateContent['FINDFASS_PROMPT']);
      return;
    };
    if (this.username === '' || this.email === '') {
      this.toastService.show(this.transateContent['TIPS_EMPTY_EMAIL_USERNAME']);
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
    if (!this.canClick) {
      return;
    }
    if (this.username.length < 11) {
      return;
    }
    if (!isPhone.test(this.username)) {
      this.toastService.show('电话格式错误');
      return;
    };
    this.canClick = false;
    this.http.get(`/auth/users/${this.username}/validCode`).subscribe((res: Response) => {
      this.toastService.show(res['_body']);
      this.getCode = false;
      this.reSend = false;
      this.isTime = true;
      clearInterval(this.timer);
      const timeInit: number = new Date().getTime();
      this.timer = setInterval(() => {
        const num = ((new Date().getTime() - timeInit) / 1000).toString();
        // tslint:disable-next-line:radix
        this.time = 60 - parseInt(num);
        if (this.time <= 0) {
          clearInterval(this.timer);
          this.isTime = false;
          this.reSend = true;
          this.canClick = true;
        };
      }, 1000);
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  ionViewDidLeave(): void {
    clearInterval(this.timer);
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
    this.newPassword = document.querySelector('.pas').children[0]['value'];
    if (password.length > 0) {
      this.changIconColor = true;
    } else {
      this.changIconColor = false;
    };
    if (password.length > 5) {
      this.disable = false;
    } else {
      this.disable = true;
    }
    // if (password.length > 15) {
    //   this.newPassword = password.substring(0, 16)
    // }
  }
  goLogIn(): void {
    this.navCtrl.push(LoginPage);
  }
}
