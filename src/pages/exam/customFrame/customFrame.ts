import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'page-exam-custom-frame',
  templateUrl: 'customFrame.html'
})
export class ExamCustomFramePage {

  myURL: SafeUrl = '';
  token: string = localStorage.getItem('token');

  constructor(private sanitizer: DomSanitizer) {
    let dangerousVideoUrl = 'https://cloud.propersoft.cn/pea/master/#/customFrame/exam?token=' + this.token;
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
  }
}
