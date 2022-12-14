import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams, NavController, Navbar } from 'ionic-angular';

@Component({
  selector: 'page-mac-address-frame',
  templateUrl: 'macFrame.html'
})
export class MacFramePage {

  @ViewChild(Navbar) navBar: Navbar;
  // 地址
  myURL: SafeUrl = '';
  // 标题
  title: string = '';

  constructor(private sanitizer: DomSanitizer, public navParams: NavParams, private navCtrl: NavController) {
    this.title = this.navParams.data.name;
    let dangerousVideoUrl = '';
    if (this.navParams.data.isPush === true) {
      dangerousVideoUrl = this.navParams.data.data.url;
    } else {
      let menuStr: string = this.navParams.data.data.url;
      if (menuStr.includes('?')) {
        dangerousVideoUrl = this.navParams.data.data.url + '&token=' + localStorage.getItem('token') + '&title=' + this.title + '&close=true';
      } else {
        dangerousVideoUrl = this.navParams.data.data.url + '?token=' + localStorage.getItem('token') + '&title=' + this.title + '&close=true';
      }


      dangerousVideoUrl = dangerousVideoUrl.replace('#', '?v=' + new Date().getTime() + '#');
    }
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
    let isCanClose = true; // 保持返回次数唯一
    window.addEventListener('message', event => {
      if (event.data === 'back') {
         this.navCtrl.popToRoot();  // 返回首页
      }else  if (event.data === 'close'){
        if (isCanClose){
          isCanClose = false;
          this.navCtrl.pop();
        }
      }
    });
  }

}
