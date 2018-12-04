import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FeedDetailListPage } from '../feedDetailList/feedDetailList';
import { FeedDetailPage } from '../feedDetail/feedDetail';
import { HttpService } from '../../../app/services/http.service';

@Component({
  selector: 'page-feedlist',
  templateUrl: 'feedlist.html'
})
export class FeedlistPage {
  menus : Object[] = []
  news : Object[] = []
  constructor(public navCtrl: NavController, private httpService: HttpService) {}

  // 取得类型
  getcategory(): void {
    this.httpService.getcategory().subscribe((res) => {
      this.menus = res.json();
      console.log(res.json())
    });
  }
  getproblem(): void {
    this.httpService.getproblem().subscribe((res) => {
      this.news = res.json();
      console.log(res.json())
    });
  }
  ionViewDidEnter(): void {
    this.getcategory();
    this.getproblem();
  }
  todetaillist(menu): void {
    this.navCtrl.push(FeedDetailListPage, {title: menu.name, id: menu.id})
  }
  todetail(item) {
    this.navCtrl.push(FeedDetailPage, {problemId: item.id})
  }
}