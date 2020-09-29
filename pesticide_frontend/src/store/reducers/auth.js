import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  error: null,
  currentUser: {
    id: null,
    is_master: null,
  },
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
  });
};

const authSuccess = (state, action) => {
  return updateObject(state, {
    currentUser: {
      id: action.currentUser.id,
      is_master: action.currentUser.is_master,
    },
    error: null,
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {});
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);

    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);

    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);

    case actionTypes.AUTH_FAIL:
      return authFail(state, action);

    default:
      return state;
  }
};

export default reducer;
