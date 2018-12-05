import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams, NavController, Navbar } from 'ionic-angular';
import { ConfigsService } from '../../../app/services/configs.service';
import { PhotoService } from '../../../app/services/photo.service';
import { ActionSheetController } from 'ionic-angular';

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

  constructor(
    private actionSheetCtrl: ActionSheetController,private photoService: PhotoService,private sanitizer: DomSanitizer, public navParams: NavParams, private navCtrl: NavController, private configsService: ConfigsService,
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
        dangerousVideoUrl = menuStr + '&token=' + localStorage.getItem('token') + '&title=' + this.title;
      } else {
        dangerousVideoUrl = menuStr + '?token=' + localStorage.getItem('token') + '&title=' + this.title;
      }
      dangerousVideoUrl = dangerousVideoUrl.replace('#', '?v=' + new Date().getTime() + '#');
    }
    this.myURL = this.sanitizer.bypassSecurityTrustResourceUrl(dangerousVideoUrl);
    window.addEventListener('message', event => {
      const eventId = event.data.id;
      const type = event.data.type;
      if (event.data === 'back') {
        this.navCtrl.pop();
      }
      if (event.data === 'close') {
        this.navCtrl.pop();
      }
      if (type === 'chooseImage') {
        const actionSheet = this.actionSheetCtrl.create({
          title: '选择图片',
          buttons: [
            {
              text: '拍照',
              handler: () => {
                this.photoService.getPictureByCamera().subscribe(img => {
                   window.frames[0].postMessage({id:eventId, data: [img]});
                });
              }
            }, {
              text: '从手机相册选择',
              handler: () => {
                this.photoService.getMultiplePicture().subscribe(img => {
                  // this.fileUpload(img);
                  window.frames[0].postMessage({id:eventId, data: img});
                });
              }
            }, {
              text: '取消',
              role: 'cancel'
            }
          ]
        });
        actionSheet.present();
      }
    });
  }

}
