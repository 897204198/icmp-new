import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../../app/service/loginTestService';
import { TabsTestService } from '../../../app/service/tabsTestService';
import { ExpectTestService } from '../../../app/service/expectTestService';

describe('待办列表测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  // 签收
  let claimButton: any = element.all(by.id('e2e-claim-button')).get(0);
  // 退回
  let gobackButton: any = element.all(by.id('e2e-goback-button')).get(0);

  it('待办列表-签收和退回', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    TabsTestService.clickTodoTab();
    browser.sleep(2000);
    claimButton.click();
    browser.sleep(2000);
    gobackButton.click();
    browser.sleep(2000);
    ExpectTestService.checkBrowserTitle('待办列表');
  });

});
