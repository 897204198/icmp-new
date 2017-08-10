// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

/*global jasmine */
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;
var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');

exports.config = {
  allScriptsTimeout: 111000,
  specs: [
    './e2e/**/*.e2e-spec.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': ['--headless', '--disable-gpu'],
      'mobileEmulation': {
        'deviceName': 'iPhone 5'
      }
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:8100/',
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000,
    print: function () { }
  },
  useAllAngular2AppRoots: true,
  beforeLaunch: function () {
    require('ts-node').register({
      project: 'e2e'
    });
  },
  onPrepare: function () {
    jasmine.getEnv().addReporter(new SpecReporter());
    jasmine.getEnv().addReporter(
      new Jasmine2HtmlReporter({
        savePath: './e2e_report/',
        screenshotsFolder: 'images',
        takeScreenshots: true
      })
    );
  }
};
