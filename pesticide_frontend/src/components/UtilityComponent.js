import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter, Redirect } from "react-router-dom";
import { API_ROOT } from "../APILinks";
import BACK_BUTTONS from "../../src/backButton";
import * as headerActions from "../store/actions/header";
import * as themeActions from "../store/actions/theme";

const UtilityComponent = (props) => {
  const [user, setUser] = React.useState({
    status: "",
  });
  React.useEffect(() => {
    const docTitle =
      props.title == "Pesticide" ? "Pesticide" : props.title + " - Pesticide";
    document.title = docTitle;
    let token = localStorage.getItem("token") || "";
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    };
    !props.error404 &&
      axios
        .get(API_ROOT + "user_logged_in/")
        .then((res) => {
          setUser({
            status: "LOGGED_IN",
            is_master: res.data[0].is_master,
          });
        })
        .catch((err) => {
          console.log(err);
          setUser({ status: "NOT_LOGGED_IN" });
        });
  }, [props]);
  React.useEffect(() => {
    props.changeHeaderTitle(props.title);
    props.changeBackButton(
      BACK_BUTTONS[props.page].showBack,
      BACK_BUTTONS[props.page].backText,
      BACK_BUTTONS[props.page].backLink
    );
    ["HOME", "PROJECTS", "ISSUES"].includes(props.page)
      ? props.changeBottomNav(props.page)
      : props.changeBottomNav("");
    !props.customRenderScroll &&
      document.getElementById("main-main").scrollTo(0, 0);
  }, [props.title]);
  return (
    <div style={{ display: "none" }}>
      {props.not && user.status === "LOGGED_IN" && <Redirect to="/" />}
      {props.onlyAdmins &&
        user.status === "LOGGED_IN" &&
        user.is_master === false && <Redirect to="/" />}
      {!props.onLogin && user.status === "NOT_LOGGED_IN" && (
        <Redirect to="/signin" />
      )}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeHeaderTitle: (title) => dispatch(headerActions.changeTitle(title)),
    changeBackButton: (showBack, backText, backLink) =>
      dispatch(themeActions.changeBackButton(showBack, backText, backLink)),
    changeBottomNav: (bottomNav) =>
      dispatch(themeActions.changeBottomNav(bottomNav)),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(UtilityComponent));
