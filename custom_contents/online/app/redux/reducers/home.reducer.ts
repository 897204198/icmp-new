import { HomeActions, REPLACE } from '../actions/home.action';

// 请求计数Reducer
export let homeReducer = (state: string = '', action: HomeActions): string => {
  switch (action.type) {
    case REPLACE:
      return action.payload;
    default:
      return state;
  }
};
