import { browser, element, by } from 'protractor';

export class AlertTestService {

  /*
   * 对于弹窗点击确定和取消的封装
   */

  // 点击 alert 的确定
  static clickAlertOK(): void {
    let alertWappers: any = element.all(by.css('.alert-wrapper .button-inner'));
    alertWappers.then(btn => {
      for (let k = 0; k < btn.length; k++) {
        btn[k].getText().then(btnName => {
          if (btnName === '确定') {
            btn[k].click();
            browser.sleep(2000);
          }
        });
      }
    });
  }

  // 点击 alert 的取消
  static clickAlertCancel(): void {
    let alertWappers: any = element.all(by.css('.alert-wrapper .button-inner'));
    alertWappers.then(btn => {
      for (let k = 0; k < btn.length; k++) {
        btn[k].getText().then(btnName => {
          if (btnName === '取消') {
            btn[k].click();
            browser.sleep(2000);
          }
        });
      }
    });
  }

}
