import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-exam-custom-frame',
  templateUrl: 'customFrame.html'
})
export class ExamCustomFramePage {

  myURL: SafeUrl = '';
  token: string = localStorage.getItem('token');

  constructor(private sanitizer: DomSanitizer, public navParams: NavParams) {
    let dangerousVideoUrl = this.navParams.data.data.url + '?token=' + this.token + '&questionnaireNo=' + this.navParams.data.data.questionnaireNo;
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
  }
}
