'use strict';

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {});

  var formalVer = function(versionCode) {
    var hasSuffix = false;
    if (versionCode.indexOf('-SNAPSHOT') !== -1) {
      hasSuffix = true;
    }else {
      hasSuffix = false;
    }
    if (typeof versionCode === 'string' && versionCode.length > 5) {
      return parseInt(versionCode.substr(0, 1)) + '.' +
        parseInt(versionCode.substr(1, 2)) + '.' +
        parseInt(versionCode.substr(3, 2)) + '.' + versionCode.substr(5);
    } else if (typeof versionCode === 'string' && (versionCode.length === 5 || hasSuffix)) {
      if (hasSuffix) {
        return parseInt(versionCode.substr(0, 1)) + '.' +
        parseInt(versionCode.substr(1, 2)) + '.' +
        parseInt(versionCode.substr(3, 2)) + '-SNAPSHOT';
      }else {
        return parseInt(versionCode.substr(0, 1)) + '.' +
        parseInt(versionCode.substr(1, 2)) + '.' +
        parseInt(versionCode.substr(3, 2));
      }
    } else {
      return versionCode;
    }
  };

  var delSnapVer = function (versionCode) {
    if (versionCode.indexOf('-SNAPSHOT') !== -1) {
      versionCode = versionCode.replace('-SNAPSHOT', '');
      return versionCode;
    } else {
      return versionCode;
    }
  }

  // Configurable paths for the application
  var appConfig = {
    src: 'src'
  };

  var conf = require('./ionic.config.json');
  // var customs = require('./custom_contents/customs.json');

  // Define the configuration for all the tasks
  grunt.initConfig({
    // Project settings
    app: appConfig,

    shell: {
      stop: {
        command: 'pm2 stop all -s'
      },
      start: {
        command: 'pm2 start proxy/proxy-server.js -s'
      },
      addAndroidPlugins: {
        command: [
          'cordova plugin add cordova-plugin-proper-HuanXin-android@1.1.1 --save',
          'cordova plugin add cordova-hot-code-push-plugin@1.5.3 --save',
          'cordova plugin add cordova-plugin-x5-webview@3.2.1 --save',
          'cordova plugin add cordova-plugin-proper-update-version@1.0.4 --save',
          'cordova plugin add cordova-plugin-appminimize@1.0.0 --save',
          'cordova plugin add cordova-plugin-getMacaddress@1.0.0 --save',
          'cordova plugin add cordova-plugin-proper-vorgea@1.0.0 --save',
          'cordova plugin add cordova-plugin-android-permissions',
          'cordova plugin add cordova-android-support-gradle-release@1.4.2 --save',
          'cordova plugin add cordova-plugin-unifiedv4version@1.0.0 --save',
          'cordova plugin add clockplugin@1.0.9 --save'
        ].join('&&')
      },
      addIosPlugins: {
        command: [
          'cordova plugin add cordova-plugin-proper-HuanXin-iOS@1.0.4 --save',
          'cordova plugin add cordova-hot-code-push-plugin@1.5.3 --save',
          'cordova plugin add cordova-plugin-baidumaplocation@1.0.5 --save'
        ].join('&&')
      },
      hcpBuild: {
        // 生成静态资源在线更新配置文件
        command: 'cordova-hcp build'
      }
    },
  });

  grunt.registerTask('serveProxy', '', function (target) {
    var tasks = [
      'shell:stop',
      'shell:start'
    ];

    if (target === 'real') {
      tasks.splice(1, 1);
    }

    grunt.task.run(tasks);
  });

  grunt.registerTask('build', '', function(target) {
    var tasks = [];

    if (target && target === 'debugAndroid') {
      tasks.push('shell:addAndroidPlugins');
      tasks.push('shell:hcpBuild');
    } else if (target && target.startsWith('release')) {
      if (target === 'releaseAndroid') {
        tasks.push('shell:addAndroidPlugins');
      } else if (target === 'releaseIOS') {
        tasks.push('shell:addIosPlugins');
      }
      tasks.push('shell:hcpBuild');
    } else if (target && target === 'hcp') {
      tasks.push('shell:hcpBuild');
    }

    grunt.task.run(tasks);
  });

  grunt.registerTask('bumpVer');
  grunt.registerTask('default', []);
};
