import { browser, element, by } from 'protractor';

export class MenuTestService {

  /*
   * 对于全部应用相关的封装
   */

  // 点击 全部应用中的某一个
  static clickMenu(menu: string): void {
    browser.getTitle().then(title => {
      // 如果在首页，先进入全部应用界面
      if (title === '首页') {
        this.enterAllMenusPage();
      }

      element.all(by.css('.setting-menu')).then(res => {
        for (let i = 0; i < res.length; i++) {
          res[i].element(by.css('.menu-text')).getText().then(data => {
            if (data === menu) {
              res[i].click();
              browser.sleep(2000);
            }
          });
        }
      });

    });
  }

  // 进入全部应用
  static enterAllMenusPage(): void {
    // 全部应用图标
    let allMenus: any = element(by.id('e2e-main-menu'));
    allMenus.click();
    browser.sleep(2000);
  }
}
