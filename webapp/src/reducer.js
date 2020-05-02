import { combineReducers } from "redux";
import common from "./reducers/common";
import auth from "./reducers/auth";

const reducer = combineReducers({
  auth,
  common,
});

export default reducer;
