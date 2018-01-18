import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-create-group',
  templateUrl: 'createGroup.html',
})
export class CreateGroupPage {

  // 群组名
  private groupName: string = '';
  // 国际化文字
  private transateContent: Object;

  /**
   * 构造函数
   */
  constructor(private navCtrl: NavController,
    private toastService: ToastService,
    private http: Http,
    private translate: TranslateService) {
    this.translate.get(['REQUIRE_NOT', 'CREATE_SUCCESS']).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  /**
   * 首次进入页面
   */
  ionViewDidLoad(): void {

  }

  createGroup() {
    if (this.groupName.length === 0) {
      this.toastService.show(this.transateContent['REQUIRE_NOT']);
      return;
    }

    let params = {
      'groupName': this.groupName
    };
    this.http.post('/im/groups', params).subscribe((res: Response) => {
      this.toastService.show(this.transateContent['CREATE_SUCCESS']);
      this.navCtrl.pop();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }
}
