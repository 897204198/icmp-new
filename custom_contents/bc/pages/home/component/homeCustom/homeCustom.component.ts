import { Component, Input ,Inject } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { HomeMenusManagerPage } from '../../homeMenusManager/homeMenusManager';
import { MenuFolderComponent } from '../../../../app/component/menuFolder/menuFolder.component';
import { RoutersService } from '../../../../app/services/routers.service';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { PushService } from '../../../../app/services/push.service';
import { ToastService } from '../../../../app/services/toast.service';
import { ICMP_CONSTANT, IcmpConstant } from '../../../../app/constants/icmp.constant';
import { AppVersionUpdateService } from '../../../../app/services/appVersionUpdate.service';
@Component({
  selector: 'icmp-home-custom',
  templateUrl: 'homeCustom.component.html'
})
export class HomeCustomComponent {

  // 用户配置的全部应用
  @Input() menus: Object;
  // 应用所占的宽度
  private menuWidth: string;
  private transateContent: Object;

  /**
   * 构造函数
   */
  constructor(public navCtrl: NavController,
              private pushService: PushService,
              private modalCtrl: ModalController,
              public alertCtrl: AlertController,
              private http: Http,
              private toastService: ToastService,
              private translate: TranslateService,
              @Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
              private routersService: RoutersService,
              private appVersionUpdateService: AppVersionUpdateService) {
              let translateKeys: string[] = ['PLEASE_SETTING_PASSWORD', 'DEVELOPER_MODE','look_SUCCESS', 'PLEASE_ENTER_PASSWORD', 'SETTING_SUCCESS', 'CANCEL', 'CONFIRM', 'PASSWORD_WRONG', 'PLEASE_ENTER_ACCOUNT', 'ERROR_ACCOUNT_PASSWORD', 'ERROR_DEVICE', 'PLEASE_LOGIN'];
              this.translate.get(translateKeys).subscribe((res: Object) => {
              this.transateContent = res;
            });
    if (screen.width <= 375) {
      this.menuWidth = 25 + '%';
    } else if (screen.width > 375 && screen.width <= 590) {
      this.menuWidth = 20 + '%';
    } else {
      this.menuWidth = 16.6 + '%';
    }
  }


  /**
   * 打开应用第一步
   * 1.如果是文件夹就先展开文件夹
   * 2.如果是应用就进行第二步
   */
  loginPasswordTwo(loginName: string, useId: string, passwordTwo: string, menu): void{
    let params: URLSearchParams = new URLSearchParams();
    params.append('useId', useId);
    params.append('loginName', loginName);
    params.append('passwordTwo', passwordTwo);
    this.http.post('/webController/checkSalaryInquiryLogin', params).subscribe((res: Response) => {
      let data = res.json();
      console.log(data)
        this.routersService.pageForward(this.navCtrl, menu);
    })
  }
  loginPasswordTwo2(loginName: string, passwordTwo2: string, menu): void{
    let params: URLSearchParams = new URLSearchParams();
    params.append('loginName', loginName);
    params.append('passwordTwoa2', passwordTwo2);
    
    this.http.post('/webController/checkSalaryInquiryPassword', params).subscribe((res: Response) => {
      let data = res.json();
        console.log(data)
        if (passwordTwo2 === data.password) {
          this.routersService.pageForward(this.navCtrl, menu);
        } else {
          if (passwordTwo2 == null || passwordTwo2 === '0') {
            this.toastService.show(this.transateContent['PLEASE_ENTER_PASSWORD']);
          } else {
            this.toastService.show(this.transateContent['PASSWORD_WRONG']);
          }
          return false;
        }
        //this.routersService.pageForward(this.navCtrl, menu); 
    })
  }
  openApp(menu: any): void {
    if (menu['appType'] === 'folder') {
      let modal = this.modalCtrl.create(MenuFolderComponent, {name: menu});
      modal.onDidDismiss(data => {
        if (data) {
          this.routersService.pageForward(this.navCtrl, data);
        }
      });
      modal.present();
    } else {
      //this.routersService.pageForward(this.navCtrl, menu) 设置密码页;
      if (menu.hadpass === 'true' && menu.passwordOne === '1') {
        // console.log(menu)
        this.toastService.show(this.transateContent['look_SUCCESS'])
        let useId: string = menu.appid;
        let prompt = this.alertCtrl.create({
          title: this.transateContent['PLEASE_SETTING_PASSWORD'],
          inputs: [
            {
              name: 'passwordSecond',
              placeholder: this.transateContent['PLEASE_SETTING_PASSWORD'],
              type:'password'
            },
          ],
          buttons: [
            {
              text: this.transateContent['CANCEL'],
            },
            {
              text: this.transateContent['CONFIRM'],
              handler: data => {
                let passwordTwo: string = data.passwordSecond;
                let loginName: string = data.loginName;
                console.log(passwordTwo)
                if (passwordTwo === '') {
                  this.toastService.show(this.transateContent['PLEASE_ENTER_PASSWORD']);
                } else {
                  this.loginPasswordTwo(loginName, useId, passwordTwo, menu)
                }
              }
            }
          ]
        });
          prompt.present();
      } else if (menu.hadpass === 'true' && menu.passwordOne === '1' ){
        let prompt = this.alertCtrl.create({
          title: this.transateContent['PLEASE_ENTER_PASSWORD'],
          inputs: [
            {
              name: 'passwordSecond2',
              placeholder: this.transateContent['PLEASE_ENTER_PASSWORD'],
              type:'password'
            },
          ],
          buttons: [
            {
              text: this.transateContent['CANCEL'],
            },
            {
              text: this.transateContent['CONFIRM'],
              handler: data => {
                   console.log(data.passwordSecond2)
                   let passwordTwo2: string = data.passwordSecond2;
                   let loginName: string = data.loginName;
                   this.loginPasswordTwo2(loginName, passwordTwo2, menu)
              }
            }
          ]
        });
          prompt.present();
      } else {
        this.routersService.pageForward(this.navCtrl, menu);
      }
    }
  }

  /**
   * 查看全部应用
   * 管理应用
   */
  goHomeMenusManager(): void {
    this.navCtrl.push(HomeMenusManagerPage);
  }
}
