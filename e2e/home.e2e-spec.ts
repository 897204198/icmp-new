import { browser, element, by } from 'protractor';

describe('首页测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  // 用户名
  let username = element(by.id('e2e-username'));
  // 密码
  let password = element(by.id('e2e-password'));
  // 登录按钮
  let loginButton = element(by.id('e2e-login-button'));

  it('全部应用', () => {
    loginButton.getText().then(res => {
      if (res === '登录') {
        username.element(by.tagName('input')).getAttribute('value').then((usernameValue) => {
          if (usernameValue.length === 0) {
            browser.actions().mouseMove(username).click().sendKeys('1000002230').perform();
            browser.sleep(1000);
          }
          password.element(by.tagName('input')).getAttribute('value').then((passwordValue) => {
            if (passwordValue.length === 0) {
              browser.actions().mouseMove(password).click().sendKeys('123456').perform();
              browser.sleep(1000);
            }
            loginButton.click();
          })
        })

        // 代码从这里开始
        // browser.sleep(1000);
        // let allMenus = element(by.id('e2e-main-menu'));
        // allMenus.click();
        // browser.sleep(1000);
      }
    });

  });

  // it('应用编辑', () => {

  // });


  // it('应用添加', () => {

  // });


  // it('应用移除', () => {

  // });


  // it('应用排序', () => {

  // });


});
