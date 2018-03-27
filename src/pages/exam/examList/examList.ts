import { Component, ViewChild } from '@angular/core';
import { NavController, Content, Refresher } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../../app/services/toast.service';
import { ExamCustomFramePage } from '../customFrame/customFrame';
import { ExamAnswerPage } from '../answer/answer';

@Component({
  selector: 'page-exam-list',
  templateUrl: 'examList.html',
})
export class ExamListPage {
  @ViewChild(Content) content: Content;
  @ViewChild(Refresher) refresher: Refresher;
  examList: object;
  examListType: object[];
  selectExamListType: string = '0';
  canAnswer: boolean;
  // 时分秒
  hour: number = 0;
  minute: number = 0;
  second: number = 0;
  // 定时器
  timer: any = null;

  // 构造函数
  constructor(private navCtrl: NavController,
    private toastService: ToastService,
    private http: Http) {
    this.examListType = [
      {code: '0', name: '未考试'},
      {code: '1', name: '在考试'},
      {code: '2', name: '已交巻'},
      {code: '3', name: '已阅卷'}
    ];
  }

  // 每次进入页面
  ionViewDidEnter(): void {
    this.getExamList(this.selectExamListType);
  }

  ngOnDestroy() {
    if (this.timer) {
     clearInterval(this.timer);
    }
   }

  // 类型切换
  examListTypeChange(): void {
    this.content.scrollToTop();
    this.getExamList(this.selectExamListType);
  }

  // 更新倒计时
  updateTime(): void {
    if (this.hour <= 0 && this.minute <= 0 && this.second <= 1) {
      this.canAnswer = false;
      clearInterval(this.timer);
    }
    if (this.second === 0 && this.minute > 0) {
      --this.minute;
      this.second = 59;
    } else if (this.second === 0 && this.minute === 0 && this.hour > 0) {
      --this.hour;
      this.second = 59;
      this.minute = 59;
    } else {
      --this.second;
    }
  }

  // 取得考试内容
  getExamList(type): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.http.get('/exam/list/' + type).finally(() => {
      if (this.refresher.state !== 'inactive') {
        this.refresher.complete();
      }
    }).subscribe((res: Response) => {
      this.examList = res.json();
      if (type === '1') {
        this.hour = this.examList[0].countDown[0];
        this.minute = this.examList[0].countDown[1];
        this.second = this.examList[0].countDown[2];
        if (this.hour > 0 || this.minute > 0 || this.second > 0) {
          this.canAnswer = true;
          this.timer = setInterval(() => {
            this.updateTime();
          }, 1000);
        } else {
          this.canAnswer = false;
        }
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  // 跳转到平台页面
  goExamPage(item): void {
    if (this.selectExamListType === '0') {
      this.navCtrl.push(ExamAnswerPage, {type: this.selectExamListType, id: item.id});
    } else if (this.selectExamListType === '1'){
      if (this.canAnswer) {
        clearInterval(this.timer);
        this.navCtrl.push(ExamCustomFramePage, {type: this.selectExamListType, id: item.id});
      } else {
        this.toastService.show('答题时间结束');
      }
    } else {
      this.navCtrl.push(ExamCustomFramePage, {type: this.selectExamListType, id: item.id});
    }
  }
}

