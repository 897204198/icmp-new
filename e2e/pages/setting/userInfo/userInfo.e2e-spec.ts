import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../../app/service/loginTestService';
import { TabsTestService } from '../../../app/service/tabsTestService';
import { ExpectTestService } from '../../../app/service/expectTestService';

describe('用户信息页测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  // 用户信息
  let userinfo: any = element(by.id('e2e-userinfo'));

  it('查看用户信息页面', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    TabsTestService.clickSettingTab();
    browser.sleep(2000);
    userinfo.click();
    browser.sleep(2000);
    ExpectTestService.checkBrowserTitle('个人资料');
  });

});
