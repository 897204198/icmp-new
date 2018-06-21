import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams, NavController } from 'ionic-angular';
import { DeviceService, DeviceInfoState } from '../../../app/services/device.service';

@Component({
  selector: 'page-exam-custom-frame',
  templateUrl: 'customFrame.html'
})
export class ExamCustomFramePage {

  myURL: SafeUrl = '';
  token: string = localStorage.getItem('token');
  private isShowHeader: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    public navParams: NavParams,
    private navCtrl: NavController,
    private deviceService: DeviceService) {
    let dangerousVideoUrl = this.navParams.data.data.url + '?token=' + this.token + '&questionnaireNo=' + this.navParams.data.data.questionnaireNo;
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
    const deviceInfo: DeviceInfoState = this.deviceService.getDeviceInfo();
    if (deviceInfo.deviceType === 'ios') {
      this.isShowHeader = true;
    }
    window.addEventListener('message', event => {
      if (event.data === 'popPage') {
        this.navCtrl.pop();
      }
    });
  }

}
