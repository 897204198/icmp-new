import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../../../app/service/loginTestService';
import { TabsTestService } from '../../../../app/service/tabsTestService';
import { ExpectTestService } from '../../../../app/service/expectTestService';

describe('关于普日软件页测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  // 关于我们
  let aboutme: any = element(by.id('e2e-aboutme'));
  // 关于普日软件
  let proper: any = element(by.id('e2e-proper'));

  it('查看关于普日软件页面', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    TabsTestService.clickSettingTab();
    browser.sleep(2000);
    aboutme.click();
    browser.sleep(2000);
    proper.click();
    browser.sleep(2000);
    ExpectTestService.checkBrowserTitle('关于普日软件');
  });



});
