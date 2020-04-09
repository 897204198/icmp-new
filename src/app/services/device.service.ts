import { Injectable } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version';
import { Device } from '@ionic-native/device';
import { PushService } from './push.service';
import { SecureStorageService } from './secureStorage.service';

export interface DeviceInfoState {
  deviceType: string;
  deviceId: string;
  versionCode: string;
  versionNumber: string;
  deviceVersion: string;
  deviceModel: string;
  deviceUuid: string;
  manufacturer: string;
}

let initDeviceInfo: DeviceInfoState = {
  deviceType: '',
  deviceId: '',
  versionCode: '',
  versionNumber: '',
  deviceModel: '',
  deviceUuid: '',
  manufacturer: '',
  deviceVersion: ''
};

/**
 * 设备相关信息服务
 */
@Injectable()
export class DeviceService {

  // 设备信息存储键
  static SEC_KEY_DEVICE_INFO = 'deviceInfo';

  /**
   * 构造函数
   */
  constructor(private appVersion: AppVersion,
    private device: Device,
    private pushService: PushService,
    private secureStorageService: SecureStorageService) { }

  /**
   * 设置设备信息
   */
  setDeviceInfo(): void {
    let deviceInfo: DeviceInfoState = initDeviceInfo;
    deviceInfo.deviceModel = this.device.model;
    deviceInfo.deviceType = this.device.platform;
    deviceInfo.deviceUuid = this.device.uuid;
    deviceInfo.manufacturer = this.device.manufacturer; 
    if (deviceInfo.deviceType != null && deviceInfo.deviceType !== '') {
      deviceInfo.deviceType = deviceInfo.deviceType.toLowerCase();
    }
    if ((<any>window).plugins != null) {
      // 手机系统版本
      deviceInfo.deviceVersion = this.device.version;
      this.pushService.getDeviceInfo().then((info: any) => {
        deviceInfo.deviceId = info.uniqueId;
        this.secureStorageService.putObject(DeviceService.SEC_KEY_DEVICE_INFO, deviceInfo);
      });
      this.appVersion.getVersionCode().then((versionCode: string) => {
        deviceInfo.versionCode = versionCode;
        this.secureStorageService.putObject(DeviceService.SEC_KEY_DEVICE_INFO, deviceInfo);
      });
      this.appVersion.getVersionNumber().then((versionNumber: string) => {
        deviceInfo.versionNumber = versionNumber;
        this.secureStorageService.putObject(DeviceService.SEC_KEY_DEVICE_INFO, deviceInfo);
      });
    }
    this.secureStorageService.putObject(DeviceService.SEC_KEY_DEVICE_INFO, deviceInfo);
  }

  /**
   * 取得设备信息
   */
  getDeviceInfo(): DeviceInfoState {
    let deviceInfo: DeviceInfoState = this.secureStorageService.getObject(DeviceService.SEC_KEY_DEVICE_INFO);
    return deviceInfo;
  }
}
