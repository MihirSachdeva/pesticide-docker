import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  open: false,
};

const showSnackbar = (state, action) => {
  return updateObject(state, {
    open: action.open,
    style: action.style,
    text: action.text,
    duration: action.duration,
  });
};

const hideSnackbar = (state, action) => {
  return updateObject(state, {
    open: false,
    style: "info",
    text: "",
    duration: 0,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_SNACKBAR:
      return showSnackbar(state, action);
    case actionTypes.HIDE_SNACKBAR:
      return hideSnackbar(state, action);
    default:
      return state;
  }
};

export default reducer;
