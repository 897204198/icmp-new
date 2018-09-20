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
  var customs = require('./custom_contents/customs.json');

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
          'cordova plugin add cordova-plugin-proper-HuanXin-android@1.0.2 --save',
          'cordova plugin add cordova-hot-code-push-plugin@1.5.3 --save',
          'cordova plugin add cordova-plugin-crosswalk-webview@2.3.0 --save',
          'cordova plugin add cordova-plugin-proper-update-version@1.0.3 --save',
          'cordova plugin add cordova-plugin-appminimize@1.0.0 --save',
          'cordova plugin add cordova-plugin-getMacaddress@1.0.0 --save'
        ].join('&&')
      },
      addIosPlugins: {
        command: [
          'cordova plugin add cordova-plugin-proper-HuanXin-iOS@1.0.2 --save',
          'cordova plugin add cordova-hot-code-push-plugin@1.5.3 --save'
        ].join('&&')
      },
      hcpBuild: {
        // 生成静态资源在线更新配置文件
        command: 'cordova-hcp build'
      }
    },

    copy: {
      project: {
        files: [
          {expand: true, cwd: './custom_contents/' + conf.currentProject + '/resources', src: ['**'], dest: './resources/'},
          {expand: true, cwd: './custom_contents/' + conf.currentProject + '/images', src: ['**'], dest: '<%= app.src %>/assets/images/'},
          {expand: true, cwd: './custom_contents/' + conf.currentProject + '/jsons', src: ['**'], dest: '<%= app.src %>/assets/jsons/'},
          {expand: true, cwd: './custom_contents/' + conf.currentProject + '/pages', src: ['**'], dest: '<%= app.src %>/pages/'}
        ]
      }
    },

    replace: {
      configAndroid: {
        options: {
          patterns: [
            {
              match: /id="com.proper.icmp"/,
              replacement: 'id="' + customs[conf.currentProject].id.android + '"'
            },
            {
              match: /version="[^"]*"/,
              replacement: 'version="' + formalVer(customs[conf.currentProject].appVersion.android) + '"'
            },
            {
              match: /android-versionCode="[^"]*"/,
              replacement: 'android-versionCode="' + customs[conf.currentProject].appVersion.android + '"'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['config.xml']}
        ]
      },
      configIOS: {
        options: {
          patterns: [
            {
              match: /id="com.proper.icmp"/,
              replacement: 'id="' + customs[conf.currentProject].id.ios + '"'
            },
            {
              match: /version="[^"]*"/,
              replacement: 'version="' + formalVer(customs[conf.currentProject].appVersion.ios) + '"'
            },
            {
              match: /ios-CFBundleVersion="[^"]*"/,
              replacement: 'ios-CFBundleVersion="' + customs[conf.currentProject].appVersion.ios + '"'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['config.xml']}
        ]
      },
      configs: {
        options: {
          patterns: [
            {
              match: /<name.*/,
              replacement: '<name>' + customs[conf.currentProject].name + '</name>'
            },
            {
              match: /<config-file.*/,
              replacement: '<config-file url="' + customs[conf.currentProject].server.hcp + '/chcp.json" />'
            },
            {
              match: /"content_url":.*/,
              replacement: '"content_url": "' + customs[conf.currentProject].server.hcp + '",'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['config.xml', 'cordova-hcp.json']}
        ]
      },
      constants: {
        options: {
          patterns: [
            {
              match: /baseUrl: '.*',/,
              replacement: 'baseUrl: \'' + customs[conf.currentProject].server.baseUrl + '\','
            },
            {
              match: /chatKey: '.*',/,
              replacement: 'chatKey: \'' + customs[conf.currentProject].server.chatKey + '\','
            },
            {
              match: /adminConsolePass: '.*'/,
              replacement: 'adminConsolePass: \'' + customs[conf.currentProject].server.adminConsolePass + '\''
            },
            {
              match: /'appId': '.*',/,
              replacement: '\'appId\': \'' + customs[conf.currentProject].server.pushAppId + '\','
            },
            {
              match: /'pushUrl': '.*',/,
              replacement: '\'pushUrl\': \'' + customs[conf.currentProject].server.pushServer + '\','
            },
            {
              match: /'theAppid': '.*',/,
              replacement: '\'theAppid\': \'' + customs[conf.currentProject].server.pushXiaomi.theAppid + '\','
            },
            {
              match: /'theAppkey': '.*'/,
              replacement: '\'theAppkey\': \'' + customs[conf.currentProject].server.pushXiaomi.theAppkey + '\''
            },
            {
              match: /androidUpdateUrl: '.*',/,
              replacement: 'androidUpdateUrl: \'' + customs[conf.currentProject].updateUrl.android + '\','
            },
            {
              match: /iosUpdateUrl: '.*'/,
              replacement: 'iosUpdateUrl: \'' + customs[conf.currentProject].updateUrl.ios + '\''
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['<%= app.src %>/app/constants/app.constant.ts', '<%= app.src %>/app/constants/icmp.constant.ts'], dest: '<%= app.src %>/app/constants'}
        ]
      },
      bumpVer: {
        options: {
          patterns: [
            
          ]
        },
        files: [
          {expand: true, src: ['config.xml', 'package.json', './custom_contents/customs.json']}
        ]
      }
    }
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
    if (target && target === 'before') {
      grunt.task.run('replace:constants', 'copy:project');
    }

    var tasks = [];

    if (target && target.startsWith('release')) {
      if (target === 'releaseAndroid') {
        tasks.push('shell:addAndroidPlugins');
        tasks.push('replace:configAndroid');
      } else if (target === 'releaseIOS') {
        tasks.push('shell:addIosPlugins');
        tasks.push('replace:configIOS');
      }
      tasks.push('replace:configs', 'shell:hcpBuild');
    }

    if (target && target === 'hcp') {
      tasks.push('replace:configs', 'shell:hcpBuild');
    }

    grunt.task.run(tasks);
  });

  grunt.registerTask('bumpVer', ['replace:bumpVer']);
  grunt.registerTask('default', []);
};
