import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../../app/service/loginTestService';
import { ExpectTestService } from '../../../app/service/expectTestService';
import { MenuTestService } from '../../../app/service/menuTestService';

describe('查询列表页测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  it('全部应用-查看公告通知列表', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    MenuTestService.enterAllMenusPage();
    browser.sleep(3000);
    MenuTestService.clickMenu('公告通知');
    browser.sleep(3000);
    let title = element(by.id('e2e-query-list-title'));
    ExpectTestService.checkElementTitle(title, '公告通知');
  });


  it('全部应用-查看推送查询列表页', () => {
    MenuTestService.enterAllMenusPage();
    browser.sleep(3000);
    MenuTestService.clickMenu('推送查询');
    browser.sleep(3000);
    let title = element(by.id('e2e-query-list-title'));
    ExpectTestService.checkElementTitle(title, '推送查询');
  });


  it('全部应用-查看其它查询列表页', () => {
    MenuTestService.enterAllMenusPage();
    browser.sleep(3000);
    MenuTestService.clickMenu('其它查询');
    browser.sleep(3000);
    let title = element(by.id('e2e-query-list-title'));
    ExpectTestService.checkElementTitle(title, '其它查询');
  });

});
