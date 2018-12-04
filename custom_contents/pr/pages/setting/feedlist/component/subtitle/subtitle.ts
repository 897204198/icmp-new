import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'feed-subTitle',
  templateUrl: 'subtitle.html'
})
export class subtitleComponent {
  @Input() title: string = ''
  @Input() color: string = ''
  constructor(public navCtrl: NavController) {}
}