import { browser, element, by } from 'protractor';
import { LoginTestService } from '../../../app/service/loginTestService';
import { TabsTestService } from '../../../app/service/tabsTestService';
import { ExpectTestService } from '../../../app/service/expectTestService';

describe('待办详情测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  // 办理
  let handleButton: any = element.all(by.id('e2e-handle-button')).get(0);

  it('查看待办详细', () => {
    LoginTestService.autoLogin();
    browser.sleep(2000);
    TabsTestService.clickTodoTab();
    browser.sleep(2000);
    handleButton.click();
    browser.sleep(2000);
    ExpectTestService.checkBrowserTitle('待办详细');
  });

});

