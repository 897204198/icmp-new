'use strict';

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required Grunt tasks
  require('jit-grunt')(grunt, {});

  var formalVer = function(versionCode) {
    if (typeof versionCode === 'string' && versionCode.length === 5) {
      return parseInt(versionCode.substr(0, 1)) + '.' +
        parseInt(versionCode.substr(1, 2)) + '.' +
        parseInt(versionCode.substr(3, 2));
    } else {
      return versionCode;
    }
  };

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
          'cordova plugin add cordova-hot-code-push-plugin@1.5.2 --save',
          'cordova plugin add cordova-plugin-crosswalk-webview@2.3.0 --save'
        ].join('&&')
      },
      addIosPlugins: {
        command: [
          'cordova plugin add cordova-hot-code-push-plugin@1.5.2 --save'
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
          {expand: true, cwd: './custom_contents/' + conf.currentProject + '/pages/login', src: ['**'], dest: '<%= app.src %>/pages/login/'}
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
              match: /version="\d*\.\d*\.\d*"/,
              replacement: 'version="' + formalVer(customs[conf.currentProject].version.android) + '"'
            },
            {
              match: /android-versionCode="\d*"/,
              replacement: 'android-versionCode="' + customs[conf.currentProject].version.android + '"'
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
              match: /version="\d*\.\d*\.\d*"/,
              replacement: 'version="' + formalVer(customs[conf.currentProject].version.ios) + '"'
            },
            {
              match: /ios-CFBundleVersion="\d*"/,
              replacement: 'ios-CFBundleVersion="' + customs[conf.currentProject].version.ios + '"'
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
              match: /baseUrl: '\.\/api',/,
              replacement: 'baseUrl: \'' + customs[conf.currentProject].server.baseUrl + '\','
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
            {
              match: /"version": "\d*\.\d*\.\d*"/,
              replacement: '"version": "' + formalVer(conf.version) + '"'
            },
            {
              match: /version="\d*\.\d*\.\d*"/,
              replacement: 'version="' + formalVer(conf.version) + '"'
            },
            {
              match: /-(\w*)ersion(\w*)="(\d*)"/g,
              replacement: '-$1ersion$2="' + conf.version + '"'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, src: ['config.xml', 'package.json']}
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

  grunt.registerTask('default', []);
};
