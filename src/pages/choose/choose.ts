import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { WebSocketService } from '../../app/services/webSocket.service';

@Component({
  selector: 'page-choose',
  templateUrl: 'choose.html'
})
export class ChoosePage {
  private condition: boolean = false;
  private chooseName: string = '正在连接socket';
  private connect: boolean = false;
  private slack: boolean = false;
  private chooseStatus: boolean = false;
  private loading: boolean = true;
  private topStatus: boolean = true;
  subObj: any;
  private nameList: object[] = [];
  constructor(private wsService: WebSocketService, private http: Http) {}
  choose() {
    if (!this.condition) {
      return false;
    }
    this.chooseStatus = true;
    this.wsService.sendMessage('/app/lot', 'lot', () => {
      this.condition = false;
      this.chooseName = '正在抽签...';
    });
  }
  ionViewDidEnter(): void {
    if (localStorage.getItem('sock') === '1' && this.wsService.stompClient) {
      this.socket();
    } else {
      this.wsService.connection(localStorage.getItem('token'), () => {
        localStorage.setItem('sock', '1');
        // if (localStorage.getItem('sock') === '1') {
        this.socket();
        // }
      }, () => {
        this.chooseName = 'socket连接失败';
        this.connect = false;
        this.slack = false;
        this.condition = false;
        this.loading = false;
      });
    }
  }
  socket() {
    this.connect = true;
    this.chooseName = '正在连接slack';
    this.wsService.addSubscribe('/topic/lot', (msg) => {
      let value = JSON.parse(msg.body);
      if (value.status === 'PONG') {
        this.condition = true;
        this.slack = true;
        this.topStatus = false;
      }
      if (value.sender) {
        this.nameList.push(value.sender);
        this.condition = true;
        this.chooseStatus = false;
        // this.chooseName = '再次抽签';
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
