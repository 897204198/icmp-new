import { Component, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';

@Component({
  selector: 'page-exam-answer',
  templateUrl: 'answer.html',
})
export class ExamAnswerPage {
  examContent: object;

  // 构造函数
  constructor(private navCtrl: NavController,
    private elementref: ElementRef,
    private toastService: ToastService,
    private http: Http) {

  }

  // 首次进入页面
  ionViewDidLoad(): void {
    this.getExamContent();
  }

  // 取得考试内容
  getExamContent(): void {
    this.http.get('/exam/question').subscribe((res: Response) => {
      this.examContent = res.json();
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

}

