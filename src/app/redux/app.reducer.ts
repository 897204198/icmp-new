import { ActionReducer, combineReducers} from '@ngrx/store';
import { State } from './app.state';
import { requestReducer } from './reducers/request.reducer';

export const REQUEST_INDEX_STATE = 'requestIndex';

// 根reducer
const reducers = {
  requestIndex: requestReducer
};

const productionReducer: ActionReducer<State> = combineReducers(reducers);

// reducer工厂
export function reducer(state: any, action: any) {
  return productionReducer(state, action);
}
