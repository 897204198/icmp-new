import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../app/services/toast.service';

@Component({
  selector: 'page-notice',
  templateUrl: 'notice.html'
})
export class NoticePage {

  notice: Object;
  notices: Object[];
  index: number;
  pages: number = 0;
  page: number = 0;
  private transateContent: Object;

  constructor(public navParams: NavParams,
              private toast: ToastService,
              private translate: TranslateService) {
    let translateKeys: string[] = ['HAS_NO_PRESIOUS', 'HAS_NO_NEXT'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  ionViewDidLoad(): void {
    this.getNotice();
  }

  // 取得通知
  getNotice(): void {
    this.notices = this.navParams.get('notices');
    if (this.notices != null) {
      this.pages = this.notices.length;
    }
    this.index = this.navParams.get('index');
    this.page = this.index + 1;
    this.notice = {
      title: this.navParams.get('title'),
      info: this.navParams.get('info'),
      beginTime: this.navParams.get('beginTime')
    };
  }

  // 上一页
  previousClk(): void {
    if (this.index < 1) {
      this.toast.show(this.transateContent['HAS_NO_PRESIOUS']);
    } else {
      this.index = this.index - 1;
      this.notice = this.notices[this.index];
      this.page = this.index + 1;
    }
  }

  // 下一页
  nextClk(): void {
    if (this.index >= this.notices.length - 1) {
      this.toast.show(this.transateContent['HAS_NO_NEXT']);
    } else {
      this.index = this.index + 1;
      this.notice = this.notices[this.index];
      this.page = this.index + 1;
    }
  }
}
