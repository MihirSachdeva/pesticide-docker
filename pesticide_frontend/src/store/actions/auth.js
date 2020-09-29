import * as actionTypes from "./actionTypes";
import axios from "axios";
import * as api_links from "../../APILinks";
import Cookies from "js-cookie";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, id, is_master) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
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
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("id");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const authLogin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post(api_links.REST_AUTH_LOGIN, {
        username: username,
        password: password,
      })
      .then((res) => {
        const userId = res.data.user.id;
        const token = res.data.key;
        localStorage.setItem("token", token);
        localStorage.setItem("id", userId);
        dispatch(authSuccess(token, userId));
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    localStorage.setItem(
      "hint",
      "I wish the dark theme were... darker, maybe even as dark as palpatine :)"
    );
    if (token === undefined) {
      dispatch(logout());
    } else {
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: "Token " + token,
      };
      axios
        .get(api_links.API_ROOT + "current_user/")
        .then((res) => {
          const id = res.data[0].id;
          const is_master = res.data[0].is_master;
          localStorage.setItem("id", id);
          dispatch(authSuccess(token, id, is_master));
        })
        .catch((err) => {
          console.log(err);
          dispatch(authFail(err));
        });
    }
  };
};
