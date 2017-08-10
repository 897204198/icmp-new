import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../../../app/service/loginTestService';
import { TabsTestService } from '../../../../app/service/tabsTestService';
import { ExpectTestService } from '../../../../app/service/expectTestService';

describe('App下载地址页测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  // 关于我们
  let aboutme: any = element(by.id('e2e-aboutme'));
  // 下载地址
  let downloadAddress: any = element(by.id('e2e-downloadAddress'));


  it('查看App下载地址页面', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    TabsTestService.clickSettingTab();
    browser.sleep(2000);
    aboutme.click();
    browser.sleep(2000);
    downloadAddress.click();
    browser.sleep(2000);
    ExpectTestService.checkBrowserTitle('App下载地址');
  });

});
