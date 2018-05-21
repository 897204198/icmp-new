import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NavController, ModalController } from 'ionic-angular';
import { UserInfoState, initUserInfo, UserService } from '../../app/services/user.service';
import { ToastService } from '../../app/services/toast.service';
import { PhotoService } from '../../app/services/photo.service';
import { TranslateService } from '@ngx-translate/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ConfigsService } from '../../app/services/configs.service';
import { UtilsService } from '../../app/services/utils.service';
import { FileService } from '../../app/services/file.service';

@Component({
  selector: 'page-insta-shot',
  templateUrl: 'instaShot.html',
})
export class InstaShotPage {

  // 国际化文字
  private transateContent: Object;
  // 是否显示遮罩
  private isShowSpinner: boolean = false;
  // 用户信息（用户名、密码、昵称等）
  private userInfo: UserInfoState = initUserInfo;
  // 列表选项
  private initData: Object = {};

  // 类别选项信息，包含 name 和 code
  private hospitalAreaInfo: Array<string> = [];
  // 科室选项信息，包含 name 和 code
  private departmentInfo: Array<string> = [];
  // 当前选择的类别 code
  private hospitalAreaCode: string = '';
  // 当前选择的科室 code
  private departmentCode: string = '';
  // 图片列表
  private photoList: any[] = [];
  // 图片 url 数组
  private photoUrlArray: string[] = [];
  // 最后提交的数据
  private submitInfo: Object = {};
  // 是否匿名
  private isShow: boolean = true;
  // 当前日期
  private time: string = '';


  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    private toastService: ToastService,
    private photoService: PhotoService,
    private modalCtrl: ModalController,
    private configsService: ConfigsService,
    private utilsService: UtilsService,
    private translate: TranslateService,
    private transfer: FileTransfer,
    private fileService: FileService,
    private file: File,
    private http: Http) {
    this.translate.get(['REQUIRE_NOT', 'MAX_PHOTO', 'SUBMIT_SUCCESS']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  ionViewDidLoad() {
    // 获取用户资料，上报人只能是自己不可修改
    this.userInfo = this.userService.getUserInfo();
    this.submitInfo['username'] = this.userInfo.userName;
    this.submitInfo['userId'] = this.userInfo.userId;

    this.submitInfo['isAnonymity'] = 0;
    this.gethospitalArea();
    this.getDepartment();
    this.getJobNum();
    this.getDate();
  }

  // 获取当前日期
  getDate(): void {
    let date = new Date();
    let y = date.getFullYear();
    let m = (date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1));
    let d = (date.getDate()) > 10 ? date.getDate() : ('0' + date.getDate());
    this.time = y + '-' + m + '-' + d;
    this.submitInfo['date'] = this.time;
  }

  // 获取员工工号
  getJobNum(): void {
    this.http.post('/webController/getUserInfo', null).subscribe((res: Response) => {
      let userInfos = res.json();
      this.submitInfo['jobNum'] = userInfos.jobNum;
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  // 获取类别信息 
  /* 进入页面只执行一次 */
  gethospitalArea() {
    let params: URLSearchParams = new URLSearchParams();
    params.append('serviceName', 'hospitalArea');
    this.http.post('/webController/getInstaShotInfo', params).subscribe((res: Response) => {
      let data = res.json().data;
      if (res.json().result === '0') {
        // 类别信息 name、code
        this.hospitalAreaInfo = data;
        // 临时的 Array，循环获取所属院区列表数据
        let dataArray: Array<string> = this.getNameInfoFromArray(data);
        // 所属类别列表数据
        this.initData['hospitalArea'] = dataArray;
      } else {
        this.toastService.show(res.json().errMsg);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  // 获取科室信息
  /* 进入页面只执行一次 */
  getDepartment() {
    let params: URLSearchParams = new URLSearchParams();
    params.append('serviceName', 'department');
    this.http.post('/webController/getInstaShotInfo', params).subscribe((res: Response) => {
      let data = res.json().data;
      if (res.json().result === '0') {
        // 科室信息 name、code
        this.departmentInfo = data;
        // 临时的 Array，循环获取所属类别列表数据
        let dataArray: Array<string> = this.getNameInfoFromArray(data);
        // 所属科室列表信息
        this.initData['department'] = dataArray;
      } else {
        this.toastService.show(res.json().errMsg);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  // 选择类别
  clickHospitalAreaOption() {
    // 从 已选类别 寻找对应的 类别code
    for (let i = 0; i < this.hospitalAreaInfo.length; i++) {
      if (this.hospitalAreaInfo[i]['name'] === this.submitInfo['hospitalArea']) {
        this.hospitalAreaCode = this.hospitalAreaInfo[i]['code'];
      }
    }
  }

  // 选择科室
  clickDepartmentOption() {
    // 从 已选科室 寻找对应的 科室code
    for (let i = 0; i < this.departmentInfo.length; i++) {
      if (this.departmentInfo[i]['name'] === this.submitInfo['department']) {
        this.departmentCode = this.departmentInfo[i]['code'];
      }
    }
  }

  // 是否匿名
  toggleIsAnonymity(): void {
    this.isShow = !this.isShow;
  }

  // 拍照获取图片
  getPhotoFromCamera() {
    this.photoService.getPictureByCamera({
      destinationType: 1
    }).subscribe(img => {
      let imageInfo: Object = {};
      imageInfo['imageUrl'] = img;
      imageInfo['imageName'] = this.utilsService.formatDate(new Date(), 'YYYYMMDDHHmmss') + '.' + this.fileService.getFileType(img);
      this.photoList.push(imageInfo);
    });
  }

  // 从相册获取图片
  getPhotoFromAlbum() {
    this.photoService.getMultiplePicture({
      destinationType: 1
    }).subscribe(img => {
      // 从数组中取图片
      for (let i = 0; i < img.length; i++) {
        let imageInfo: Object = {};
        imageInfo['imageUrl'] = img[i];
        imageInfo['imageName'] = this.utilsService.formatDate(new Date(), 'YYYYMMDDHHmmss') + i + '.' + this.fileService.getFileType(img[i]);
        this.photoList.push(imageInfo);
      }

    });
  }

  // 侧滑删除图片
  deletePhoto(photo: any) {
    let index = this.photoList.indexOf(photo);
    this.photoList.splice(index, 1);
  }

  // 提交随手拍
  submitInstaShot() {
    // let count = Object.keys(this.submitInfo).length;
    // 判断是否填写必填项
    if (!this.departmentCode || !this.hospitalAreaCode) {
      this.toastService.show(this.transateContent['REQUIRE_NOT']);
      return;
    }

    // 没选照片直接上报事件 否则先提交照片，后作为参数一起上传
    if (this.photoList.length === 0) {
      this.infoSubmit();
    } else {
      this.imageUpload();
    }

  }

  // 照片上传
  imageUpload() {
    // 照片超过9个给提示
    if (this.photoList.length > 9) {
      this.toastService.show(this.transateContent['MAX_PHOTO']);
      return;
    }
    // 清空照片 url
    this.photoUrlArray.splice(0, this.photoUrlArray.length);
    // 显示遮罩
    this.isShowSpinner = true;

    /* 图片上传 */
    const fileTransfer: FileTransferObject = this.transfer.create();
    for (let i = 0; i < this.photoList.length; i++) {
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: this.photoList[i]['imageName'],
        mimeType: 'multipart/form-data'
      };
      fileTransfer.upload(this.photoList[i]['imageUrl'], this.configsService.getBaseUrl() + '/webController/uploadFile?loginName=' + this.userInfo.loginName, options)
        .then((data) => {
          // 每传一张图，就往 photoUrlArray 添加一张
          this.photoUrlArray.push(data.response);
          // 判断图片是否已经全部上传完
          if (this.photoUrlArray.length === this.photoList.length) {
            this.submitInfo['fileId'] = this.photoUrlArray;
            this.isShowSpinner = false;
            this.infoSubmit();
          }
        }, (err) => {

        });
    }
  }

  // 随手拍信息上传
  infoSubmit() {
    /*
     * 上报人、是否匿名、内容、所选院区code、所选科室code
     */
    let params: URLSearchParams = new URLSearchParams();
    params.append('username', this.submitInfo['username']);
    params.append('userId', this.submitInfo['userId']);
    params.append('jobNum', this.submitInfo['jobNum']);
    params.append('isAnonymity', this.submitInfo['isAnonymity']);
    params.append('content', this.submitInfo['content']);
    params.append('tel', this.submitInfo['tel']);
    params.append('date', this.submitInfo['date']);
    params.append('hospitalAreaCode', this.hospitalAreaCode);
    params.append('departmentCode', this.departmentCode);
    // 图片不是必填项
    if (this.submitInfo['fileId'] !== undefined) {
      params.append('fileId', this.submitInfo['fileId']);
    }
    this.http.post('/webController/instaShot', params).subscribe((res: Response) => {
      let data = res.json();
      if (data.result === '0') {
        this.toastService.show(this.transateContent['SUBMIT_SUCCESS']);
        this.navCtrl.pop();
      } else {
        this.toastService.show(data.errMsg);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  // 从数组中取得所有 name 返回新数组
  getNameInfoFromArray(arr: Array<any>): Array<string> {
    let tempArray: Array<string> = [];
    for (let i = 0; i < arr.length; i++) {
      tempArray.push(arr[i].name);
    }
    return tempArray;
  }
}
