import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams, NavController, Navbar } from 'ionic-angular';

@Component({
  selector: 'page-exam-custom-frame',
  templateUrl: 'customFrame.html'
})
export class ExamCustomFramePage {

  @ViewChild(Navbar) navBar: Navbar;
  // 地址
  myURL: SafeUrl = '';
  // token
  token: string = localStorage.getItem('token');
  // 标题
  title: string = '';

  constructor(private sanitizer: DomSanitizer, public navParams: NavParams, private navCtrl: NavController) {
    this.title = this.navParams.data.name;
    let dangerousVideoUrl = '';
    if (this.navParams.data.isPush === true) {
      dangerousVideoUrl = this.navParams.data.data.url + '&token=' + this.token + '&title=' + this.title;
    } else {
      dangerousVideoUrl = this.navParams.data.data.url + '?token=' + this.token + '&title=' + this.title;
    }
    dangerousVideoUrl = dangerousVideoUrl.replace('#', '?v=' + new Date().getTime() + '#');
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
    window.addEventListener('message', event => {
      if (event.data === 'back') {
        this.navCtrl.pop();
      }
    });
  }

}
