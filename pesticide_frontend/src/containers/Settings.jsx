import React from "react";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

import Axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import * as themeActions from "../store/actions/theme";
import UtilityComponent from "../components/UtilityComponent";
import UserCard from "../components/UserCard";
import * as api_links from "../APILinks";
import HEADER_NAV_TITLES from "../header_nav_titles";
import TitleCard from "../components/TitleCard";

const Settings = (props) => {
  const [user, setUser] = React.useState();
  const [emailSubs, setEmailSubs] = React.useState();

  React.useEffect(() => {
    Axios.get(api_links.API_ROOT + "current_user/")
      .then((res) => {
        setUser(res.data[0]);
        Axios.get(api_links.API_ROOT + `email_subscriptions/${res.data[0].id}/`)
          .then((res) => {
            setEmailSubs(res.data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEmailSubChange = (event) => {
    const id = event.target.id;
    const value = emailSubs[id];
    Axios.patch(api_links.API_ROOT + `email_subscriptions/${user.id}/`, {
      [id]: !value,
    })
      .then((res) => {
        setEmailSubs((prevEmailSubs) => ({
          ...prevEmailSubs,
          [id]: !value,
        }));
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <UtilityComponent title={HEADER_NAV_TITLES.SETTINGS} page="SETTINGS" />

      <div>
        <TitleCard title="Settings" />

        <div
          className="user-card-container"
          style={{
            margin: "10px 5px",
          }}
        >
          {user && (
            <UserCard
              id={user.id}
              name={user.name}
              is_admin={user.is_admin}
              enrollment_number={user.enrollment_number}
              degree={user.degree}
              branch={user.branch}
              current_year={user.current_year}
              is_active={user.is_active}
              user={user.user}
              display_photo={user.display_picture}
            />
          )}
        </div>

        <center>
          <div style={{ margin: "20px" }}>
            <div style={{ fontSize: "30px", fontWeight: "700" }}>
              Email Settings
            </div>
            <div>Select when you would like to get notified by email.</div>
            <div>Your email address is: {"mihir_s@pp.iitr.ac.in"}</div>
          </div>
        </center>

        {emailSubs && (
          <div style={{ margin: "20px" }}>
            <FormControl component="fieldset" style={{ display: "inherit" }}>
              <FormGroup>
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_new_project}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_new_project"
                      checked={emailSubs.on_new_project}
                    />
                  }
                  label="When a new project is created"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_project_membership}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_project_membership"
                      checked={emailSubs.on_project_membership}
                    />
                  }
                  label="When you are added as a member in a project"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_project_status_change}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_project_status_change"
                      checked={emailSubs.on_project_status_change}
                    />
                  }
                  label="When status of a project is changed"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_new_issue}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_new_issue"
                      checked={emailSubs.on_new_issue}
                    />
                  }
                  label="When a new issue is reported in your project"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_issue_assign}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_issue_assign"
                      checked={emailSubs.on_issue_assign}
                    />
                  }
                  label="When an issue is assigned to you"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_issue_status_change}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_issue_status_change"
                      checked={emailSubs.on_issue_status_change}
                    />
                  }
                  label="When status of an issue is changed, either that you reported or are it's project member"
                  labelPlacement="end"
                />
                <hr className="divider2" />
                <FormControlLabel
                  value={emailSubs.on_new_comment}
                  onChange={handleEmailSubChange}
                  control={
                    <Switch
                      color="secondary"
                      id="on_new_comment"
                      checked={emailSubs.on_new_comment}
                    />
                  }
                  label="When a new comment is created in an issue, either that you reported, or are assigned, or are it's project member"
                  labelPlacement="end"
                />
                <hr className="divider2" />
              </FormGroup>
            </FormControl>
          </div>
        )}
      </div>

      <center>
        <div style={{ margin: "20px" }}>
          <div style={{ fontSize: "30px", fontWeight: "700" }}>Themes</div>
        </div>
      </center>

      <center
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button
          className={
            props.currentTheme === "default"
              ? "active-menu-option settings-btn"
              : "settings-btn"
          }
          onClick={() => {
            props.changeTheme("default");
          }}
        >
          Light
        </Button>
        <Button
          className={
            props.currentTheme === "dark"
              ? "active-menu-option settings-btn"
              : "settings-btn"
          }
          onClick={() => {
            props.changeTheme("dark");
          }}
        >
          Dark
        </Button>
        <Button
          className={
            props.currentTheme === "solarizedLight"
              ? "active-menu-option settings-btn"
              : "settings-btn"
          }
          onClick={() => {
            props.changeTheme("solarizedLight");
          }}
        >
          Solarized Light
        </Button>
        <Button
          className={
            props.currentTheme === "solarizedDark"
              ? "active-menu-option settings-btn"
              : "settings-btn"
          }
          onClick={() => {
            props.changeTheme("solarizedDark");
          }}
        >
          Solarized Dark
        </Button>
      </center>

      <center style={{ margin: "5px" }}>
        <Typography style={{ fontWeight: "300" }}>
          "The dark side of the Force is a pathway to many abilities some
          consider to be unnatural." - Emperor{" "}
          <strong
            className={
              props.currentTheme == "palpatine"
                ? "hover-pointer glow"
                : "hover-pointer"
            }
            style={{
              fontWeight: "900",
              fontSize: "1rem",
            }}
            onClick={() => props.changeTheme("palpatine")}
          >
            Palpatine
          </strong>
        </Typography>
        <Typography
          style={{
            margin: "20px auto",
            fontSize: "15px",
            fontWeight: "700",
          }}
        >
          Made with {props.currentTheme != "palpatine" ? "❤️️" : "👽"} by{" "}
          <a href="https://github.com/mihirsachdeva">Mihir Sachdeva</a>
        </Typography>
      </center>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    currentTheme: state.theme.theme,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeTheme: (newTheme) => dispatch(themeActions.changeTheme(newTheme)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Settings)
);
