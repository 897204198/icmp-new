import { Component, NgZone } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { DeviceService } from '../../../app/services/device.service';
import { UserProfilePage } from '../userProfile/userProfile';
import { NavController } from 'ionic-angular';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'page-addFriend',
  templateUrl: 'addFriend.html',
})
export class AddFriendPage {
  // 用户列表
  private userList: Array<Object> = [];
  // 国际化文字
  private transateContent: Object;
  // 查询拦截器
  private titleFilter: FormControl = new FormControl();
  /**
   * 构造函数
   */
  constructor(private toastService: ToastService,
    private navCtrl: NavController,
    private translate: TranslateService,
    private deviceService: DeviceService,
    private zone: NgZone,
    private http: Http) {
    this.translate.get(['REQUEST_SENT']).subscribe((res: Object) => {
      this.transateContent = res;
    });
    this.titleFilter.valueChanges.debounceTime(500).subscribe(
      () => {
        this.searchUser();
      }
    );
  }

  ionViewWillEnter() :void {
    this.searchUser(true);
  }

  /**
   * 搜索用户
   */
  searchUser(param?: any) {
    this.http.get('/im/contacts/users', { params: { 'searchText': param ? '' : this.titleFilter.value } }).subscribe((res: Response) => {
      this.userList = res.json();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
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
    this.http.post('/im/contacts/application', params).subscribe((res: Response) => {
      this.toastService.show(this.transateContent['REQUEST_SENT']);
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 进入个人信息详情
   */
  lookUserProfile(item: Object) {
    let isFriend: boolean = false;
    if (item['status'] && (item['status']['code'] === '0' || item['status']['code'] === 0)) {
      isFriend = true;
    }
    let params: object = {
      toUserId: item['id'],
      remark: item['name'],
      isFriend: isFriend
    };
    this.navCtrl.push(UserProfilePage, params);
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
