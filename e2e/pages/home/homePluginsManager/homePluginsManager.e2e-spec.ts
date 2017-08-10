import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../../app/service/loginTestService';
import { ExpectTestService } from '../../../app/service/expectTestService';

describe('全部插件页测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  // 添加插件图标
  let addPlugin: any = element(by.css('.add-plugin'));
  // 编辑按钮
  let editButton: any = element(by.id('e2e-edit-button'));
  // 插件图标
  let appIcons: any = element.all(by.css('.setting-menu'));
  // 所有删除、添加角标
  let markButtons: any = element.all(by.css('.menus-op'));

  it('全部插件-插件编辑', () => {
    LoginTestService.autoLogin();
    browser.sleep(1000);
    addPlugin.click();
    browser.sleep(3000);
    editButton.click();
    ExpectTestService.checkElementTitle(editButton, '完成');
  });


  it('全部插件-插件移除', () => {
    addPlugin.click();
    browser.sleep(3000);
    editButton.click();
    browser.sleep(2000);
    markButtons.get(0).click();
    browser.sleep(2000);
    editButton.click();
    ExpectTestService.checkElementTitle(editButton, '管理');
  });


  it('全部插件-插件添加', () => {
    addPlugin.click();
    browser.sleep(3000);
    editButton.click();
    browser.sleep(2000);
    markButtons.get(0).click();
    browser.sleep(2000);
    markButtons.get(1).click();
    browser.sleep(2000);
    editButton.click();
    ExpectTestService.checkElementTitle(editButton, '管理');
  });

});
