import { Component, ElementRef, OnInit } from '@angular/core';
import {NavController} from 'ionic-angular';
import { ApplicationPage } from '../../../application/application';

@Component({
  selector: 'icmp-plugin-show',
  templateUrl: 'pluginShow.component.html'
})
export class PluginShowComponent implements OnInit {

  pet: string = 'item1';
  showDisplay: boolean;

  /**
   * 构造函数
   */
  constructor(public navCtrl: NavController, private el: ElementRef) {}

  ngOnInit(): void {
    this.showDisplay = true;
    let plugin = this.el.nativeElement.querySelector('#plugin-proxy');
    plugin.className = 'segment segment-md';
  }

  doGoback(): void {
    this.showDisplay = true;
  }

  doClaim(): void {
    this.showDisplay = false;
  }

  doHandle(): void {
    this.navCtrl.push(ApplicationPage);
  }
}
