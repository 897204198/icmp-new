import { browser, element, by } from 'protractor';

describe('登录测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  // 用户名
  let username = element(by.id('e2e-username'));
  // 密码
  let password = element(by.id('e2e-password'));
  // 登录按钮
  let loginButton = element(by.id('e2e-login-button'));
  // 保存密码
  let savePassword = element(by.id('e2e-savePassword'));

  it('不输入用户名和密码点击登录', () => {
    loginButton.click();
    browser.sleep(1500);
    loginButton.getText().then(res => {
      expect(res).toBe('登录');
    });
  });


  it('不输入密码点击登录', () => {
    browser.actions().mouseMove(username).click().sendKeys('1000002230').perform();
    loginButton.click();
    browser.sleep(1500);
    loginButton.getText().then(res => {
      expect(res).toBe('登录');
    });
  });


  it('正常登录不保存密码', () => {
    browser.actions().mouseMove(username).click().sendKeys('1000002230').perform();
    browser.actions().mouseMove(password).click().sendKeys('123456').perform();
    browser.actions().mouseMove(savePassword).click().perform();
    browser.sleep(1000);
    loginButton.click();
    browser.sleep(1000);
    element.all(by.css('.tab-button-text')).then(res => {
      for (let i = 0; i < res.length; i++) {
        res[i].getText().then(title => {
          if (title === '更多') {
            res[i].click();
            browser.sleep(1000);
            let logoutButton = element(by.id('e2e-logout-button'));
            logoutButton.click();
            browser.sleep(1000);

            // password.element(by.tagName('input')).getAttribute('value').then((passwordValue) => {
            //   console.log(passwordValue);
            //   expect(passwordValue.length).toBe(0);
            // })
          }
        });
      }
    });
  });


  it('正常登录并保存密码', () => {
    browser.actions().mouseMove(password).click().sendKeys('123456').perform();
    browser.actions().mouseMove(savePassword).click().perform();
    browser.sleep(1000);
    loginButton.click();
    browser.sleep(1000);
    element.all(by.css('.tab-button-text')).then(res => {
      for (let i = 0; i < res.length; i++) {
        res[i].getText().then(title => {
          if (title === '更多') {
            res[i].click();
            browser.sleep(1000);
            let logoutButton = element(by.id('e2e-logout-button'));
            logoutButton.click();
            browser.sleep(1000);

            password.element(by.tagName('input')).getAttribute('value').then((passwordValue) => {
              expect(passwordValue.length).toBeGreaterThan(0);
            })


          }
        });
      }
    });
  });


});
