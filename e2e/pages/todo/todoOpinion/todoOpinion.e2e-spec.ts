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

  // 办理
  let handleButton: any = element.all(by.id('e2e-handle-button')).get(0);
  // 详情办理
  let banliButton: any = element(by.id('e2e-banli-button'));
  // 提交
  let submitButton: any = element(by.id('e2e-submit-button'));
  let EC = protractor.ExpectedConditions;

  it('待办列表-不填必选项办理', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    TabsTestService.clickTodoTab();
    browser.sleep(2000);
    browser.wait(EC.visibilityOf(handleButton), 5000);
    handleButton.click();
    browser.sleep(2000);
    browser.wait(EC.visibilityOf(banliButton), 5000);
    banliButton.click();
    browser.sleep(3000);
    browser.wait(EC.visibilityOf(submitButton), 5000);
    submitButton.click();
    browser.sleep(2000);
    AlertTestService.clickAlertOK();
    browser.sleep(2000);
    ExpectTestService.checkBrowserTitle('审批意见');
  });

});
