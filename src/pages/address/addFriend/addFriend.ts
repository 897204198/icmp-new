import { Component, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from '../../../app/services/device.service';
import { UserProfilePage } from '../userProfile/userProfile';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-addFriend',
  templateUrl: 'addFriend.html',
})
export class AddFriendPage  {
  private searchInput: string;
  private userList: Array<Object> = [];
  // 国际化文字
  private transateContent: Object;
  /**
   * 构造函数
   */
  constructor(private toastService: ToastService,
    private navCtrl: NavController,
    private translate: TranslateService,
    private deviceService: DeviceService,
    private zone: NgZone,
    private http: Http) {
    this.translate.get(['ADD_SUCCESS']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 改变输入框的值
   */
  onInput(e): void {
    this.userList = null;
  }

  /**
   * 搜索用户
   */
  searchUser() {
    if (this.searchInput && this.searchInput.trim()){
      this.userList = null;
      this.http.get('/im/contact/users', { params: { 'searchText': this.searchInput } }).subscribe((res: Response) => {
        this.userList = res.json();
      }, (res: Response) => {
        this.toastService.show(res.text());
      });
    }
  }

  /**
   * 添加好友
   */
  addFriend(event: any, user: Object) {
    event.stopPropagation();
    let params = {
      'toUserId': user['id'],
      'type': '0'
    };
    this.http.post('/im/contact/send', params).subscribe((res: Response) => {
      this.toastService.show(this.transateContent['ADD_SUCCESS']);
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 进入个人信息详情
   */
  lookUserProfile(item: Object) {
    this.navCtrl.push(UserProfilePage, {'toUserId': item['id'], 'remark': item['name'], 'pageType': '0'});
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
      let nickName: string = item['name'];
      params['nickName'] = nickName.substring(0, 1);
      (<any>window).huanxin.getWordHeadImage(params, (retData) => {
        this.zone.run(() => {
          item['headImageContent'] = retData;
        });
      });
    } else {
      item['headImageContent'] = './assets/images/user.jpg';
    }
  }
}
