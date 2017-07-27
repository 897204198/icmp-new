import { Injectable } from '@angular/core';
import { ConfigsService } from './configs.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UserService, UserInfoState } from './user.service';

/**
 * 文件服务
 */
@Injectable()
export class FileService {

  constructor(private configsService: ConfigsService,
              private inAppBrowser: InAppBrowser,
              private userService: UserService) {}

  /**
   * 下载文件
   */
  downloadFile(fileId: string, fileName: string): void {
    let userInfo: UserInfoState = this.userService.getUserInfo();
    this.inAppBrowser.create(this.configsService.getBaseUrl() + '/webController/downloadFile?fileId=' + fileId + '&loginName=' + userInfo.loginName + '&password=' + userInfo.password, '_system');
  }
}
