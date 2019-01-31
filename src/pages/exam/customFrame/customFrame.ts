import { Component, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavParams, NavController, Navbar } from 'ionic-angular';
import { ConfigsService } from '../../../app/services/configs.service';
import { PhotoService } from '../../../app/services/photo.service';
import { ActionSheetController } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
export const IMAGE_SIZE = 500; // 拍照/从相册选择照片压缩大小
export const QUALITY_SIZE = 94; // 图像压缩质量，范围为0 - 100

let navCtrl2;
let actionSheetCtrl2;
let photoService2;
const fn = (event) => {
  const eventId = event.data.id;
      const type = event.data.type;
      const maximumImagesCount = event.data.maximumImagesCount;
      if (event.data === 'back') {
        navCtrl2.pop();
      }
      if (event.data === 'close') {
        navCtrl2.pop();
      }
      if (type === 'chooseImage') {
        const actionSheet = actionSheetCtrl2.create({
          title: '选择图片',
          buttons: [
            {
              text: '拍照',
              handler: () => {
                photoService2.getPictureByCamera().subscribe(img => {
                  let image = new Image();
                  image.src = img;
                  image.onload = function () {
                    let canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    let ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0, image.width, image.height);
                    let ext = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase();
                    let dataURL = canvas.toDataURL('image/' + ext);
                    window.frames[0].postMessage({ id: eventId, data: [dataURL] }, '*');
                  };
                });
              }
            }, {
              text: '从手机相册选择',
              handler: () => {
                photoService2.getMultiplePicture({maximumImagesCount: maximumImagesCount}).subscribe(img => {
                  // this.fileUpload(img);
                  let menus = [];
                  for (let i = 0; i < img.length; i++) {
                    let image = new Image();
                    image.src = img[i];
                    image.onload = function () {
                      let canvas = document.createElement('canvas');
                      canvas.width = this.width;
                      canvas.height = this.height;
                      let ctx = canvas.getContext('2d');
                      ctx.drawImage(this, 0, 0, this.width, this.height);
                      let ext = this.src.substring(this.src.lastIndexOf('.') + 1).toLowerCase();
                      let dataURL = canvas.toDataURL('image/' + ext);
                      menus.push(dataURL);
                      if (menus.length === img.length) {
                      window.frames[0].postMessage({ id: eventId, data: menus }, '*');
                      }
                    }.bind(image);
                  }
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
};
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
  data: string = '';
  imageBase64: Array<string> = [];
  constructor(
    private imagePicker: ImagePicker, private camera: Camera, private actionSheetCtrl: ActionSheetController, private photoService: PhotoService, private sanitizer: DomSanitizer, public navParams: NavParams, private navCtrl: NavController, private configsService: ConfigsService,
  ) {
    navCtrl2 = this.navCtrl;
    actionSheetCtrl2 = this.actionSheetCtrl;
    photoService2 = this.photoService;
    this.title = this.navParams.data.name;
    let dangerousVideoUrl = '';
    if (this.navParams.data.isPush === true) {
      dangerousVideoUrl = this.navParams.data.data.url;
    } else {
      let menuStr: string = this.navParams.data.data.url;
      // 添加serviceKey请求头
      if (localStorage.getItem('serviceheader') === 'null' || localStorage.getItem('serviceheader') === '') {
        menuStr = this.configsService.getBaseWebUrl() + 'standard' + menuStr;
      } else {
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
    window.addEventListener('message', fn);
  }
  ionViewDidLeave(): void {
    console.log(navCtrl2);
    window.removeEventListener('message', fn);
  }

}
