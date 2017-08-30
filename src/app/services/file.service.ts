import { Injectable } from '@angular/core';
import { ConfigsService } from './configs.service';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UserService, UserInfoState } from './user.service';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';
import { FileOpener } from '@ionic-native/file-opener';
import { LoadingController } from 'ionic-angular';
import { ToastService } from './toast.service';

/**
 * 文件服务
 */
@Injectable()
export class FileService {

  constructor(private configsService: ConfigsService,
    private inAppBrowser: InAppBrowser,
    private userService: UserService,
    private transfer: FileTransfer,
    private fileOpener: FileOpener,
    public loadingCtrl: LoadingController,
    private toastService: ToastService,
    public platform: Platform,
    private file: File) {
  }

  /**
   * 下载文件
   */
  downloadFile(fileId: string, fileName: string): void {
    let userInfo: UserInfoState = this.userService.getUserInfo();
    let fileType: string = this.getFileType(fileName);
    let fileUrl: string = this.configsService.getBaseUrl() + '/webController/downloadFile?fileId=' + fileId + '&loginName=' + userInfo.loginName + '&password=' + userInfo.password;
    let loading = this.loadingCtrl.create({
      content: '下载中...'
    });

    loading.present();
    this.platform.ready().then(() => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(fileUrl, this.file.dataDirectory + fileId + fileType).then((entry) => {
        this.fileOpener.open(entry.nativeURL, 'application/pdf')
          .then(() => {
            loading.dismiss();
          })
          .catch(() => {
            loading.dismiss();
            this.toastService.show('打开失败');
          });
      }, (error) => {
        loading.dismiss();
        this.toastService.show('下载失败');
      });

      // 进度
      fileTransfer.onProgress(progressEvent => {
        if (progressEvent.lengthComputable) {
          console.log(progressEvent.loaded / progressEvent.total);
        } else {

        }
      });
    });
  }

  /**
   * 取得文件类型
   */
  getFileType(fileName: string): string {
    return fileName.substring(fileName.indexOf('.'), fileName.length).toLowerCase();
  }
}
