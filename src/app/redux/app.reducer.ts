import { ActionReducer, combineReducers } from '@ngrx/store';
import { State } from './app.state';
import { requestReducer } from './reducers/request.reducer';
import { todoReducer } from './reducers/todo.reducer';
import { imReducer } from './reducers/im.reducer';
import { homeReducer } from './reducers/home.reducer';

export const REQUEST_INDEX_STATE = 'requestIndex';
export const TODO_BADGE_STATE = 'todoBadge';
export const IM_BADGE_STATE = 'imBadge';
export const Home_BADGE_STATE = 'homeBadge';
// 根reducer
const reducers = {
  requestIndex: requestReducer,
  todoBadge: todoReducer,
  imBadge: imReducer,
  homeBadge: homeReducer
};

const productionReducer: ActionReducer<State> = combineReducers(reducers);

// reducer工厂
export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}
