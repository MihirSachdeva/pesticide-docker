import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  title: "Pesticide",
};

const changeTitle = (state, action) => {
  return updateObject(state, {
    title: action.title,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.HEADER_TITLE:
      return changeTitle(state, action);
    default:
      return state;
  }
};

export default reducer;
