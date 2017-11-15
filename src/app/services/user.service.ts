import { Injectable } from '@angular/core';
import { SecureStorageService } from './secureStorage.service';

export interface UserInfoState {
  loginName: string;
  password: string;
  userName: string;
  password0: string;
  userId: string;
  headImage: string;
  savePassword: boolean;
}

export let initUserInfo: UserInfoState = {
  loginName: '',
  password: '',
  userName: '',
  password0: '',
  userId: '',
  headImage: '',
  savePassword: true
};

/**
 * 用户服务
 */
@Injectable()
export class UserService {

  // 设备信息存储键
  static SEC_KEY_USER_INFO = 'userInfo';

  /**
   * 构造函数
   */
  constructor(private secureStorageService: SecureStorageService) {}

  /**
   * 判断是否登录
   */
  isLogin(): boolean {
    if (localStorage.getItem('autoLogin') === '1') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 登录
   */
  login(): void {
    localStorage.setItem('autoLogin', '1');
  }

  /**
   * 退出登录
   */
  logout(): void {
    localStorage.setItem('autoLogin', '0');
  }

  /**
   * 保存用户信息
   */
  saveUserInfo(userInfo: UserInfoState): void {
    this.secureStorageService.putObject(UserService.SEC_KEY_USER_INFO, userInfo);
  }

  /**
   * 取得用户信息
   */
  getUserInfo(): UserInfoState {
    return this.secureStorageService.getObject(UserService.SEC_KEY_USER_INFO);
  }
}
