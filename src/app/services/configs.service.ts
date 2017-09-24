import { Injectable, Inject } from '@angular/core';
import { AppConstant, APP_CONSTANT } from '../constants/app.constant';

/**
 * 应用全局配置服务
 */
@Injectable()
export class ConfigsService {

  /**
   * 构造函数
   */
  constructor(@Inject(APP_CONSTANT) private appConstant: AppConstant) {}

  /**
   * 取得http请求地址
   */
  getBaseUrl(): string {
    if (localStorage.getItem('baseUrl') != null && localStorage.getItem('baseUrl') !== '') {
      return localStorage.getItem('baseUrl');
    } else {
      return this.appConstant.oaConstant.baseUrl;
    }
  }

    /**
   * 取得im http请求地址
   */
  getIMUrl(): string {
    return this.appConstant.oaConstant.imUrl;
  }

  /**
   * 取得推送服务器地址
   */
  getPushUrl(): string {
    if (localStorage.getItem('pushUrl') != null && localStorage.getItem('pushUrl') !== '') {
      return localStorage.getItem('pushUrl');
    } else {
      return this.appConstant.properPushConstant.pushUrl;
    }
  }

  /**
   * 设置http请求地址
   */
  setBaseUrl(baseUrl: string): void {
    if (baseUrl != null && baseUrl !== '') {
      localStorage.setItem('baseUrl', baseUrl);
    } else {
      localStorage.removeItem('baseUrl');
    }
  }

  /**
   * 设置推送服务器地址
   */
  setPushUrl(pushUrl: string): void {
    if (pushUrl != null && pushUrl !== '') {
      localStorage.setItem('pushUrl', pushUrl);
    } else {
      localStorage.removeItem('pushUrl');
    }
  }
}
