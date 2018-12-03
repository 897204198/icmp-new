import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FeedbackPage } from '../../../feedback/feedback';
import { UserService } from '../../../../../app/services/user.service'
import { LoginPage } from '../../../../login/login'

@Component({
  selector: 'feed-btn',
  templateUrl: 'feedbtn.html'
})
export class feedbtnComponent {
  constructor(public navCtrl: NavController, private userService: UserService) {}
  tofeed() {
    this.navCtrl.push(FeedbackPage)
  }
  itemRouter() {
    let isLogin: boolean = true;
    isLogin = this.userService.hasToken();
    if (isLogin) {
      this.tofeed()
    } else {
      this.navCtrl.push(LoginPage);
    }
  }
}