import { Component, Input , Inject } from '@angular/core';
import { NavController, ModalController, AlertController, NavParams } from 'ionic-angular';
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
              private modalCtrl: ModalController,
              private pushService: PushService,
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private http: Http,
              private toastService: ToastService,
              private translate: TranslateService,
              @Inject(ICMP_CONSTANT) private icmpConstant: IcmpConstant,
              private appVersionUpdateService: AppVersionUpdateService,
              private routersService: RoutersService) {
    let translateKeys: string[] = ['NO_PASSWORD_INFO', 'NO_POWER_INFO', 'PROMPT_INFO', 'PLEASE_POWER', 'PLEASE_CHECK_PASSWORD_PC_END', 'PLEASE_SET_PASSWORD', 'look_SUCCESS', 'PLEASE_ENTER_PASSWORD', 'SETTING_SUCCESS', 'CANCEL', 'CONFIRM', 'PASSWORD_WRONG', 'PLEASE_ENTER_ACCOUNT', 'ERROR_ACCOUNT_PASSWORD', 'ERROR_DEVICE', 'PLEASE_LOGIN'];
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
      this.routersService.isHasPass(this.navCtrl, menu);
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
