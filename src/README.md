##普日协同抢先版常量
```
  "dev": {
    "id": {
      "android": "com.proper.icmp.dev",
      "ios": "com.proper.icmp.dev"
    },
    "version": {
      "android": "20000-SNAPSHOT",
      "ios": "20000-SNAPSHOT"
    },
    "appVersion": {
      "android": "2000006",
      "ios": "20000006"
    },
    "name": "掌上办公开发",
    "updateUrl": {
      "android": "https://www.pgyer.com/TniF",
      "ios": "https://www.pgyer.com/RNv8"
    },
    "server": {
      "chatKey": "1166171023115752#icmp",
      "adminConsolePass": "123456",
      "baseUrl": "https://icmp2.propersoft.cn/icmp/server-dev/route",
      "baseWebUrl": "https://icmp2.propersoft.cn/icmp/",
      "pushAppId": "MobileOADev",
      "pushServer": "http://push.propersoft.cn/pep-push",
      "getServiceKeyUrl":"http://220918zh27.iok.la:54885/pep/streamline/streamline/",
      "pushXiaomi": {
        "theAppid": "2882303761517720026",
        "theAppkey": "5401772090026"
      },
      "hcp": "https://icmp2.propersoft.cn/icmp-dev/"
    }
  }
```
### 普日协同online版常量
```
  "online": {
    "id": {
      "android": "com.proper.icmp.online",
      "ios": "com.proper.icmp.online"
    },
    "version": {
      "android": "20000-SNAPSHOT",
      "ios": "20000-SNAPSHOT"
    },
    "appVersion": {
      "android": "100000",
      "ios": "100000"
    },
    "name": "普日协同",
    "updateUrl": {
      "android": "https://www.pgyer.com/TniF",
      "ios": "https://www.pgyer.com/RNv8"
    },
    "server": {
      "chatKey": "1166171023115752#pr",
      "adminConsolePass": "",
      "baseUrl": "https://icmp.propersoft.cn/icmp/api/route/",
      "baseWebUrl": "https://icmp.propersoft.cn/icmp/",
      "pushAppId": "MobileOAOnline",
      "pushServer": "",
      "getServiceKeyUrl":"https://icmp.propersoft.cn/propersoft/api_streamline/streamline/",
      "pushXiaomi": {
        "theAppid": "2882303761517896401",
        "theAppkey": "5531789611401"
      },
      "hcp": "https://icmp.propersoft.cn/online/"
    }
  }
```
###streamline分流
通过输入不同的激活码跳转到对应的后台  

* 抢先版：  
普日：7654321  
标准版：1234  
* 正式版：  
普日：16fd9588-252c-11e9-99b9-0242ac11000c  
标准版：1234

####版本区分

* 普日版本  
有环信聊天功能，底部tab第二个为消息，通过`/application/tab`接口获取底部导航栏，有`ChatListPage`代表有消息功能，使用`localStorage.getItem('haveIM')`来储存判断，值为1则代表是有环信功能 
 
* oa版本  
底部第二个tab是angular的待办页面，通过`/application/tab`接口获取底部导航栏，有`old_todo`代表是这个版本,使用`localStorage.getItem('todoState')`来储存判断，值为1则代表是旧版本待办
    
* 新版标准版  
底部第二个tab是react的待办页面，通过`/application/tab`接口获取底部导航栏，有`new_todo`代表是这个版本，使用`localStorage.getItem('todoState')`来储存判断，值为2则代表是新版本待办，点击tab判断是这个版本的打开浏览器跳转到react的流程待办页面
