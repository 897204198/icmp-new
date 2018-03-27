import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'page-exam-custom-frame',
  templateUrl: 'customFrame.html'
})
export class ExamCustomFramePage {

  myURL: SafeUrl = '';

  constructor(private sanitizer: DomSanitizer) {
    let dangerousVideoUrl = 'https://cloud.propersoft.cn/pea/master/#/customFrame/exam';
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
  }
}
