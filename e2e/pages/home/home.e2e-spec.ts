import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../app/service/loginTestService';
import { ExpectTestService } from '../../app/service/expectTestService';
import { MenuTestService } from '../../app/service/menuTestService';

describe('首页测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  it('全部应用查看公告通知', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    MenuTestService.enterAllMenusPage();
    browser.sleep(2000);
    MenuTestService.clickMenu('公告通知');
    let title = element(by.id('e2e-query-list-title'));
    ExpectTestService.checkElementTitle(title, '公告通知');
  });

});
