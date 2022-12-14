import { Component } from '@angular/core';
import { ToastService } from '../../../app/services/toast.service';
import { Http, Response } from '@angular/http';
import { UserInfoState, UserService } from '../../../app/services/user.service';
import { ConfigsService } from '../../../app/services/configs.service';

/**
 * 个人资料
 */
@Component({
  selector: 'page-user-info',
  templateUrl: 'userInfo.html'
})
export class UserInfoPage {

  // 用户信息
  private userInfo: Object = {};
  public surname: string;
  private localUserInfo: UserInfoState;
  private avatar: string = '';
  // 文件上传/下载地址
  private fileUrl: string = this.configsService.getBaseUrl() + '/file/';
  // token
  private token: string = '?access_token=' + localStorage['token'];
  // 是否有IM功能
  haveChangeIm: boolean = false;
  // 是否有sex属性
  hasSex: boolean = false;

  /**
   * 构造函数
   */
  constructor(private http: Http,
    private toastService: ToastService,
    private configsService: ConfigsService,
    private userService: UserService) { }
  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {
    this.getUserInfoFromLocal();
    this.getUserInfoFromNet();
    if (localStorage.getItem('todoState') === '2') {
      this.haveChangeIm = false;
    }else{
      this.haveChangeIm = true;
    }
  }

  /**
    * 取得用户信息
    */
  getUserInfoFromLocal(): void {
    this.localUserInfo = this.userService.getUserInfo();
    this.surname = this.localUserInfo.userName.substring(this.localUserInfo.userName.length - 2);
    this.userInfo['name'] = this.localUserInfo.userName;
    this.userInfo['phone'] = this.localUserInfo.phone;
    this.userInfo['email'] = this.localUserInfo.email;
    this.userInfo['ascription'] = this.localUserInfo.outter;
    this.userInfo['jobNum'] = this.localUserInfo.jobNumber;
    this.userInfo['sexName'] = this.localUserInfo.sex;
    this.userInfo['account'] = this.localUserInfo.account;
  }

  /**
   * 取得用户信息
   */
  getUserInfoFromNet(): void {
    let params = {
      userId: this.localUserInfo.userId
    };
    this.http.get('/auth/current/user', { params: params }).subscribe((res: Response) => {
      let data = res.json()['data'];
      this.userInfo['deptName'] = data.deptName;
      this.userInfo['jobName'] = data.jobName;
      this.userInfo['account'] = data.username;
      this.userInfo['headImageContent'] = data.headImageContent;
      this.userInfo['orgName'] = data.orgName;
      if (data['sex'] != null && data['sex'] !== '') {
        if (data['sex']['code'] === '0') {
          this.userInfo['sexName'] = '男';
        } else {
          this.userInfo['sexName'] = '女';
        }
        // TODO 后台此接口没有该sex字段，暂时如此处理。待后续解决
        this.hasSex = true;
      } else {
        this.hasSex = false;
      }
      if (data.avatar) {
        if (JSON.parse(localStorage.getItem('stopStreamline'))) {
          this.userInfo['avatar'] = `${this.fileUrl}${data.avatar}${this.token}`;
        } else {
          this.userInfo['avatar'] = `${this.fileUrl}${data.avatar}${this.token}${'&service_key=' + localStorage['serviceheader']}`;
        }
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 修改头像
   */
  changeAvatar(e: any): void{
    const file = e.target.files[0];
    const params: FormData = new FormData();
    params.append('file', file);
    this.http.post('/file', params).subscribe((res: Response) => {
      this.avatar = res.text();
      this.readFile(file);
      this.submit(this.avatar);
    }, () => {
      this.toastService.show('图片上传失败');
    });
    e.target.value = '';
  }

  /**
   * 读取文件
   */
  readFile(file: any): void {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    // fileReader.addEventListener('load', () => {
    //   this.userInfo['avatar'] = fileReader.result;
    // });
    fileReader.onload = () => {
      this.userInfo['avatar'] = fileReader.result;
    };
  }

  /**
   * 修改用户信息
   */
  submit(avatar: string) {
    let params: Object = {
      avatar
    };
    this.http.put(`/auth/users/current`, params).subscribe((res) => {
      this.toastService.show('头像修改成功');
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 图片加载出错或无图片显示文字
   */
  resetImg() {
    this.userInfo['avatar'] = '';
  }
}
