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
   * 取得mobielplatform请求地址
   */
  getMobileplatformUrl(): string {
    if (localStorage.getItem('mobileplatformUrl') != null && localStorage.getItem('mobileplatformUrl') !== '') {
      return localStorage.getItem('mobileplatformUrl');
    } else {
      return this.appConstant.oaConstant.mobileplatformUrl;
    }
  }

  /**
   * 取得web前半段地址
   */
  getBaseWebUrl(): string {
    if (localStorage.getItem('baseWebUrl') != null && localStorage.getItem('baseWebUrl') !== '') {
      return localStorage.getItem('baseWebUrl');
    } else {
      return this.appConstant.oaConstant.baseWebUrl;
    }
  }

  /**
   * 取得 ChatKey
   */
  getChatKey(): string {
    if (localStorage.getItem('chatKey') != null && localStorage.getItem('chatKey') !== '') {
      return localStorage.getItem('chatKey');
    } else {
      return this.appConstant.oaConstant.chatKey;
    }
  }
  /**
   * 取得 获取servicekey的地址
   */
  getServiceKeyUrl(): string {
    if (localStorage.getItem('getServiceKeyUrl') != null && localStorage.getItem('getServiceKeyUrl') !== '') {
      return localStorage.getItem('getServiceKeyUrl');
    } else {
      return this.appConstant.oaConstant.getServiceKeyUrl;
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
   * 设置mobieplatform请求地址
   */
  setMobielplatformUrl(mobileplatformUrl: string): void {
    if (mobileplatformUrl != null && mobileplatformUrl !== '') {
      localStorage.setItem('mobileplatformUrl', mobileplatformUrl);
    } else {
      localStorage.removeItem('mobileplatformUrl');
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

  /**
   * 设置 ChatKey
   */
  setChatKey(chatKey: string): void {
    if (chatKey != null && chatKey !== '') {
      localStorage.setItem('chatKey', chatKey);
    } else {
      localStorage.removeItem('chatKey');
    }
  }
  /**
   * 设置 servicekey请求地址
   */
  setServiceKeyUrl(getServiceKeyUrl: string): void {
    if (getServiceKeyUrl != null && getServiceKeyUrl !== '') {
      localStorage.setItem('getServiceKeyUrl', getServiceKeyUrl);
    } else {
      localStorage.removeItem('getServiceKeyUrl');
    }
  }
   /**
   * 设置 web页面前地址
   */
  setBaseWebUrl(baseWebUrl: string): void {
    if (baseWebUrl != null && baseWebUrl !== '') {
      localStorage.setItem('baseWebUrl', baseWebUrl);
    } else {
      localStorage.removeItem('baseWebUrl');
    }
  }
}
