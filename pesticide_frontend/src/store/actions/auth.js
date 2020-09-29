import * as actionTypes from "./actionTypes";
import axios from "axios";
import * as api_links from "../../APILinks";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (id, is_master) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    currentUser: {
      id: id,
      is_master: is_master,
    },
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  axios
    .post(api_links.API_ROOT + "users/onlogout/", {})
    .then((res) => {})
    .catch((err) => console.log(err));
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authLogin = (username, id) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .get(api_links.API_ROOT + "user_logged_in/")
      .then((res) => {
        const id = res.data.id;
        const isMaster = res.data.is_master;
        localStorage.setItem("id", id);
        dispatch(authSuccess(id, isMaster));
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    localStorage.setItem(
      "hint",
      "I wish the dark theme were... darker, maybe even as dark as palpatine :)"
    );
    axios
      .get(api_links.API_ROOT + "current_user/")
      .then((res) => {
        const id = res.data[0].id;
        const isMaster = res.data[0].is_master;
        localStorage.setItem("id", id);
        dispatch(authSuccess(id, isMaster));
      })
      .catch((err) => {
        console.log(err);
        dispatch(authFail(err));
      });
  };
};
