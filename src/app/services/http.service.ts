import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpService {
  constructor(private http: Http) { }
  // 问题点赞和取消
  problemassess(id, deviceId, type): Observable<any> {
    return this.http.get(`/problem/assess?problemId=${id}&deviceId=${deviceId}&code=${type}` );
  }
  // 获取问题详情
  getproblemDetail(id, deviceId): Observable<any> {
    return this.http.get(`/problem/info?problemId=${id}&deviceId=${deviceId}` );
  }
  // 获取问题列表
  getproblemList(id): Observable<any> {
    return this.http.get(`/admin/problem?categoryId=${id}` );
  }
  // 获取热门问题
  getproblem(): Observable<any> {
    return this.http.get('/problem/popular?pageNo=1&pageSize=7');
  }
  // 获取问题类型
  getcategory(): Observable<any> {
    return this.http.get('/admin/category');
  }
}
