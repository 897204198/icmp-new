import { browser, element, by } from 'protractor';

export class TabsTestService {

  /*
   * 对于点击 Tabs 的封装
   */

  // 点击首頁 Tab
  public static clickHomeTab(): void {
    this.clickTabs('首页');
  }
  // 点击待办 Tab
  public static clickTodoTab(): void {
    this.clickTabs('待办');
  }
  // 点击更多 Tab
  public static clickSettingTab(): void {
    this.clickTabs('更多');
  }

  // 点击某个 Tab
  private static clickTabs(tabName: string): void {
    element.all(by.css('.tab-button-text')).then(res => {
      for (let i = 0; i < res.length; i++) {
        res[i].getText().then(title => {
          if (title === tabName) {
            res[i].click();
            browser.sleep(1500);
          }
        });
      }
    });
  }

}
