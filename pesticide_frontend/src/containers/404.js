import React from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import * as api_links from "../APILinks";
import UtilityComponent from "../components/UtilityComponent";

const Page404 = (props) => {
  return (
    <>
      <UtilityComponent title="404 Not Found" page="ERROR404" error404 />
      <div className="not-found">
        <img
          src={props.image}
          alt="404 Illustration"
          className="not-found-illustration vert-move"
        />
        <div className="not-found-title">FOUNDN'T!</div>
        <div className="not-found-text">
          Grats! You broke it! 🥳
          <br />
          The page you were trying to open doesn't exist or some other horrible
          error has occurred. Now either you need a typing lesson or I need to
          fix some silly bugs.
          <br />
          Feel free to hit me up{" "}
          <a href="//www.github.com/mihirsachdeva">
            <strong>@MihirSachdeva</strong>
          </a>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            width: "100%",
            margin: "20px 0",
          }}
        >
          <a href={api_links.RICKROLLED}>
            <Button className="btn-filled btn-filled-blue">Back To Home</Button>
          </a>
          <Link to="/">
            <Button className="btn-filled btn-filled-pink">
              Mandatory Rickroll
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.currentUser.id != undefined,
    currentTheme: state.theme.theme,
    image: ((theme) => {
      switch (theme) {
        case "default":
          return "../404/404_light.svg";
        case "dark":
          return "../404/404_dark.svg";
        case "solarizedLight":
          return "../404/404_sol_light.svg";
        case "solarizedDark":
          return "../404/404_sol_dark.svg";
        case "palpatine":
          return "../404/404_red.svg";
        case "dracula":
          return "../404/404_dracula.svg";
        default:
          return "../404/404_light.svg";
      }
    })(state.theme.theme),
  };
};

export default withRouter(connect(mapStateToProps, null)(Page404));
