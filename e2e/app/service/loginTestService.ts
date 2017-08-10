import { browser, element, by } from 'protractor';

export class LoginTestService {

  /*
   * 对于 自动登录、自动退出 的封装
   *
   * 每次执行完后自动 sleep 保证页面刷新出来
   */

  // 检查是否登录，如未登录则先登录
  static autoLogin(): void {
    // 用户名
    let username: any = element(by.id('e2e-username'));
    // 密码
    let password: any = element(by.id('e2e-password'));
    // 登录按钮
    let loginButton: any = element(by.id('e2e-login-button'));
    browser.getTitle().then(title => {
      if (title !== '首页') {
        loginButton.getText().then(res => {
          if (res === '登录') {
            username.element(by.tagName('input')).getAttribute('value').then((usernameValue) => {
              if (usernameValue.length === 0) {
                browser.actions().mouseMove(username).click().sendKeys('1000002230').perform();
                browser.sleep(2000);
              }
              password.element(by.tagName('input')).getAttribute('value').then((passwordValue) => {
                if (passwordValue.length === 0) {
                  browser.actions().mouseMove(password).click().sendKeys('123456').perform();
                  browser.sleep(2000);
                }
                loginButton.click();
                browser.sleep(2000);
              })
            })

          }
        });
      }
    })
  }

  // 检查是否登录，如已登录则退出登录
  static autoExit(): void {
    browser.getTitle().then(title => {
      if (title === '首页') {
        element.all(by.css('.tab-button-text')).then(res => {
          for (let i = 0; i < res.length; i++) {
            res[i].getText().then(barTitle => {
              if (barTitle === '更多') {
                res[i].click();
                browser.sleep(2000);
                let logoutButton = element(by.id('e2e-logout-button'));
                logoutButton.click();
                browser.sleep(2000);
              }
            });
          }
        });
      }
    })
  }

}
