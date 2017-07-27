import {Component} from '@angular/core';
import { FeedbackPage } from './feedback/feedback';
import { ProperPage } from './proper/proper';
import { DownloadAddressPage } from './downloadAddress/downloadAddress';

/**
 * 关于我们
 */
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  // 意见反馈页
  feedbackPage: any;
  // App下载地址页
  downloadAddressPage: any;
  // 关于普日软件页
  properPage: any;

  /**
   * 构造函数
   */
  constructor() {
    this.feedbackPage = FeedbackPage;
    this.downloadAddressPage = DownloadAddressPage;
    this.properPage = ProperPage;
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {}

}
