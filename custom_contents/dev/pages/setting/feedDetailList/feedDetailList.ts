import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FeedbackPage } from '../feedback/feedback';
import { FeedDetailPage } from '../feedDetail/feedDetail';
import { HttpService } from '../../../app/services/http.service';

@Component({
  selector: 'page-feedDetailList',
  templateUrl: 'feedDetailList.html'
})
export class FeedDetailListPage {
  private navtitle: string = ''
  private items: object[] = []
  // private tagnum: number = 1
  private id: string = ''
  constructor(public navCtrl: NavController, public navParams: NavParams, private httpService: HttpService) {}
  ionViewDidLoad(): void {
    this.navtitle = this.navParams.get('title')
    this.id = this.navParams.get('id')
    this.httpService.getproblemList(this.id).subscribe((res) => {
      this.items = res.json();
    });
  }
  // do(scroll) {
  //   setTimeout(()=>{
  //     this.tagnum++;
  //     for(let i=1;i<15;i++) {
  //       this.items.push(`第${this.tagnum}组第${i}条数据`)
  //     }
  //     scroll.complete()
  //   }, 500)
  // }
  tofeed() {
    this.navCtrl.push(FeedbackPage)
  }
  todetail(item) {
    this.navCtrl.push(FeedDetailPage, {problemId: item.id})
  }
}
