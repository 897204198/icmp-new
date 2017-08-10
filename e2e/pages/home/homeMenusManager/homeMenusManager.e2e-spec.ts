import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../../app/service/loginTestService';
import { ExpectTestService } from '../../../app/service/expectTestService';
import { MenuTestService } from '../../../app/service/menuTestService';

describe('全部应用页测试测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  // 编辑按钮
  let editButton: any = element(by.id('e2e-edit-button'));
  // 应用图标
  let appIcons: any = element.all(by.css('.setting-menu'));
  // 所有删除、添加角标
  let markButtons: any = element.all(by.css('.menus-op'));

  it('全部应用-应用编辑', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    MenuTestService.enterAllMenusPage();
    browser.sleep(3000);
    editButton.click();
    ExpectTestService.checkElementTitle(editButton, '完成');
  });

  it('全部应用-应用移除', () => {
    MenuTestService.enterAllMenusPage();
    browser.sleep(3000);
    editButton.click();
    browser.sleep(2000);
    markButtons.get(0).click();
    browser.sleep(2000);
    editButton.click();
    ExpectTestService.checkElementTitle(editButton, '管理');
  });


  it('全部应用-应用添加', () => {
    MenuTestService.enterAllMenusPage();
    browser.sleep(3000);
    editButton.click();
    browser.sleep(2000);
    markButtons.get(0).click();
    browser.sleep(2000);
    markButtons.get(2).click();
    browser.sleep(2000);
    editButton.click();
    ExpectTestService.checkElementTitle(editButton, '管理');
  });

});
