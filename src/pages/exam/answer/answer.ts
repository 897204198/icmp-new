import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { ExamCustomFramePage } from '../customFrame/customFrame';

@Component({
  selector: 'page-exam-answer',
  templateUrl: 'answer.html',
})
export class ExamAnswerPage {
  examContent: object;

  // 构造函数
  constructor(private navCtrl: NavController,
    private navParams: NavParams,
    private toastService: ToastService,
    private http: Http) {

  }

  // 首次进入页面
  ionViewDidLoad(): void {
    this.getExamContent();
  }

  // 取得考试内容
  getExamContent(): void {
    this.http.get('/exam/content').subscribe((res: Response) => {
      this.examContent = res.json();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  // 跳转到平台页面
  answerClk(): void {
    this.navCtrl.push(ExamCustomFramePage, {type: this.navParams.get('type'), id: this.navParams.get('id')});
  }
}

