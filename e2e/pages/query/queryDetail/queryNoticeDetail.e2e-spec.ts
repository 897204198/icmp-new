import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../../app/service/loginTestService';
import { ExpectTestService } from '../../../app/service/expectTestService';
import { MenuTestService } from '../../../app/service/menuTestService';

describe('查询详情页测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  it('全部应用-查看消息推送详细', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    MenuTestService.enterAllMenusPage();
    browser.sleep(2000);
    MenuTestService.clickMenu('推送查询');
    browser.sleep(2000);
    let item: any = element.all(by.id('e2e-query-item')).get(0);
    item.click();
    browser.sleep(2000);
    let title = element(by.id('e2e-query-notice-title'));
    ExpectTestService.checkElementTitle(title, '消息推送详细');
  });

});
