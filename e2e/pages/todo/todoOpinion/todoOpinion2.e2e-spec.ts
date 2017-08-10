import { browser, element, by, protractor } from 'protractor';
import { LoginTestService } from '../../../app/service/loginTestService';
import { AlertTestService } from '../../../app/service/alertTestService';
import { TabsTestService } from '../../../app/service/tabsTestService';
import { ExpectTestService } from '../../../app/service/expectTestService';

describe('待办选择测试', () => {

  beforeEach(() => {
    browser.get('');
    browser.ignoreSynchronization = false;
  });

  it('待办列表-填写必选项办理', () => {
    // 办理
    let handleButton: any = element.all(by.id('e2e-handle-button')).get(0);
    // 详情办理
    let banliButton: any = element(by.id('e2e-banli-button'));
    // 提交
    let submitButton: any = element(by.id('e2e-submit-button'));

    let ionSelects: any = element.all(by.css('.e2e-item'));
    let ionOptions: any = element.all(by.css('.alert-tappable,.alert-radio')).get(0);
    let EC = protractor.ExpectedConditions;
    LoginTestService.autoLogin();
    browser.sleep(2000);
    TabsTestService.clickTodoTab();
    browser.sleep(2000);
    browser.wait(EC.visibilityOf(handleButton), 5000);
    handleButton.click();
    browser.sleep(2000);
    browser.wait(EC.visibilityOf(banliButton), 5000);
    banliButton.click();
    browser.sleep(2000);

    ionSelects.then(select => {
      let optionNumber: number = 0;
      while (optionNumber < select.length - 1) {
        browser.sleep(2000);
        browser.wait(EC.visibilityOf(select[optionNumber]), 5000);
        select[optionNumber].click();
        browser.sleep(2000);
        browser.wait(EC.visibilityOf(ionOptions), 5000);
        ionOptions.click();
        browser.sleep(2000);
        AlertTestService.clickAlertOK();
        optionNumber++;
        browser.sleep(2000);
      }
      browser.wait(EC.visibilityOf(submitButton), 5000);
      submitButton.click();
      browser.sleep(2000);
      AlertTestService.clickAlertOK();
      browser.sleep(2000);
      ExpectTestService.checkBrowserTitle('待办列表');
    });

  });

});
