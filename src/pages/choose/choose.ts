import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { WebSocketService } from '../../app/services/webSocket.service';

@Component({
  selector: 'page-choose',
  templateUrl: 'choose.html'
})
export class ChoosePage {
  private condition: boolean = false;
  private chooseName: string = '准备抽取';
  subObj: any;
  private nameList: object[] = [];
  constructor(private wsService: WebSocketService, private http: Http) {}
  choose() {
    this.wsService.sendMessage('/app/lot', 'lot', () => {
      this.condition = false;
      this.chooseName = '正在抽取...';
    });
  }
  ionViewDidEnter(): void {
    if (this.wsService.stompClient) {
      this.socket();
    } else {
      this.wsService.connection(localStorage.getItem('token'), () => {
        this.socket();
      });
    }
  }
  socket() {
    this.wsService.addSubscribe('/topic/lot', (msg) => {
      let value = JSON.parse(msg.body);
      if (value.status === 'PONG') {
        this.condition = true;
      }
      if (value.sender) {
        this.chooseName = '抽取完成';
        this.nameList.push(value.sender);
        this.condition = true;
      }
    }, (obj) => {
      this.subObj = obj;
      // this.condition = true;
    });
    this.wsService.sendMessage('/app/lot', 'ping');
  }
  ionViewWillLeave(): void {
    this.http.put('/disconnect', {}).subscribe(() => {});
    // this.wsService.disconnection();
    this.subObj.unsubscribe();
  }
}