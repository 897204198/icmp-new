import { Component, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from '../../../app/services/device.service';
import { UserProfilePage } from '../userProfile/userProfile';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-apply',
  templateUrl: 'apply.html',
})
export class ApplyPage {

  // 申请列表
  private applyList: Array<Object> = [];
  // 国际化文字
  private transateContent: Object;
  // 控制按钮点击
  isSubmit: boolean;

  /**
   * 构造函数
   */
  constructor(private toastService: ToastService,
    private navCtrl: NavController,
    private deviceService: DeviceService,
    private zone: NgZone,
    private translate: TranslateService,
    private http: Http) {
    this.translate.get(['AGREED', 'REFUSED', 'DELETED']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    this.isSubmit = false;
    this.fetchApplications();
  }

  /**
   * 获取所有申请通知
   */
  fetchApplications(): void {
    this.http.get('/im/notice/notices').subscribe((res: Response) => {
      this.applyList = res.json();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

    /**
   * 进入个人信息详情
   */
  lookUserProfile(item: Object) {
    this.navCtrl.push(UserProfilePage, {'toUserId': item['fromUserId']});
  }

  /**
   * 同意申请
   */
  agreeApply(event: any, item: Object) {
    event.stopPropagation();
    this.isSubmit = true;
    this.http.put('/im/notice', {noticeId: item['id'], type: '2' }).subscribe(() => {
      this.toastService.show(this.transateContent['AGREED']);
      this.fetchApplications();
    }, (res: Response) => {
      this.isSubmit = false;
      this.toastService.show(res.text());
    });
  }

  /**
   * 拒绝申请
   */
  refuseApply(event: any, item: Object) {
    event.stopPropagation();
    this.isSubmit = true;
    this.http.put('/im/notice', {noticeId: item['id'], type: '3' }).subscribe(() => {
      this.toastService.show(this.transateContent['REFUSED']);
      this.fetchApplications();
    }, (res: Response) => {
      this.isSubmit = false;
      this.toastService.show(res.text());
    });
  }

  /**
   * 删除申请
   */
  deleteApply(item: Object) {
    let index = this.applyList.indexOf(item);
    this.applyList.splice(index, 1);
    let params = {
      noticeId: item['id']
    };
    this.http.delete('/im/notice/' + item['id'], {params: params}).subscribe(() => {
      this.toastService.show(this.transateContent['DELETED']);
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 后台没传头像 或 头像无法加载 时加载占位图头像
   * 如果是手机则获取原生缓存的图片
   * 如果是 web 版则显示默认占位图
   */
  setWordHeadImage(item: Object) {
    // 避免在 web 上无法显示页面
    if (this.deviceService.getDeviceInfo().deviceType) {
      let params: Object = {};
      let nickName: string = item['nickId'];
      params['nickName'] = nickName.substring(0, 1);
      (<any>window).huanxin.getWordHeadImage(params, (retData) => {
        this.zone.run(() => {
          item['headImage'] = retData;
        });
      });
    } else {
      item['headImage'] = './assets/images/user.jpg';
    }
  }

}
