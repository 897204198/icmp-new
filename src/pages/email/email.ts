import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams } from 'ionic-angular';

@Component({
  selector: 'page-email',
  templateUrl: 'email.html'
})
export class EmailPage {

  myURL: SafeUrl = '';
  token: string = localStorage.getItem('token');

  constructor(private sanitizer: DomSanitizer, public navParams: NavParams) {
    let dangerousVideoUrl = this.navParams.data.data.url;
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
  }
}
