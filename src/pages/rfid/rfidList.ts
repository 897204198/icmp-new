import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../app/services/toast.service';
import { RfidDetailPage } from './rfidDetail';

/**
 * Rfid 链接
 */
@Component({
  selector: 'page-rfidList',
  templateUrl: 'rfidList.html',
})
export class RfidListPage {

  // 标题
  areaTitle: string = '';
  // 资产列表
  itemArray: Array<Object> = [];
  // 全部盘点数据源
  alertData: Object = {};
  // 全部盘点 Code
  assetsNum: Array<string> = [];

  constructor(
    public navCtrl: NavController,
    private toastService: ToastService,
    public navParams: NavParams,
    private http: Http,
    private events: Events,
    public alertCtrl: AlertController,
    private zone: NgZone) {
    this.areaTitle = this.navParams.get('title');
    this.getRfidData();
    this.events.subscribe('rfidStateChange', (id, inventoryState, single_inventory) => {
      for (let i = 0; i < this.itemArray.length; i++) {
        const element = this.itemArray[i];
        if (element['id'] === id) {
          this.itemArray[i]['inventoryState'] = inventoryState;
          this.itemArray[i]['single_inventory'] = single_inventory;
          break;
        }
      }
    });
  }

  // 获取 rfid 列表数据
  getRfidData() {
    let params: URLSearchParams = new URLSearchParams();
    params.append('epcCode', this.navParams.get('epcCode'));
    this.http.post('/webController/getStockOfRFID', params).subscribe((res: Response) => {
      let array: Array<Object> = res.json().result_list;
      this.alertData = res.json().allRfid;
      for (let i = 0; i < array.length; i++) {
        let item: Object = array[i];
        item['index'] = this.itemArray.length + 1;
        this.itemArray.push(item);
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  // 全部盘点
  opinionAllRfid() {
    let alert = this.alertCtrl.create();
    alert.setTitle(this.alertData['title']);
    const array = this.alertData['data'];
    for (let i = 0; i < array.length; i++) {
      const element = array[i];
      alert.addInput({
        type: 'radio',
        label: element.name,
        value: element.id,
        checked: i === 0 ? true : false
      });
    }
    alert.addButton('取消');
    alert.addButton({
      text: '确定',
      handler: data => {
        this.allRfidNetRequest(data);
      }
    });
    alert.present();
  }

  // 全部盘点网络请求
  allRfidNetRequest(type: string) {
    this.assetsNum = [];
    for (let i = 0; i < this.itemArray.length; i++) {
      if (this.itemArray[i]['single_inventory'] === '0' || this.itemArray[i]['single_inventory'] === 0) {
        this.assetsNum.push(this.itemArray[i]['assetsNum']);
      }
    }
    let params: URLSearchParams = new URLSearchParams();
    params.append('type', type);
    params.append('assetsNum', this.assetsNum.toString());
    this.http.post('/webController/saveAllRfid', params).subscribe((res: Response) => {
      for (let i = 0; i < this.itemArray.length; i++) {
        for (let j = 0; j < this.assetsNum.length; j++) {
          const item1 = this.itemArray[i];
          const item2 = this.assetsNum[j];
          if (item1['assetsNum'] === item2) {
            this.itemArray[i]['inventoryState'] = res.json().inventoryState;
          }
        }
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  // 审批 rfid
  dealRfid(item: any) {
    const params: Object = {
      id: item.id,
      assetsNum: item.assetsNum,
      serviceName: item.serviceName
    };
    this.navCtrl.push(RfidDetailPage, params);
  }
}
