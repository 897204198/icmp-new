import { Component } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * 新消息通知设置
 */
@Component({
  selector: 'page-news-notice',
  templateUrl: 'newsNotice.html'
})
export class NewsNoticePage {

  openVoice: boolean = false;
  openVibrate: boolean = false;

  /**
   * 构造函数
   */
  constructor(private nativeStorage: NativeStorage) {
    this.nativeStorage.getItem('openVoice').then(data => {
      this.openVoice = data;
    });
    this.nativeStorage.getItem('openVibrate').then(data => {
      this.openVoice = data;
    });
  }

  /**
   * 声音开关
   */
  changeVoice() {
    this.nativeStorage.setItem('openVoice', this.openVoice);
  }

  /**
   * 震动开关
   */
  changeVibrate() {
    this.nativeStorage.setItem('openVibrate', this.openVibrate);
  }

}
