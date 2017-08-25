import { ActionReducer, combineReducers } from '@ngrx/store';
import { State } from './app.state';
import { requestReducer } from './reducers/request.reducer';
import { todoReducer } from './reducers/todo.reducer';

export const REQUEST_INDEX_STATE = 'requestIndex';
export const TODO_BADGE_STATE = 'todoBadge';

// 根reducer
const reducers = {
  requestIndex: requestReducer,
  todoBadge: todoReducer
};

const productionReducer: ActionReducer<State> = combineReducers(reducers);

// reducer工厂
export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}
