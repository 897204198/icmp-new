import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams, NavController, Navbar } from 'ionic-angular';
import { ConfigsService } from '../../../app/services/configs.service';

@Component({
  selector: 'page-exam-custom-frame',
  templateUrl: 'customFrame.html'
})
export class ExamCustomFramePage {

  @ViewChild(Navbar) navBar: Navbar;
  // 地址
  myURL: SafeUrl = '';
  // 标题
  title: string = '';

  constructor(private sanitizer: DomSanitizer, public navParams: NavParams, private navCtrl: NavController, private configsService: ConfigsService,
    ) {
    this.title = this.navParams.data.name;
    let dangerousVideoUrl = '';
    if (this.navParams.data.isPush === true) {
      dangerousVideoUrl = this.navParams.data.data.url;
    } else {
      let menuStr: string = this.navParams.data.data.url;
      // 添加serviceKey请求头
      if (localStorage.getItem('serviceheader') === 'null' || localStorage.getItem('serviceheader') === '') {
        menuStr = this.configsService.getBaseWebUrl() + 'standard' + menuStr;
      }else{
        menuStr = this.configsService.getBaseWebUrl() + localStorage.getItem('serviceheader') + menuStr;
      }
      if (menuStr.includes('?')) {
        dangerousVideoUrl = this.navParams.data.data.url + '&token=' + localStorage.getItem('token') + '&title=' + this.title;
      } else {
        dangerousVideoUrl = this.navParams.data.data.url + '?token=' + localStorage.getItem('token') + '&title=' + this.title;
      }
      dangerousVideoUrl = dangerousVideoUrl.replace('#', '?v=' + new Date().getTime() + '#');
      dangerousVideoUrl = dangerousVideoUrl + '&serviceKey=' + localStorage.getItem('serviceheader');
    }
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
    window.addEventListener('message', event => {
      if (event.data === 'back') {
        this.navCtrl.pop();
      }
      if (event.data === 'close') {
        this.navCtrl.pop();
      }
    });
  }

}
