import { Component } from '@angular/core';
import { Device } from '@ionic-native/device';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { HttpService } from '../../../app/services/http.service';
import { UserService } from '../../../app/services/user.service';
import { LoginPage } from '../../login/login';

@Component({
  selector: 'page-feedDetail',
  templateUrl: 'feedDetail.html'
})
export class FeedDetailPage {
  private id: string = '';
  // private deviceId: string = 'asd12345sw77bb'
  private deviceId: string = '';
  private flag: boolean = true;
  private item: object = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,
    private httpService: HttpService, private device: Device, private userService: UserService) {}

  ionViewDidLoad(): void {
    this.deviceId = this.device.uuid;
    this.id = this.navParams.get('problemId');
    this.getdata();
  }
  private getdata() {
    this.httpService.getproblemDetail(this.id, this.deviceId).subscribe((res: Response) => {
      this.item = res.json();
      // this.item = res.json();
    });
  }
  private discuss(type: number) {
    if (this.flag) {
      this.flag = false;
      this.httpService.problemassess(this.id, this.deviceId, type).subscribe((res: Response) => {
        this.item = res.json();
        this.flag = true;
      });
    }
  }
  public itemRouter(type: number) {
    let isLogin: boolean = true;
    isLogin = this.userService.hasToken();
    if (isLogin) {
      this.discuss(type);
    } else {
      this.navCtrl.push(LoginPage);
    }
  }
}
