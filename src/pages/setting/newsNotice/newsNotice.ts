import {Component} from '@angular/core';

/**
 * 新消息通知设置
 */
@Component({
  selector: 'page-news-notice',
  templateUrl: 'newsNotice.html'
})
export class NewsNoticePage {

  /**
   * 构造函数
   */
  constructor() {}

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {}

  /**
   * 声音开关
   */
  changeVoice(voice: HTMLInputElement): void {}

  /**
   * 震动开关
   */
  changeVibrate(vibrate: HTMLInputElement): void {}

}
