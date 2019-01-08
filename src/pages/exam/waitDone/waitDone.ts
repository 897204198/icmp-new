import { Component, NgZone } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { ConfigsService } from '../../../app/services/configs.service';

@Component({
selector: 'page-waitDone',
templateUrl: 'waitDone.html'
})
export class WaitDonePage {
// 地址
myURL: SafeUrl = '';
// 标题
title: string = '';
/**
* 构造函数
*/
constructor(
  private configsService: ConfigsService,
  private sanitizer: DomSanitizer,
  private http: Http,
  private toastService: ToastService,
  private zone: NgZone) {
    this.title = '待办';
    let dangerousVideoUrl = '';
    if (localStorage.getItem('serviceheader') === 'null' || localStorage.getItem('serviceheader') === '') {
      dangerousVideoUrl = this.configsService.getBaseWebUrl() + 'standard' + '/#/webapp/workflow/todo';
    }else{
      dangerousVideoUrl = this.configsService.getBaseWebUrl() + localStorage.getItem('serviceheader') + '/#/webapp/workflow/todo';
    }
    if (dangerousVideoUrl.includes('?')) {
      dangerousVideoUrl = dangerousVideoUrl + '&token=' + localStorage.getItem('token') + '&title=' + this.title + '&hideHeader=' + true;
    } else {
      dangerousVideoUrl = dangerousVideoUrl + '?token=' + localStorage.getItem('token') + '&title=' + this.title + '&hideHeader=' + true;
    }
    dangerousVideoUrl = dangerousVideoUrl.replace('#', '?v=' + new Date().getTime() + '#');
    dangerousVideoUrl = dangerousVideoUrl + '&serviceKey=' + localStorage.getItem('serviceheader');
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
  }
}
