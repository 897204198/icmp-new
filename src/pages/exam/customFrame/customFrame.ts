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
  // 是否是根目录
  isRoot: boolean = true;

  constructor(private sanitizer: DomSanitizer, public navParams: NavParams, private navCtrl: NavController) {
    this.title = this.navParams.data.name;
    let dangerousVideoUrl = this.navParams.data.data.url + '?token=' + this.token + '&title=' + this.title;
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
    window.addEventListener('message', event => {
      if (event.data === 'root') {
        this.isRoot = true;
      } else {
        this.isRoot = false;
      }
    });
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e: UIEvent) => {
      if (this.isRoot) {
        this.navCtrl.pop();
      } else {
        history.back();
      }
    };
  }

}
