import { browser, element, by } from 'protractor';

describe('设置页测试', () => {

  beforeEach(() => {
    browser.get('');
  });

  // 用户信息
  let userinfo = element(by.id('e2e-userinfo'));
  // 检查更新
  let checkversion = element(by.id('e2e-checkversion'));
  // 关于我们
  let aboutme = element(by.id('e2e-aboutme'));


  it('查看用户信息页面', () => {

    element.all(by.css('.tab-button-text')).then(res => {
      for (let i = 0; i < res.length; i++) {
        res[i].getText().then(title => {
          if (title === '更多') {
            res[i].click();
            browser.sleep(1000);
            userinfo.click();
            browser.sleep(1000);
          }
        });
      }
    });
  });


  it('检查更新', () => {

    element.all(by.css('.tab-button-text')).then(res => {
      for (let i = 0; i < res.length; i++) {
        res[i].getText().then(title => {
          if (title === '更多') {
            res[i].click();
            browser.sleep(1000);
            checkversion.click();
            browser.sleep(1000);
          }
        });
      }
    });
  });


  it('查看关于我们页面', () => {

    element.all(by.css('.tab-button-text')).then(res => {
      for (let i = 0; i < res.length; i++) {
        res[i].getText().then(title => {
          if (title === '更多') {
            res[i].click();
            browser.sleep(1000);
            aboutme.click();
            browser.sleep(1000);
          }
        });
      }
    });
  });


  // 意见反馈
  // let feedback = element(by.id('e2e-feedback'));
  // 下载地址
  let downloadAddress = element(by.id('e2e-downloadAddress'));
  // 关于普日软件
  let proper = element(by.id('e2e-proper'));

  // it('关于我们-意见反馈', () => {

  //   element.all(by.css('.tab-button-text')).then(res => {
  //     for (let i = 0; i < res.length; i++) {
  //       res[i].getText().then(title => {
  //         if (title === '更多') {
  //           res[i].click();
  //           browser.sleep(1000);
  //           aboutme.click();
  //           browser.sleep(1000);
  //           feedback.click();
  //           browser.sleep(1000);
  //         }
  //       });
  //     }
  //   });
  // });


  it('查看App下载地址页面', () => {

    element.all(by.css('.tab-button-text')).then(res => {
      for (let i = 0; i < res.length; i++) {
        res[i].getText().then(title => {
          if (title === '更多') {
            res[i].click();
            browser.sleep(1000);
            aboutme.click();
            browser.sleep(1000);
            downloadAddress.click();
            browser.sleep(1000);
          }
        });
      }
    });
  });


  it('查看关于普日软件页面', () => {

    element.all(by.css('.tab-button-text')).then(res => {
      for (let i = 0; i < res.length; i++) {
        res[i].getText().then(title => {
          if (title === '更多') {
            res[i].click();
            browser.sleep(1000);
            aboutme.click();
            browser.sleep(1000);
            proper.click();
            browser.sleep(1000);
          }
        });
      }
    });
  });



});
