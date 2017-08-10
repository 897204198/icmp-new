import { browser, element, by, protractor } from 'protractor';
import { LoginTestService } from '../../app/service/loginTestService';
import { ExpectTestService } from '../../app/service/expectTestService';

describe('登录页测试', () => {

  beforeEach(() => {
    browser.get('');
  });
  // 用户名
  let username: any = element(by.id('e2e-username'));
  // 密码
  let password: any = element(by.id('e2e-password'));
  // 登录按钮
  let loginButton: any = element(by.id('e2e-login-button'));
  // 保存密码
  let savePassword: any = element(by.id('e2e-savePassword'));

  it('不输入用户名和密码点击登录', () => {
    browser.executeScript('window.localStorage.clear();');
    LoginTestService.autoExit();
    browser.sleep(2000);
    loginButton.click();
    ExpectTestService.checkElementTitle(loginButton, '登录');
  });


  it('不输入密码点击登录', () => {
    browser.actions().mouseMove(username).click().sendKeys('1000002230').perform();
    loginButton.click();
    ExpectTestService.checkElementTitle(loginButton, '登录');
  });


  it('正常登录不保存密码', () => {
    browser.actions().mouseMove(username).click().sendKeys('1000002230').perform();
    browser.actions().mouseMove(password).click().sendKeys('123456').perform();
    browser.actions().mouseMove(savePassword).click().perform();
    browser.sleep(2000);
    loginButton.click();
    browser.sleep(2000);
    LoginTestService.autoExit();
    ExpectTestService.checkInputThan(password, 0);
  });


  it('正常登录并保存密码', () => {
    browser.actions().mouseMove(password).click().sendKeys('123456').perform();
    browser.actions().mouseMove(savePassword).click().perform();
    browser.sleep(2000);
    loginButton.click();
    browser.sleep(2000);
    LoginTestService.autoExit();
    ExpectTestService.checkInputThan(password, 0);
  });


});
