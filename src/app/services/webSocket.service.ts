import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Observable';
// import { observable } from "rxjs/symbol/observable";
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import { ConfigsService } from '../services/configs.service';
@Injectable()

export class WebSocketService {
  socket: any;
  stompClient: any;
  headers: any = {
    PEP_STOMP_TOKEN: localStorage.getItem('token'),
    PEP_STOMP_USER: JSON.parse(window.atob(localStorage.getItem('token').split('.')[0])).id
  };
  constructor(private configService: ConfigsService) {}

  connection(fn) {
    // const token = 'eyJpZCI6ImMzYjU2MDZjLTMyNGQtNDI4Ny1hMDY5LTJhZGY5YjU5Y2ZkZSIsIm5hbWUiOiJsaWh1aXlhbiAifQ.eyJuYW1lIjoi5Yav6Imz546yIiwiaGFzUm9sZSI6ZmFsc2V9.7uN-TIQZ9i2ELuv6uXtjLdKm9lV4HdAawWnl3-AMong';
    const token = localStorage.getItem('token');
    // let socket = new SockJs(this.configService.getBaseUrl() + '/stomp?access_token=' + token);
    let socket = new SockJs(this.configService.getBaseUrl() + '/stomp?access_token=' + token);
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect(this.headers, fn
    //   () => {
    //   console.log('连接成功');
    //   // this.stompClient.subscribe('/topic/lot', (msg) => { // 订阅服务端提供的某个topic
    //   //   console.log('广播成功');
    //   //   console.log(msg);  // msg.body存放的是服务端发送给我们的信息
    //   //   // if (msg.body === 'PONG') {
    //   //   //   this.stompClient.send('/app/lot', this.headers, 'lot');
    //   //   // }
    //   // }, this.headers);
    //   // this.stompClient.send('/app/lot',
    //   //   this.headers,
    //   //   'ping',
    //   // );
    // }
    , (err) => {
      console.log('连接失败');
      console.log(err);
    });
  }
  addSubscribe(url: string, callback, fn) {
    let subObj = this.stompClient.subscribe(url, callback, this.headers);
    fn(subObj);
  }
  sendMessage(url: string, msg: string, fn?) {
    if (fn) {
      fn();
    }
    this.stompClient.send(url, this.headers, msg);
  }
  unSubscribe(obj) {
    obj.unsubscribe();
  }
  disconnection() {
    if (this.stompClient) {
      this.stompClient.disconnect();
      console.log('Disconnected');
    }
  }
}
