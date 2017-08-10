import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../../app/service/loginTestService';
import { ExpectTestService } from '../../../app/service/expectTestService';
import { MenuTestService } from '../../../app/service/menuTestService';

describe('查询消息详情页测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  it('全部应用-查看公告通知详细', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    MenuTestService.enterAllMenusPage();
    browser.sleep(2000);
    MenuTestService.clickMenu('公告通知');
    browser.sleep(2000);
    let item: any = element.all(by.css('.item')).get(0);
    item.click();
    browser.sleep(2000);
    let title = element(by.id('e2e-query-notice-title'));
    ExpectTestService.checkElementTitle(title, '公告通知详细');
  });


  it('首页-查看公告通知、点击查看详细', () => {
    let homeNotice: any = element.all(by.css('.e2e-notice')).get(0);
    homeNotice.click();
    browser.sleep(2000);
    let title = element(by.id('e2e-query-notice-title'));
    ExpectTestService.checkElementTitle(title, '公告通知详细');
  });

});
