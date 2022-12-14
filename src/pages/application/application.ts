import { Component } from '@angular/core';
import { NavParams, NavController, ModalController } from 'ionic-angular';
import { Http, Response } from '@angular/http';
import { ToastService } from '../../app/services/toast.service';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import { UtilsService } from '../../app/services/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { SearchboxComponent } from '../../app/component/searchbox/searchbox.component';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { DeviceService } from '../../app/services/device.service';
import { PhotoService } from '../../app/services/photo.service';
import { FileService } from '../../app/services/file.service';
import { FileTransferObject, FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer';
import { ConfigsService } from '../../app/services/configs.service';
import { UserInfoState, initUserInfo, UserService } from '../../app/services/user.service';

/**
 * 申请单
 */
@Component({
  selector: 'page-application',
  templateUrl: 'application.html'
})
export class ApplicationPage {

  title: string = '';
  template: Object[] = [];
  input: Object = {};
  inputTemp: Object = {};
  isSubmit: boolean = false;
  deviceType: string = '';
  fileIndex: number = 0;
  fileReIndex: number = 0;
  extra: string = '';
  // 图片列表
  private photoList: any[] = [];
  // 临时图片列表
  private tempPhotoList: any[] = [];
  // 图片 url 数组
  private photoUrlArray: string[] = [];
  // 用户信息（用户名、密码、昵称等）
  private userInfo: UserInfoState = initUserInfo;
  // 是否显示遮罩
  private isShowSpinner: boolean = false;
  private serviceName: string = '';
  private transateContent: Object;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private http: Http,
    private configsService: ConfigsService,
    private transfer: FileTransfer,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
    private translate: TranslateService,
    private deviceService: DeviceService,
    private userService: UserService,
    private fileService: FileService,
    private photoService: PhotoService,
    private toastService: ToastService) {
    let translateKeys: string[] = ['VALI_REQUIRED', 'SUBMIT_SUCCESS', 'SUBMIT_ERROR', 'FILE_GET_ERROR', 'FILE_UPLOAD_ERROR', 'FILE_WAITING', 'PLEASE_INPUT_NUMBER', 'MAX_PHOTO', 'VALI_REQUIRED_IMAGE'];
    this.translate.get(translateKeys).subscribe((res: Object) => {
      this.transateContent = res;
    });
  }

  ionViewDidLoad(): void {
    this.deviceType = this.deviceService.getDeviceInfo().deviceType;
    this.userInfo = this.userService.getUserInfo();
    this.getInitData();
  }

  ionViewDidEnter(): void {
    this.isSubmit = false;
  }

  ionViewWillLeave(): void {
    if (!this.isSubmit) {
      this.clearFile();
    }
  }

  /**
   * 取得初始化数据
   */
  getInitData(): void {
    let params: URLSearchParams = new URLSearchParams();
    params.append('serviceName', this.navParams.get('serviceName'));
    params.append('user', this.navParams.get('assignee'));
    params.append('taskId', this.navParams.get('taskId'));
    params.append('step', this.navParams.get('step'));
    params.append('businessId', this.navParams.get('businessId'));
    if (this.navParams.get('data') != null) {
      let datas = this.navParams.get('data');
      for (let key in datas) {
        if (datas.hasOwnProperty(key)) {
          params.append(key, datas[key]);
        }
      }
    }
    this.http.post('/webController/getApplicationInit', params).subscribe((res: Response) => {
      let data = res.json();
      this.serviceName = data['serviceName'];
      this.title = data['title'];
      this.template = data['template'];
      this.extra = data['extra'];

      for (let i = 0; i < this.template.length; i++) {
        let item = this.template[i];

        if (item['default'] != null && item['type'] !== 'label') {
          this.input[item['model']] = item['default'];
          if (item['type'] === 'checkbox') {
            for (let j = 0; j < item['default'].length; j++) {
              this.inputTemp[item['model'] + '_' + item['default'][j]] = true;
            }
          }
        }
        if (item['defaultId'] != null) {
          this.input[item['model']] = item['defaultId'];
          this.input[item['model'] + 'Name'] = item['defaultName'];
        }
        item['labelBak'] = item['label'];
        item['label'] = this.setRequiredLabel(item);

        if (item['type'] === 'list') {
          for (let j = 0; j < item['components'].length; j++) {
            item['components'][j]['labelBak'] = item['components'][j]['label'];
            item['components'][j]['label'] = this.setRequiredLabel(item['components'][j]);
          }

          if (item['initRow']) {
            this.addListRow(item);
          }
        }
      }
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  calculateFunc(item: any, value: any) {
    if (item.event != null && item.event === 'onchange' && item.func != null) {
      let dateFunc = eval(item.func);
      let result = dateFunc(value);
      for (let i = 0; i < this.template.length; i++) {
        for (let key in result) {
          if (result.hasOwnProperty(key)) {
            if (this.template[i]['elementId'] === key) {
              this.input[this.template[i]['model']] = result[key];
              this.template[i]['default'] = result[key];
              if (result[key] === '1') {
                this.setInputStatus(this.template[i]['model'], 'display');
              } else if (result[key] === '0') {
                this.setInputStatus(this.template[i]['model'], 'hidden');
              }
            }
          }
        }
      }
    }
  }

  /**
   * 设置必填项标签
   */
  setRequiredLabel(item: Object): string {
    let label = item['label'];
    if (item['validator'] != null) {
      for (let j = 0; j < item['validator'].length; j++) {
        if (item['validator'][j]['type'] === 'required') {
          label = item['label'] + '<span style="color: red;">*</span>';
          break;
        }
      }
    }
    return label;
  }

  /**
   * 转换Html格式
   */
  getSafeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  /**
   * 验证表单
   */
  verification(): boolean {
    for (let i = 0; i < this.template.length; i++) {
      let item = this.template[i];
      if (item['validator'] != null && item['status'] !== 'hidden') {
        for (let j = 0; j < item['validator'].length; j++) {
          if (item['validator'][j]['type'] === 'required' && item['type'] !== 'image_list' && (this.input[item['model']] == null || this.input[item['model']] === '')) {
            this.toastService.show(this.transateContent['VALI_REQUIRED']);
            return false;
          } else if (item['type'] === 'image_list' && item['validator'][j]['type'] === 'required') {
            // ios
            if (this.photoList.length === 0 && this.deviceType === 'ios') {
              this.toastService.show(this.transateContent['VALI_REQUIRED_IMAGE']);
              return false;
            // andriod
            } else if (this.inputTemp[item['model']] === 0 || this.inputTemp[item['model']] === undefined) {
              this.toastService.show(this.transateContent['VALI_REQUIRED_IMAGE']);
            }
          }
        }
      } else if (item['type'] === 'list' && item['status'] !== 'hidden') {
        let validatorItems = {};
        for (let j = 0; j < item['components'].length; j++) {
          if (item['components'][j]['validator'] != null && item['components'][j]['validator'].length > 0) {
            validatorItems[item['components'][j]['model']] = item['components'][j]['validator'];
          }
        }
        for (let j = 0; j < this.input[item['model']].length; j++) {
          let data = this.input[item['model']][j];
          for (let key in data) {
            if (data.hasOwnProperty(key)) {
              if (validatorItems[key] != null) {
                for (let k = 0; k < validatorItems[key].length; k++) {
                  if (validatorItems[key][k]['type'] === 'required' && (data[key] == null || data[key] === '')) {
                    this.toastService.show(this.transateContent['VALI_REQUIRED']);
                    return false;
                  }
                }
              }
            }
          }
        }
      }
    }
    return true;
  }
  beforeSubmit () {
    // 没选照片直接上报事件 否则先提交照片，后作为参数一起上传
    if (this.photoList.length === 0) {
      this.submit();
    } else {
      this.imageUpload();
    }
  }
  /**
   * 提交申请
   */
  submit(): void {
    if (this.fileIndex !== this.fileReIndex) {
      this.toastService.show(this.transateContent['FILE_WAITING']);
      return;
    }

    this.isSubmit = true;
    if (this.verification()) {
      let params: URLSearchParams = new URLSearchParams();
      // 如果是修改，则取 getApplicationInit 返回的 serviceName
      if (this.navParams.get('isChange')) {
        params.append('serviceName', this.serviceName);
      } else {
        params.append('serviceName', this.navParams.get('serviceName'));
      }
      params.append('user', this.navParams.get('assignee'));
      params.append('taskId', this.navParams.get('taskId'));
      params.append('step', this.navParams.get('step'));
      params.append('businessId', this.navParams.get('businessId'));
      for (let key in this.input) {
        if (this.input.hasOwnProperty(key)) {
          if (this.input[key] instanceof Array && this.input[key][0] instanceof Object) {
            let data = {};
            for (let i = 0; i < this.input[key].length; i++) {
              let temp = this.input[key][i];
              for (let key2 in temp) {
                if (temp.hasOwnProperty(key2)) {
                  if (data[key2] == null) {
                    data[key2] = [temp[key2]];
                  } else {
                    data[key2].push(temp[key2]);
                  }
                }
              }
            }
            for (let key2 in data) {
              if (data.hasOwnProperty(key2)) {
                params.append(key2, data[key2]);
              }
            }
          } else {
            params.append(key, this.input[key]);
          }
        }
      }
      this.http.post('/webController/saveApplication', params).subscribe((res: Response) => {
        let data = res.json();
        if (data.result === '0') {
          this.toastService.show(this.transateContent['SUBMIT_SUCCESS']);
          this.navCtrl.popToRoot();
        } else {
          this.isSubmit = false;
          if (data.errMsg != null && data.errMsg !== '') {
            this.toastService.show(data.errMsg);
          } else {
            this.toastService.show(this.transateContent['SUBMIT_ERROR']);
          }
        }
      }, (res: Response) => {
        this.isSubmit = false;
        this.toastService.show(res.text());
      });
    } else {
      this.isSubmit = false;
    }
  }

  /**
   * 设置日期控件默认值
   */
  setDatetime(item: Object, index?: number, itemList?: Object): void {
    if (index == null) {
      if (this.input[item['model']] == null || this.input[item['model']] === '') {
        this.input[item['model']] = this.utilsService.formatDate(new Date(), item['format']);
      }
    } else {
      let data = this.input[item['model']][index];
      if (data[itemList['model']] == null || data[itemList['model']] === '') {
        data[itemList['model']] = this.utilsService.formatDate(new Date(), itemList['format']);
      }
    }
  }

  /**
   * 清空日期控件
   */
  clearDatetime(item: Object, index?: number, itemList?: Object): void {
    if (index == null) {
      this.input[item['model']] = '';
    } else {
      this.input[item['model']][index][itemList['model']] = '';
    }
  }

  /**
   * 选择框
   */
  searchboxSelect(item: Object, index?: number, itemList?: Object): void {
    let params: Object = {};
    if (index == null) {
      let multiple: boolean = (item['category'] === 'multi');
      let searchUrl = item['searchUrl'];
      params = { 'title': item['labelBak'], 'multiple': multiple, 'searchUrl': searchUrl, 'id': this.input[item['model']], 'name': this.input[item['model'] + 'Name'] };
    } else {
      let multiple: boolean = (itemList['category'] === 'multi');
      let searchUrl = itemList['searchUrl'];
      params = { 'title': itemList['labelBak'], 'multiple': multiple, 'searchUrl': searchUrl, 'id': this.input[item['model']][index][itemList['model']], 'name': this.input[item['model']][index][itemList['model'] + 'Name'] };
    }
    let modal = this.modalCtrl.create(SearchboxComponent, params);
    modal.onDidDismiss(data => {
      if (data != null) {
        if (index == null) {
          this.input[item['model'] + 'Name'] = data.name;
          this.input[item['model']] = data.id;
          this.searchboxChange(item);
        } else {
          this.input[item['model']][index][itemList['model'] + 'Name'] = data.name;
          this.input[item['model']][index][itemList['model']] = data.id;
          this.searchboxChange(item, index, itemList);
        }
        this.setControl(item, data);
      }
    });
    modal.present();
  }

  /**
   * 设置checkbox选择值
   */
  setCheckValue(item: Object, option: Object): void {
    let values: string[] = [];
    for (let key in this.inputTemp) {
      if (this.inputTemp.hasOwnProperty(key)) {
        if (this.inputTemp[key] && key.indexOf(item['model']) === 0) {
          values.push(key.split('_')[1]);
        }
      }
    }
    this.input[item['model']] = values;
    this.setControl(item, option);
  }

  /**
   * 下拉选择事件
   */
  selectChange(item: Object): void {
    let data = item['data'];
    for (let i = 0; i < data.length; i++) {
      this.setControl(item, data[i]);
    }
    if (this.input[item['latModel']]) {
      if (this.input[item['model']] && this.input[item['latModel']]) {
        let params: URLSearchParams = new URLSearchParams();
        params.append('patient', this.input[item['model']]);
        params.append('num', this.input[item['latModel']]);
        for (const value of this.template) {
          if (item['latModel'] === value['model']) {
            this.inputData(value, params);
          }
        }
      }
    }
  }

  /**
   * 选择器选择事件
   */
  searchboxChange(item: Object, index?: number, itemList?: Object): void {
    if (index == null) {
      this.setControl(item, item);
    } else {
      this.setControl(itemList, itemList, index, item);
    }
  }

  /**
   * 单选选择事件
   */
  radioChange(item: Object): void {
    let data = item['data'];
    for (let i = 0; i < data.length; i++) {
      this.setControl(item, data[i]);
    }
  }

  /**
   * inputs失去焦点事件
   */
  onBlur(value: string, item: Object): void {
    value = value.replace(/[^0-9]/g, '').substring(0, 7);
    if (value.length < 7 && value.length !== 0) {
      let len = 7 - value.length;
      for (let i = 0; i < len; i++) {
        value = 0 + value;
      }
    }
    this.input[item['model']] = value;
    if (this.input[item['model']] && this.input[item['preModel']]) {
      let params: URLSearchParams = new URLSearchParams();
      params.append('patient', this.input[item['preModel']]);
      params.append('num', this.input[item['model']]);
      this.inputData(item, params);
    }
  }

  /**
   * 获取inputData
   */
  inputData(item: Object, params): void {
    this.http.post(item['inputUrl'], params).subscribe((res: Response) => {
      let data = res.json();
      this.setControl(item, data);
    }, (res: Response) => {
      this.toastService.show(res.text());
    });
  }

  /**
   * 设置控制事件
   */
  setControl(item: Object, option: Object, index?: number, itemParent?: Object): void {
    if (option['controls'] != null) {
      for (let j = 0; j < option['controls'].length; j++) {
        let control = option['controls'][j];
        if (control['type'] === 'display') {
          if (this.input[item['model']] != null && this.input[item['model']].indexOf(option['id']) >= 0) {
            for (let k = 0; k < control.models.length; k++) {
              this.setInputStatus(control.models[k], 'display');
            }
          } else {
            for (let k = 0; k < control.models.length; k++) {
              let flg = true;
              a: for (let m = 0; m < item['data'].length; m++) {
                if (this.input[item['model']] != null && this.input[item['model']].indexOf(item['data'][m]['id']) >= 0) {
                  if (item['data'][m]['controls'] != null) {
                    for (let n = 0; n < item['data'][m]['controls'].length; n++) {
                      if (item['data'][m]['controls'][n]['type'] === 'display') {
                        for (let z = 0; z < item['data'][m]['controls'][n]['models'].length; z++) {
                          if (item['data'][m]['controls'][n]['models'][z] === control.models[k]) {
                            flg = false;
                            break a;
                          }
                        }
                      }
                    }
                  }
                }
              }
              if (flg) {
                this.setInputStatus(control.models[k], 'hidden');
              }
            }
          }
        } else if (control['type'] === 'setValue') {
          let flg: boolean = false;
          if (item['type'] === 'date' || item['type'] === 'searchbox') {
            flg = true;
          } else {
            if (index == null) {
              if (this.input[item['model']] != null && this.input[item['model']].indexOf(option['id']) >= 0) {
                flg = true;
              }
            } else {
              if (this.input[itemParent['model']][index][item['model']] != null && this.input[itemParent['model']][index][item['model']].indexOf(option['id']) >= 0) {
                flg = true;
              }
            }
          }
          if (flg) {
            for (let k = 0; k < control.data.length; k++) {
              let data = control.data[k];
              if (data['calculate'] != null) {
                if (data['calculate'] === 'YearDifferToday') {
                  let startDate: Date = null;
                  if (this.input[item['model']] != null && this.input[item['model']] !== '') {
                    startDate = new Date(this.input[item['model']]);
                  }
                  if (index == null) {
                    this.input[data['model']] = this.utilsService.getDifferYears(startDate, new Date());
                  } else {
                    this.input[itemParent['model']][index][data['model']] = this.utilsService.getDifferYears(startDate, new Date());
                  }
                }
              } else {
                if (index == null) {
                  this.input[data['model']] = data['value'];
                } else {
                  this.input[itemParent['model']][index][data['model']] = data['value'];
                }
              }
            }
          }
        } else if (control['type'] === 'initSelect') {
          let flg: boolean = false;
          if (item['type'] === 'date' || item['type'] === 'searchbox' || (item['inputUrl'] && this.input[item['model']])) {
            flg = true;
          } else {
            if (index == null) {
              if (this.input[item['model']] != null && this.input[item['model']].indexOf(option['id']) >= 0) {
                flg = true;
              }
            } else {
              if (this.input[itemParent['model']][index][item['model']] != null && this.input[itemParent['model']][index][item['model']].indexOf(option['id']) >= 0) {
                flg = true;
              }
            }
          }
          if (flg) {
            let url = control['url'];
            let params: URLSearchParams = new URLSearchParams();
            params.append('serviceName', this.navParams.get('serviceName'));
            if (index == null) {
              params.append('id', this.input[item['model']]);
            } else {
              params.append('id', this.input[itemParent['model']][index][item['model']]);
            }
            this.http.post(url, params).subscribe((res: Response) => {
              let data = res.json().result_list;
              if (index == null) {
                for (let k = 0; k < this.template.length; k++) {
                  if (this.template[k]['model'] === control['model']) {
                    if (this.template[k]['type'] === 'text') {
                      this.input[this.template[k]['model']] = data;
                    } else {
                      this.template[k]['data'] = data;
                    }
                    break;
                  }
                }
              } else {
                for (let k = 0; k < this.inputTemp[itemParent['model'] + 'Components'][index].length; k++) {
                  let itemTmp = this.inputTemp[itemParent['model'] + 'Components'][index][k];
                  if (itemTmp['model'] === control['model']) {
                    itemTmp['data'] = data;
                  }
                }
              }
            }, (res: Response) => {
              this.toastService.show(res.text());
            });
          } else {
            if (index == null) {
              for (let k = 0; k < this.template.length; k++) {
                if (this.template[k]['model'] === control['model']) {
                  this.template[k]['data'] = [];
                  break;
                }
              }
            } else {
              for (let k = 0; k < this.inputTemp[itemParent['model'] + 'Components'][index].length; k++) {
                let itemTmp = this.inputTemp[itemParent['model'] + 'Components'][index][k];
                if (itemTmp['model'] === control['model']) {
                  itemTmp['data'] = [];
                }
              }
            }
          }
        }
      }
    }
  }

  /**
   * 设置表单控件状态
   */
  setInputStatus(model: string, status: string): void {
    for (let i = 0; i < this.template.length; i++) {
      if (this.template[i]['model'] === model) {
        this.template[i]['status'] = status;
        if (status === 'hidden') {
          this.input[model] = null;
          this.inputTemp[model + 'Components'] = null;
          if (this.template[i]['type'] === 'searchbox') {
            this.input[model + 'Name'] = null;
          }
        } else {
          if (this.template[i]['type'] === 'list' && this.template[i]['initRow']) {
            if (this.input[this.template[i]['model']] == null) {
              this.addListRow(this.template[i]);
            }
          }
          if (this.template[i]['type'] === 'radio') {
            this.input[model] = this.template[i]['default'];
          }
        }
        break;
      }
    }
  }

  /**
   * 嵌套表格添加行
   */
  addListRow(item: Object, flag?: string): void {
    if (flag === 'click') {
      let hash = {};
      item['components'] = item['components'].reduce((ite, next) => {
        if (hash[next.model]) {
          hash[next.model] = '';
        } else {
          hash[next.model] = true && ite.push(next);
        }
        return ite;
      }, []);
      let listItem = {};
      for (let j = 0; j < item['components'].length; j++) {
        let component = item['components'][j];
        if (component['type'] === 'searchbox' || component['type'] === 'select') {
          listItem[component['model']] = null;
          listItem[component['model'] + 'Name'] = null;
        } else {
          listItem[component['model']] = null;
        }
      }
      if (this.input[item['model']] == null) {
        this.input[item['model']] = [];
      }
      this.input[item['model']].push(listItem);

      let itemComponents = [];
      for (let j = 0; j < item['components'].length; j++) {
        itemComponents.push({ ...item['components'][j] });
      }
      if (this.inputTemp[item['model'] + 'Components'] == null) {
        this.inputTemp[item['model'] + 'Components'] = [];
      }
      this.inputTemp[item['model'] + 'Components'].push(itemComponents);
    } else {
      let tempArray = [];
      let index = [];
      let listItemArray = [];
      for (let i = 0; i < item['components'].length; i++) {
        if (item['components'][0]['model'] === item['components'][i]['model']) {
          index.push(i);
        }
      }
      index.push(-1);
      for (let j = 0; j < index.length - 1; j++) {
        if (index[j + 1] === -1) {
          tempArray.push(item['components'].slice(index[j]));
        } else {
          tempArray.push(item['components'].slice(index[j], index[j + 1]));
        }
      }
      for (let i = 0; i < tempArray.length; i++) {
        let listItem = new Object();
        for (let j = 0; j < tempArray[i].length; j++) {
          let component = tempArray[i][j];
          if (component['type'] === 'searchbox' || component['type'] === 'select') {
            listItem[component['model']] = component['defaultId'];
            listItem[component['model'] + 'Name'] = component['defaultName'];
          } else {
            listItem[component['model']] = component['default'];
          }
        }
        listItemArray.push(listItem);
      }
      if (this.input[item['model']] == null) {
        this.input[item['model']] = [];
      }
      for (let i = 0; i < listItemArray.length; i++) {
        this.input[item['model']].push(listItemArray[i]);
      }
      if (this.inputTemp[item['model'] + 'Components'] == null) {
        this.inputTemp[item['model'] + 'Components'] = [];
      }
      this.inputTemp[item['model'] + 'Components'] = tempArray;
    }
  }

  /**
   * 嵌套表格删除行
   */
  deleteListRow(item: Object, iList: number): void {
    this.input[item['model']].splice(iList, 1);
    this.inputTemp[item['model'] + 'Components'].splice(iList, 1);
    this.calculateFunc(item, this.input);
  }

  /**
   * 选择附件
   */
  fileChoose(item: Object): void {
    this.fileChooser.open().then((uri) => {
      this.fileIndex++;
      this.filePath.resolveNativePath(uri).then((filePath) => {
        let file: Object = {
          name: filePath.substr(filePath.lastIndexOf('/') + 1),
          type: 'file'
        };
        if (this.inputTemp[item['model']] == null) {
          this.inputTemp[item['model']] = [file];
        } else {
          this.inputTemp[item['model']].push(file);
        }
        this.uploadFile(filePath, item, file);
      }, () => {
        this.toastService.show(this.transateContent['FILE_UPLOAD_ERROR']);
        this.fileReIndex++;
      });
    });
  }

  /**
   * 上传文件
   */
  uploadFile(filePath: string, item: Object, file: Object): void {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: filePath.substr(filePath.lastIndexOf('/') + 1),
      mimeType: 'multipart/form-data'
    };
    let upUrl = '';
    if (!JSON.parse(localStorage.getItem('stopStreamline'))) {
      upUrl = this.configsService.getBaseUrl() + '/webController/uploadFile?loginName=' + this.userInfo.loginName + '&service_key=' + localStorage['serviceheader'];
    } else {
      // 不使用streamline
      upUrl = this.configsService.getMobileplatformUrl() + '/webController/uploadFile?loginName=' + this.userInfo.loginName + '&service_key=' + localStorage['serviceheader'];
    }
    fileTransfer.upload(filePath, upUrl, options).then((data) => {
      if (this.input[item['model']] == null) {
        this.input[item['model']] = [data.response];
      } else {
        this.input[item['model']].push(data.response);
      }
      this.fileReIndex++;
      file['id'] = data.response;
    }, () => {
      this.toastService.show(this.transateContent['FILE_GET_ERROR']);
      this.deleteFile(item, file);
      this.fileReIndex++;
    });
  }

  /**
   * 删除文件
   */
  deleteFile(item: Object, file: Object): void {
    if (file['id'] != null && file['id'] !== '') {
      let params: URLSearchParams = new URLSearchParams();
      params.append('fileId', file['id']);
      this.http.post('/webController/deleteFile', params).subscribe((res: Response) => { });
      if (this.input[item['model']] != null) {
        for (let i = 0; i < this.input[item['model']].length; i++) {
          if (this.input[item['model']][i] === file['id']) {
            this.input[item['model']].splice(i, 1);
            break;
          }
        }
      }
    }
    for (let i = 0; this.inputTemp[item['model']].length; i++) {
      if (file === this.inputTemp[item['model']][i]) {
        this.inputTemp[item['model']].splice(i, 1);
        break;
      }
    }
  }

  /**
   * 清空未提交的附件
   */
  clearFile(): void {
    for (let i = 0; i < this.template.length; i++) {
      let item = this.template[i];
      if ((item['type'] === 'file' || item['type'] === 'image_list') && this.input[item['model']] != null && this.input[item['model']].length > 0) {
        let params: URLSearchParams = new URLSearchParams();
        params.append('fileId', this.input[item['model']].join(','));
        this.http.post('/webController/deleteFile', params).subscribe((res: Response) => { });
      }
    }
  }

  /**
   * 设置列表下拉菜单头
   */
  getListSelectOptions(item: Object): Object {
    return {
      title: item['labelBak']
    };
  }

  // 拍照获取图片
  getPhotoFromCamera(iamgeType?: string, item?: object) {
    this.photoService.getPictureByCamera({
      destinationType: 1
    }).subscribe(img => {
      let imageInfo: Object = {
        imageUrl: img,
        imageName: this.utilsService.formatDate(new Date(), 'YYYYMMDDHHmmss') + '.' + this.fileService.getFileType(img),
        type: 'image'
      };
      if (iamgeType === 'imageList' ) {
        this.tempPhotoList.splice(0, this.tempPhotoList.length);        // 清空临时图片列表
        this.tempPhotoList.push(imageInfo);
        this.tempImageUpload(item);
      } else {
        this.photoList.push(imageInfo);
      }
    });
  }
  // 侧滑删除图片
  deletePhoto(photo: any) {
    let index = this.photoList.indexOf(photo);
    this.photoList.splice(index, 1);
  }
  tempImageUpload(item) {
    // 清空照片 url
    this.photoUrlArray.splice(0, this.photoUrlArray.length);
     /* 图片上传 */
     const fileTransfer: FileTransferObject = this.transfer.create();
     for (let i = 0; i < this.tempPhotoList.length; i++) {
      if (this.inputTemp[item['model']] == null) {
        this.inputTemp[item['model']] = [this.tempPhotoList[i]];
      } else {
        this.inputTemp[item['model']].push(this.tempPhotoList[i]);
      }
       let options: FileUploadOptions = {
         fileKey: 'file',
         fileName: this.tempPhotoList[i]['imageName'],
         mimeType: 'multipart/form-data'
       };
       let upUrl = '';
       if (!JSON.parse(localStorage.getItem('stopStreamline'))) {
          upUrl = this.configsService.getBaseUrl() + '/webController/uploadFile?loginName=' + this.userInfo.loginName + '&service_key=' + localStorage['serviceheader'];
       } else {
          // 不使用streamline
          upUrl = this.configsService.getMobileplatformUrl() + '/webController/uploadFile?loginName=' + this.userInfo.loginName + '&service_key=' + localStorage['serviceheader'];
       }
       fileTransfer.upload(this.tempPhotoList[i]['imageUrl'], upUrl, options)
         .then((data) => {
           // 每传一张图，就往 photoUrlArray 添加一张
           this.photoUrlArray.push(data.response);
           this.tempPhotoList[i]['id'] = data.response;
           // 判断图片是否已经全部上传完
           if (this.photoUrlArray.length === this.tempPhotoList.length) {
             if (this.input['fileId'] === undefined || this.input['fileId'].length === 0 ) {
              this.input['fileId'] = [...this.photoUrlArray];
            } else {
              this.input['fileId'] = [...this.photoUrlArray, ...this.input['fileId']];
             }
             this.isShowSpinner = false;
           }
         }, (err) => {
           this.toastService.show(err.text());
         });
        }
  }
  // 照片上传
  imageUpload() {
    // 照片超过9个给提示
    if (this.photoList.length > 9) {
      this.toastService.show(this.transateContent['MAX_PHOTO']);
      return false;
    }
    // 清空照片 url
    this.photoUrlArray.splice(0, this.photoUrlArray.length);
    // 显示遮罩
    this.isShowSpinner = true;

    /* 图片上传 */
    const fileTransfer: FileTransferObject = this.transfer.create();
    for (let i = 0; i < this.photoList.length; i++) {
      let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: this.photoList[i]['imageName'],
        mimeType: 'multipart/form-data'
      };
      let upUrl = '';
      if (!JSON.parse(localStorage.getItem('stopStreamline'))) {
        upUrl = this.configsService.getBaseUrl() + '/webController/uploadFile?loginName=' + this.userInfo.loginName + '&service_key=' + localStorage['serviceheader'];
      } else {
        // 不使用streamline
        upUrl = this.configsService.getMobileplatformUrl() + '/webController/uploadFile?loginName=' + this.userInfo.loginName + '&service_key=' + localStorage['serviceheader'];
      }
      fileTransfer.upload(this.photoList[i]['imageUrl'], upUrl, options)
        .then((data) => {
          // 每传一张图，就往 photoUrlArray 添加一张
          this.photoUrlArray.push(data.response);
          // 判断图片是否已经全部上传完
          if (this.photoUrlArray.length === this.photoList.length) {
            this.input['fileId'] = this.photoUrlArray;
            this.isShowSpinner = false;
            this.submit();
          }
        }, (err) => {
          this.toastService.show(err.text());
        });
    }
  }
  // 从相册获取图片
  getPhotoFromAlbum() {
    this.photoService.getMultiplePicture({
      destinationType: 1
    }).subscribe(img => {
      // 从数组中取图片
      for (let i = 0; i < img.length; i++) {
        let imageInfo: Object = {};
        imageInfo['imageUrl'] = img[i];
        imageInfo['imageName'] = this.utilsService.formatDate(new Date(), 'YYYYMMDDHHmmss') + i + '.' + this.fileService.getFileType(img[i]);
        this.photoList.push(imageInfo);
      }

    });
  }
}
