import React, { useState, useEffect } from "react";
import queryString from "query-string";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import * as actions from "../store/actions/auth";
import * as api_links from "../APILinks";
import UtilityComponent from "../components/UtilityComponent";
import HEADER_NAV_TITLES from "../header_nav_titles";

function Onlogin(props) {
  const [state, setState] = useState({
    user_found: false,
    got_response: false,
  });

  useEffect(() => {
    let url = props.location.search;
    let params = queryString.parse(url);

    axios({
      method: "POST",
      url: api_links.API_ROOT + "users/onlogin/",
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
      data: {
        code: params.code,
        state: params.state,
      },
    })
      .then((res) => {
        if (res.status === 201 || res.status === 202) {
          res.data.username &&
            setState({
              user_found: true,
              got_response: true,
            });
          props.onAuth(res.data.username, res.data.id);
          window.location.href = "/";
        } else {
          console.log(
            "Couldn't log in. Either it's an internal error or you have been disabled."
          );
          setState({
            user_found: false,
            got_response: true,
          });
          // window.location.href = '/signin';
        }
      })
      .catch((err) => {
        console.log(err);
        setState({
          user_found: false,
          got_response: true,
        });
      });
  }, []);

  return (
    <>
      <UtilityComponent
        not
        onLogin
        title={HEADER_NAV_TITLES.ONLOGIN}
        page="ONLOGIN"
      />
      {state.got_response ? (
        state.user_found ? (
          <div className="centered">
            <a href={api_links.RICKROLLED}>
              <img
                src="./debuggingtime.png"
                style={{ height: "300px", margin: "40px" }}
              />
            </a>
            <Typography variant="h6">Welcome to Pesticide!</Typography>
          </div>
        ) : (
          <div
            className="centered"
            style={{ justifyContent: "center", margin: "20px" }}
          >
            <a href={api_links.RICKROLLED}>
              <img
                src="./debuggingtime.png"
                style={{ height: "300px", margin: "40px" }}
              />
            </a>

            <Typography>
              {`Seems like something went wrong... Either it's a silly bug, which 
              really sucks. Or you've been disabled by an admin, which also sucks. :(`}
            </Typography>
            <Link to="/signin">
              <Button
                className="btn-filled btn-filled-error"
                style={{ margin: "10px", fontWeight: "900" }}
              >
                Trying Again Never Hurts
              </Button>
            </Link>
          </div>
        )
      ) : (
        <div className="centered">
          <a href={api_links.RICKROLLED}>
            <img
              src="./debuggingtime.png"
              style={{ height: "300px", margin: "40px" }}
            />
          </a>
          <CircularProgress
            color="secondary"
            size={50}
            style={{ marginBottom: "40px" }}
          />
          <Typography variant="h6">Loading...</Typography>
        </div>
      )}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (username, id) => dispatch(actions.authLogin(username, id)),
  };
};

export default connect(null, mapDispatchToProps)(Onlogin);
