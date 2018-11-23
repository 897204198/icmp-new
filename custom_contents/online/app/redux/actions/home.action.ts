import { Action } from '@ngrx/store';
export const REPLACE = '[Home] REPLACE';
// 替换原先的 ImBadage
export class HomeReplaceBadageAction implements Action {
  readonly type = REPLACE;
  constructor(public payload: string) {}
}
export type HomeActions = HomeReplaceBadageAction
