import { Injectable, Inject } from '@angular/core';
import { APP_CONSTANT, AppConstant } from '../constants/app.constant';
import { Http, Response } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { ToastService } from '../../app/services/toast.service';



@Injectable()
export class InitService {

  constructor(
    private toastService: ToastService,
    @Inject(APP_CONSTANT) private appConstant: AppConstant,
    private http: Http,
    private alertCtrl: AlertController) { }

  // 取得活动消息
  getActivityInfo() {
    let params: Object = {infoType: 'ACTIVITY_INFORMATION'};
    this.http.get('/sys/announcement', { params: params }).subscribe((res: any) => {
      if (res._body != null && res._body !== '') {
        let data = res.json();
        if (data.length > 0) {
          this.alertActivityInfo(data);
        }
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  // 弹出活动消息
  alertActivityInfo(activityList: Object[]) {
    for (let i = 0; i < activityList.length; i++) {
      let activity = activityList[i];
      if (activity['title'] !== '' || activity['info'] !== '') {
        let confirmAlert = this.alertCtrl.create({
          title: activity['title'],
          message: activity['info'],
          buttons: [
            {
              text: '我知道了',
              handler: () => { }
            }
          ]
        });
        confirmAlert.present();
      }
    }
  }
}
