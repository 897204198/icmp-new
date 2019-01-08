import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FeedDetailListPage } from '../feedDetailList/feedDetailList';
import { FeedDetailPage } from '../feedDetail/feedDetail';
import { HttpService } from '../../../app/services/http.service';
import { AlertController } from 'ionic-angular';
import { ToastService } from '../../../app/services/toast.service';
import { LoginPage } from '../../login/login';
@Component({
  selector: 'page-feedlist',
  templateUrl: 'feedlist.html'
})
export class FeedlistPage {
  menus : Object[] = [];
  news : Object[] = [];
  constructor(public navCtrl: NavController, private httpService: HttpService, public alertCtrl: AlertController, private toastService: ToastService) {}

  // 取得类型
  getcategory(): void {
    this.httpService.getcategory().subscribe((res) => {
      this.menus = res.json();
      console.log(res.json());
    }, (res: Response) => {
      if (res.status === 401) {
        console.log('抢登弹窗4');
        const confirm = this.alertCtrl.create({
          title: '提示',
          message: '您的账号已在其他手机登录，如非本人操作请尽快重新登录后修改密码',
          buttons: [
            {
              text: '确认',
              handler: () => {
              }
            }
          ]
        });
        confirm.present();
        // alert('您的账号已在其他手机登录，如非本人操作请尽快重新登录后修改密码');
        this.navCtrl.push(LoginPage).then(() => {
          const startIndex = this.navCtrl.getActive().index - 1;
          this.navCtrl.remove(startIndex, 1);
        });
      } else {
        // this.toastService.show(res.text());
      }
    });
  }
  getproblem(): void {
    this.httpService.getproblem().subscribe((res) => {
      this.news = res.json();
      console.log(res.json());
    });
  }
  ionViewDidEnter(): void {
    this.getcategory();
    this.getproblem();
  }
  todetaillist(menu): void {
    this.navCtrl.push(FeedDetailListPage, {title: menu.name, id: menu.id});
  }
  todetail(item) {
    this.navCtrl.push(FeedDetailPage, {problemId: item.id});
  }
}
