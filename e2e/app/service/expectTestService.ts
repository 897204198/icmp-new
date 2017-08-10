import { browser, element, by } from 'protractor';

export class ExpectTestService {

  /*
   * 对于 expect 的封装
   *
   * 每次执行前先 sleep 保证页面刷新出来
   */

  // 检测标题是否等于某值
  static checkElementTitle(tempElement: any, title: string): void {
    browser.sleep(2000);
    tempElement.getText().then(res => {
      expect(res).toBe(title);
    });
  }

  // 检测浏览器标题是否等于某值
  static checkBrowserTitle(title: string): void {
    browser.sleep(2000);
    browser.getTitle().then(res => {
      expect(res).toBe(title);
    });
  }

  // 检测 Input Value 是否等于某值
  static checkInputEqual(tempElement: any, title: string): void {
    browser.sleep(2000);
    tempElement.element(by.tagName('input')).getAttribute('value').then((res) => {
      expect(res).toBe(title);
    })
  }

  // 检测 Input Value 是否等于大于某值
  static checkInputThan(tempElement: any, expectLength: number): void {
    browser.sleep(2000);
    tempElement.element(by.tagName('input')).getAttribute('value').then((res) => {
      expect(res.length).toBeGreaterThan(expectLength);
    })
  }
}
