import { Component, NgZone } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';

@Component({
selector: 'page-waitDone',
templateUrl: 'waitDone.html'
})
export class WaitDonePage {
// 地址
myURL: SafeUrl = '';
// 标题
title: string = '';
 // 我的应用列表
 private menus: Object[] = [];
/**
* 构造函数
*/
constructor(
  private sanitizer: DomSanitizer,    
  private http: Http,
  private toastService: ToastService,
  private zone: NgZone) {
    this.title = '待办';
    let dangerousVideoUrl = '';
    let menuStr: string = 'https://icmp2.propersoft.cn/icmp/webs/#/webapp/workflow/todo';
    if (menuStr.includes('?')) {
      dangerousVideoUrl = menuStr + '&token=' + localStorage.getItem('token') + '&title=' + this.title + '&hideHeader='+true;
    } else {
      dangerousVideoUrl = menuStr + '?token=' + localStorage.getItem('token') + '&title=' + this.title + '&hideHeader='+true;
    }
    dangerousVideoUrl = dangerousVideoUrl.replace('#', '?v=' + new Date().getTime() + '#');
    dangerousVideoUrl = dangerousVideoUrl + '&serviceKey=' + localStorage.getItem('serviceheader');
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
  }
}
