import { Component, ElementRef } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../app/services/toast.service';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import echarts from 'echarts';
import { SearchboxComponent } from '../../app/component/searchbox/searchbox.component';

/**
 * 统计查询页面
 */
@Component({
  selector: 'page-emergency-treatment',
  templateUrl: 'emergencyTreatment.html',
})
export class EmergencyTreatmentPage {
  title: string = '';
  statisticsDate: Object = {};
  searchData: Object = {};
  // 是否为自定义
  isCustom: boolean = false;
  startDate: string = '';
  endDate: string = '';
  private isShow: boolean = false;

  constructor(public navParams: NavParams,
    private http: Http,
    private el: ElementRef,
    private sanitizer: DomSanitizer,
    private modalCtrl: ModalController,
    private toastService: ToastService) { }

  ionViewDidLoad(): void {
    this.title = this.navParams.get('name');
    this.getInitData();
    let u = navigator.userAgent;
    this.isShow = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  }

  /**
   * 取得初始化数据
   */
  getInitData(item?: Object) {
    if (item && item['controls'] && item['controls']['model']) {
      this.searchData[item['controls']['model']] = item['controls']['value'];
      this.searchData[item['controls']['model'] + 'Name'] = item['controls']['name'];
    }
    let params: URLSearchParams = new URLSearchParams();
    params.append('serviceName', this.navParams.get('serviceName'));
    let datas = this.navParams.get('data');
    if ( datas != null) {
      for (let key in datas) {
        if (datas.hasOwnProperty(key)) {
          params.append(key, datas[key]);
        }
      }
    }
    if (datas['queryCondition'] != null) {
      this.searchData = datas['queryCondition'];
      if (this.isCustom) {
        if (this.startDate.length === 0 || this.endDate.length === 0) {
          this.toastService.show('请选择时间');
          return;
        } else if (this.dateCompare(this.startDate, this.endDate)) {
          this.toastService.show('请选择正确时间');
          return;
        } else {
          params.append('startDate', this.startDate);
          params.append('endDate', this.endDate);
        }
      }
      for (let key in this.searchData) {
        if (this.searchData.hasOwnProperty(key)) {
          params.append(key, this.searchData[key]);
        }
      }
    }
    this.http.post('/webController/getStatisticsData', params).subscribe((res: Response) => {
      this.statisticsDate = res.json();
      if (Object.keys(this.statisticsDate).length > 0) {
        const components = this.statisticsDate['components'];
        for (let i = 0; i < components.length; i++) {
          if (components[i]['type'] === 'charts' && components[i]['content']) {
            const data = components[i]['content'];
            if (data['height'] == null || data['height'] === '') {
              components[i]['content']['height'] = '300px';
            }
            this.createChart(i, components[i]['content']['json']);
          }
          // 补充[占位]配合table_tr
          if (components[i]['type'] === 'table' && !components[i]['align']) {
            const myHeaders = components[i]['content']['headers'][0]['text'];
            if (myHeaders != null && myHeaders === '') {
              components[i]['content']['headers'][0]['text'] = '占位';
            }
          }
        }
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 转换Html格式
   */
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * 查询框选择
   */
  searchboxSelect(item: Object): void {
    let multiple: boolean = item['control_more'];
    let searchUrl = item['search_url'];
    if (item['control_type'] === 'select_person') {
      searchUrl = '/webController/searchPerson';
    }
    let params: Object = { 'title': item['control_label'], 'multiple': multiple, 'searchUrl': searchUrl };
    let modal = this.modalCtrl.create(SearchboxComponent, params);
    modal.onDidDismiss(data => {
      if (data != null) {
        this.searchData[item['control_name'] + 'Name'] = data.name;
        this.searchData[item['control_name']] = data.id;
        if (data['controls'] && data['controls']['model']) {
          this.searchData[data['controls']['model']] = data['controls']['value'];
          this.searchData[data['controls']['model'] + 'Name'] = data['controls']['name'];
        }
      }
    });
    modal.present();
  }

  /**
   * 创建统计图
   */
  createChart(index: number, json: Object): void {
    setTimeout(() => {
      let myChart = echarts.init(this.el.nativeElement.querySelector('#chart_' + index));
      myChart.setOption(json);
    }, 500);
  }

  // radio 点击事件
  changeRadio(option: Object) {
    this.isCustom = option['id'] === 'custom' ? true : false;
    if (this.isCustom !== true) {
      this.getInitData();
    }
  }


  // 比较时间
  dateCompare(startDate: string, endDate: string) {
    let aStart = startDate.split('-'); // 转成成数组，分别为年，月，日，下同
    let aEnd = endDate.split('-');
    let startDateTemp = aStart[0] + '/' + aStart[1] + '/' + aStart[2];
    let endDateTemp = aEnd[0] + '/' + aEnd[1] + '/' + aEnd[2];
    if (startDateTemp > endDateTemp) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 清空日期控件
   */
  clearStartDatetime(item: Object): void {
    this.startDate = '';
  }
    /**
   * 清空日期控件
   */
  clearEndDatetime(item: Object): void {
    this.endDate = '';
  }
}
