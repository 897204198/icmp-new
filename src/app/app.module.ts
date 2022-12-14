import { IonicApp, IonicModule } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppMinimize } from '@ionic-native/app-minimize';
import { AppVersion } from '@ionic-native/app-version';
import { Camera } from '@ionic-native/camera';
import { Device } from '@ionic-native/device';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';
import { Keychain } from '@ionic-native/keychain';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { ImagePicker } from '@ionic-native/image-picker';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Keyboard } from '@ionic-native/keyboard';
import { NativeStorage } from '@ionic-native/native-storage';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { BackButtonService } from './services/backButton.service';
import { AdminPage } from '../pages/login/admin/admin';
import { SetPasswordPage } from '../pages/login/setPassword/setPassword';
import { LoginPage } from '../pages/login/login';
import { SpellService } from './services/spell.service';
import { ToastService } from './services/toast.service';
import { APP_CONSTANT, appConstant } from './constants/app.constant';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConfigsService } from './services/configs.service';
import { ICMP_CONSTANT, icmpConstant } from './constants/icmp.constant';
import { SecureStorageService } from './services/secureStorage.service';
import { CryptoService } from './services/crypto.service';
import { HttpInterceptor } from './interceptors/http.interceptor';
import { SearchFilterPipe } from './pipes/searchFilter/searchFilter';
import { MenuFolderComponent } from './component/menuFolder/menuFolder.component';
import { AddCustomPluginsComponent } from '../pages/home/component/addCustomPlugins/addCustomPlugins.component';
import { HomeCustomComponent } from '../pages/home/component/homeCustom/homeCustom.component';
import { PluginColldoctorComponent } from '../pages/home/component/pluginColldoctor/pluginColldoctor.component';
import { PluginRegRemindComponent } from '../pages/home/component/pluginRegRemind/pluginRegRemind.component';
import { HomePage } from '../pages/home/home';
import { HomePluginsManagerPage } from '../pages/home/homePluginsManager/homePluginsManager';
import { HomeMenusManagerPage } from '../pages/home/homeMenusManager/homeMenusManager';
import { HomeComponentPage } from '../pages/home/homeComponent/homeMenusManager';
import { DragulaModule } from 'ng2-dragula';
import { RoutersService } from './services/routers.service';
import { SettingPage } from '../pages/setting/setting';
import { UserInfoPage } from '../pages/setting/userInfo/userInfo';
import { AboutPage } from '../pages/setting/about/about';
import { FeedbackPage } from '../pages/setting/feedback/feedback';
import { FeedlistPage } from '../pages/setting/feedlist/feedlist';
import { subtitleComponent } from '../pages/setting/feedlist/component/subtitle/subtitle';
import { feedbtnComponent } from '../pages/setting/feedlist/component/feedbtn/feedbtn';
import { FeedDetailListPage } from '../pages/setting/feedDetailList/feedDetailList';
import { FeedDetailPage } from '../pages/setting/feedDetail/feedDetail';
import { NewsNoticePage } from '../pages/setting/newsNotice/newsNotice';
import { SafeAndPrivacyPage } from '../pages/setting/safeAndPrivacy/safeAndPrivacy';
import { GeneralPage } from '../pages/setting/general/general';
import { QueryNoticeDetailPage2 } from '../pages2/query/queryNoticeDetail/queryNoticeDetail';
import { QueryNoticeDetailPage } from '../pages/query/queryNoticeDetail/queryNoticeDetail';
import { FileTypeImageComponent } from './component/fileTypeImage/fileTypeImage.component';
import { FileService } from './services/file.service';
import { QueryListPage2 } from '../pages2/query/queryList/queryList';
import { QueryListPage } from '../pages/query/queryList/queryList';
import { QueryListConditionPage2 } from '../pages2/query/queryListCondition/queryListCondition';
import { QueryScheduleDetailPage } from '../pages2/query/queryScheduleDetail/queryScheduleDetail';
import { QueryListConditionPage } from '../pages/query/queryListCondition/queryListCondition';
import { CalendarModule } from 'icon2-calendar-ng-v4';
import { SearchboxComponent } from './component/searchbox/searchbox.component';
import { TodoListPage } from '../pages/todo/todoList/todoList';
import { TodoDetailPage } from '../pages/todo/todoDetail/todoDetail';
import { TodoOpinionPage } from '../pages/todo/todoOpinion/todoOpinion';
import { UtilsService } from './services/utils.service';
import { QueryDetailPage2 } from '../pages2/query/queryDetail/queryDetail';
import { QueryDetailPage } from '../pages/query/queryDetail/queryDetail';
import { UserService } from './services/user.service';
import { DeviceService } from './services/device.service';
import { PushService } from './services/push.service';
import { AppVersionUpdateService } from './services/appVersionUpdate.service';
import { IcmpDblclickDirective } from './directives/dblclick.directive';
import { Store, StoreModule } from '@ngrx/store';
import { reducer } from './redux/app.reducer';
import { IcmpSpinnerComponent } from './component/spinner/spinner.component';
import { InstaShotPage } from '../pages/instaShot/instaShot';
import { PhotoService } from './services/photo.service';
import { ApplicationPage } from '../pages/application/application';
import { StatisticsQueryPage } from '../pages/statistics/statisticsQuery/statisticsQuery';
import { StatisticsViewPage } from '../pages/statistics/statisticsView/statisticsView';
import { AddressPage } from '../pages/address/address';
import { ChatListPage } from '../pages/chatList/chatList';
import { AddFriendPage } from '../pages/address/addFriend/addFriend';
import { ApplyPage } from '../pages/address/apply/apply';
import { GroupPage } from '../pages/address/group/group';
import { CreateGroupPage } from '../pages/address/group/createGroup';
import { UserProfilePage } from '../pages/address/userProfile/userProfile';
import { PluginShowComponent } from '../pages/home/component/pluginShow/pluginShow.component';
import { ResetPasswordPage } from '../pages/setting/resetPassword/resetPassword';
import { ExamCustomFramePage } from '../pages/exam/customFrame/customFrame';
import { MacAddressPage } from '../pages/macAddress/macAddress';
import { MacAddressHistoy } from '../pages/macAddress/history/history';
import { MacFramePage } from '../pages/macAddress/macFrame/macFrame';
import { MacSuccPage } from '../pages/macAddress/success/success';
import { OrganizationAddressPage } from '../pages/address/organizationAddress/organizationAddress';
import { EmailPage } from '../pages/email/email';
import { IcmpPlaceholderComponent } from './component/placeholder/placeholder.component';
import { OopStormPage } from '../pages/setting/about/oopStorm/oopStorm';
import { ImagePreviewPage } from '../pages/setting/feedback/imagePreview';
import { IcmpKeyboardAttachDirective } from './directives/keyboardAttach.directive';
import { NoticePage } from '../pages/notice/notice';
import { InitService } from '../app/services/init.service';
import { WaitDonePage } from '../pages/exam/waitDone/waitDone';
import { HttpService } from '../app/services/http.service';
import { TodoListPage2 } from '../pages2/todo/todoList/todoList';
import { TodoDetailPage2 } from '../pages2/todo/todoDetail/todoDetail';
import { TodoOpinionPage2 } from '../pages2/todo/todoOpinion/todoOpinion';
import { TodoMissionOpinionPage } from '../pages2/todo/todoOpinion/mission/missionOpinion';
import { TodoWorkContactPage } from '../pages2/todo/todoOpinion/workContact/workContact';
import { EmergencyTreatmentPage } from '../pages2/emergencyTreatment/emergencyTreatment';
import { CheckPage } from '../pages/check/check';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { RfidPage } from '../pages/rfid/rfid';
import { RfidConnectPage } from '../pages/rfid/rfidConnect';
import { RfidDetailPage } from '../pages/rfid/rfidDetail';
import { RfidOpinionPage } from '../pages/rfid/rfidOpinion';
import { RfidListPage } from '../pages/rfid/rfidList';
import { ChoosePage } from '../pages/choose/choose';
import { WebSocketService } from '../app/services/webSocket.service';
import { ScanConnectPage } from '../pages/scan/scanConnect';
import { ScanDetailPage } from '../pages/scan/scanDetail';
import { JPush } from '@jiguang-ionic/jpush';
import { SQLite } from '@ionic-native/sqlite';
import { UserprivacyPage } from '../pages/setting/userprivacy/userprivacy';

export function interceptorFactory( xhrBackend: XHRBackend, requestOptions: RequestOptions, configsService: ConfigsService,
                                   userService: UserService, deviceService: DeviceService, store: Store<number>) {
  let service = new HttpInterceptor(xhrBackend, requestOptions, configsService, userService, deviceService, store);
  return service;
}

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    CheckPage,
    TodoListPage,
    TodoDetailPage,
    TodoOpinionPage,
    TodoMissionOpinionPage,
    TodoWorkContactPage,
    WaitDonePage,
    MyApp,
    IcmpDblclickDirective,
    SearchFilterPipe,
    MenuFolderComponent,
    IcmpSpinnerComponent,
    SearchboxComponent,
    AddCustomPluginsComponent,
    HomeCustomComponent,
    PluginColldoctorComponent,
    PluginRegRemindComponent,
    PluginShowComponent,
    IcmpPlaceholderComponent,
    FileTypeImageComponent,
    TabsPage,
    AdminPage,
    SetPasswordPage,
    LoginPage,
    HomePage,
    HomePluginsManagerPage,
    HomeMenusManagerPage,
    HomeComponentPage,
    SettingPage,
    UserInfoPage,
    AboutPage,
    FeedbackPage,
    FeedlistPage,
    subtitleComponent,
    feedbtnComponent,
    FeedDetailListPage,
    FeedDetailPage,
    NewsNoticePage,
    SafeAndPrivacyPage,
    GeneralPage,
    QueryNoticeDetailPage2,
    QueryNoticeDetailPage,
    QueryListPage2,
    QueryListPage,
    QueryListConditionPage2,
    QueryScheduleDetailPage,
    QueryListConditionPage,
    StatisticsQueryPage,
    StatisticsViewPage,
    ApplicationPage,
    TodoListPage2,
    TodoDetailPage2,
    TodoOpinionPage2,
    QueryDetailPage2,
    QueryDetailPage,
    EmergencyTreatmentPage,
    InstaShotPage,
    AddressPage,
    ChatListPage,
    AddFriendPage,
    ApplyPage,
    GroupPage,
    CreateGroupPage,
    UserProfilePage,
    ResetPasswordPage,
    ExamCustomFramePage,
    MacAddressPage,
    MacAddressHistoy,
    MacFramePage,
    MacSuccPage,
    OrganizationAddressPage,
    EmailPage,
    OopStormPage,
    ImagePreviewPage,
    IcmpKeyboardAttachDirective,
    NoticePage,
    InstaShotPage,
    RfidPage,
    RfidConnectPage,
    RfidListPage,
    RfidDetailPage,
    RfidOpinionPage,
    ChoosePage,
    ScanConnectPage,
    UserprivacyPage,
    ScanDetailPage
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: 'true',
      platforms: {
        ios: {
          backButtonText: '??????'
        }
      }
    }),
    StoreModule.provideStore(reducer),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    }),
    IonicStorageModule.forRoot(),
    BrowserModule,
    HttpModule,
    CalendarModule,
    DragulaModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    CheckPage,
    TodoListPage2,
    TodoDetailPage2,
    TodoOpinionPage2,
    TodoMissionOpinionPage,
    TodoWorkContactPage,
    WaitDonePage,
    MyApp,
    MenuFolderComponent,
    SearchboxComponent,
    TabsPage,
    AdminPage,
    SetPasswordPage,
    LoginPage,
    HomePage,
    HomePluginsManagerPage,
    HomeMenusManagerPage,
    HomeComponentPage,
    SettingPage,
    UserInfoPage,
    AboutPage,
    FeedbackPage,
    FeedlistPage,
    FeedDetailListPage,
    FeedDetailPage,
    NewsNoticePage,
    SafeAndPrivacyPage,
    GeneralPage,
    QueryNoticeDetailPage2,
    QueryScheduleDetailPage,
    QueryNoticeDetailPage,
    QueryListPage2,
    QueryListPage,
    QueryListConditionPage2,
    QueryListConditionPage,
    EmergencyTreatmentPage,
    StatisticsQueryPage,
    StatisticsViewPage,
    ApplicationPage,
    TodoListPage,
    TodoDetailPage,
    TodoOpinionPage,
    QueryDetailPage2,
    QueryDetailPage,
    InstaShotPage,
    AddressPage,
    ChatListPage,
    AddFriendPage,
    ApplyPage,
    GroupPage,
    CreateGroupPage,
    UserProfilePage,
    ResetPasswordPage,
    ExamCustomFramePage,
    MacAddressPage,
    MacAddressHistoy,
    MacFramePage,
    MacSuccPage,
    OrganizationAddressPage,
    EmailPage,
    OopStormPage,
    ImagePreviewPage,
    NoticePage,
    InstaShotPage,
    RfidPage,
    RfidConnectPage,
    RfidListPage,
    RfidDetailPage,
    RfidOpinionPage,
    ChoosePage,
    ScanConnectPage,
    UserprivacyPage,
    ScanDetailPage
  ],
  providers: [
    BarcodeScanner,
    JPush,
    StatusBar,
    SpellService,
    File,
    FileChooser,
    FilePath,
    Keychain,
    FileTransfer,
    FileTransferObject,
    FileOpener,
    Keyboard,
    SplashScreen,
    UniqueDeviceID,
    Device,
    AppVersion,
    InAppBrowser,
    AppVersionUpdateService,
    SecureStorageService,
    CryptoService,
    BackButtonService,
    ConfigsService,
    ToastService,
    InitService,
    RoutersService,
    FileService,
    UtilsService,
    UserService,
    DeviceService,
    PushService,
    Camera,
    ImagePicker,
    PhotoService,
    AppMinimize,
    NativeStorage,
    SearchFilterPipe,
    HttpService,
    WebSocketService,
    SQLite,
    {provide: Http, useFactory: interceptorFactory, deps: [XHRBackend, RequestOptions, ConfigsService, UserService, DeviceService, Store]},
    {provide: APP_CONSTANT, useValue: appConstant},
    {provide: ICMP_CONSTANT, useValue: icmpConstant}
  ]
})
export class AppModule {}
