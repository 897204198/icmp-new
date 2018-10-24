import { InjectionToken } from '@angular/core';

export interface SystemIdConstant {

  // 申请单页面
  application: string;

  // 查询列表页面
  queryList: string;

  // 查询详细页面
  queryDetail: string;

  // 审批列表页面
  todoList: string;

  // 随手拍页面
  instaShot: string;

  // 统计查询页面
  statisticsSearch: string;

  // 统计页面
  statisticsView: string;

  // 门急诊
  emergency: string;
}

/**
 * OA代码中用到的常量
 */
export interface IcmpConstant {

  // 默认的分页大小
  pageSize: string;

  // 请求成功代码
  reqResultSuccess: string;

  // 系统页面Id
  systemId: SystemIdConstant;

  // 安卓更新地址
  androidUpdateUrl: string;

  // 苹果更新地址
  iosUpdateUrl: string;
}

export let ICMP_CONSTANT = new InjectionToken<IcmpConstant>('icmp.constant');

export const systemIdConstant: SystemIdConstant = {
  application: 'application',
  queryList: 'query',
  queryDetail: 'queryDetail',
  todoList: 'bpm',
  instaShot: 'instaShot',
  statisticsSearch: 'statisticsSearch',
  statisticsView: 'statisticsView',
  emergency: 'emergency'
};

export const icmpConstant: IcmpConstant = {
  pageSize: '20',
  reqResultSuccess: '0',
  systemId: systemIdConstant,
  androidUpdateUrl: 'https://www.baidu.com',
  iosUpdateUrl: 'https://www.baidu.com'
};
