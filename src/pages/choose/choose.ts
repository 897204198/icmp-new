import { Component } from '@angular/core';
import { WebSocketService } from '../../app/services/webSocket.service';

@Component({
  selector: 'page-choose',
  templateUrl: 'choose.html'
})
export class ChoosePage {
  private condition: boolean = false;
  private chooseName: string = '准备抽取';
  subObj: any;
  constructor(private wsService: WebSocketService) {}
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
      // console.log(value.status)
      if (value.status === 'PONG') {
        this.condition = true;
      }
      // if (msg.body === 'PONG') {
      //   this.condition = true;
      // }
      if (value.sender) {
        this.chooseName = value.sender;
      }
    }, (obj) => {
      this.subObj = obj;
      this.condition = false;
    });
    this.wsService.sendMessage('/app/lot', 'ping');
  }
  ionViewWillLeave(): void {
    // this.wsService.disconnection();
    this.subObj.unsubscribe();
  }
}
