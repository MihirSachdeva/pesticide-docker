import * as actionTypes from "./actionTypes";
import { duration } from "@material-ui/core";

export const setSnackbar = (open, style, text, duration) => {
  return open
    ? {
        type: actionTypes.SHOW_SNACKBAR,
        open: open,
        style: style,
        text: text,
        duration: duration,
      }
    : { type: actionTypes.HIDE_SNACKBAR, open: false };
};

export const changeSnackbar = (
  open = true,
  style = "info",
  text = "",
  duration = 6000
) => {
  return (dispatch) => {
    dispatch(setSnackbar(open, style, text, duration));
  };
};
