import * as actionTypes from "./actionTypes";

export const setTitle = (title) => {
  return {
    type: actionTypes.HEADER_TITLE,
    title: title,
  };
};

export const changeTitle = (title = "Pesticide") => {
  return (dispatch) => {
    dispatch(setTitle(title));
  };
};
