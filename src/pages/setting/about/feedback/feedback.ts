import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * 意见反馈
 */
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  /**
   * 构造函数
   */
  constructor(public navCtrl: NavController) { }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void { }

  /**
   * 提交意见反馈
   */
  submitAdvice(): void {
    this.navCtrl.pop();
  }
}
