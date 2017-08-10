import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../app/service/loginTestService';
import { TabsTestService } from '../../app/service/tabsTestService';
import { ExpectTestService } from '../../app/service/expectTestService';

describe('更多页测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  // 检查更新
  let checkversion: any = element(by.id('e2e-checkversion'));

  it('查看更多页面', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    TabsTestService.clickSettingTab();
    browser.sleep(2000);
    ExpectTestService.checkBrowserTitle('更多');
  });

  it('检查更新', () => {

    TabsTestService.clickSettingTab();
    browser.sleep(2000);
    checkversion.click();
    browser.sleep(2000);
    ExpectTestService.checkBrowserTitle('更多');
  });

});
