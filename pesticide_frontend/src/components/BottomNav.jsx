import React from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import BugReportRoundedIcon from "@material-ui/icons/BugReportRounded";
import WidgetsRoundedIcon from "@material-ui/icons/WidgetsRounded";
import MenuIcon from "@material-ui/icons/Menu";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import * as themeActions from "../store/actions/theme";

const BottomNav = (props) => {
  const [value, setValue] = React.useState(0);

  const themes = {
    solarizedDark: {
      type: "dark",
      primary: { main: "#eee8d5", contrastText: "#eee8d5" },
      secondary: { main: "#eee8d5", contrastText: "#ffffff" },
      background: { default: "#09232c", paper: "#002b36" },
    },
    solarizedLight: {
      type: "light",
      primary: { main: "#002b36", contrastText: "#002b36" },
      secondary: { main: "#002b36", contrastText: "#eee8d5" },
      background: { default: "#eee8d5", paper: "#fff7dd" },
    },
    palpatine: {
      type: "dark",
      primary: { main: "#e04035", contrastText: "#ffffff" },
      secondary: { main: "#e04035", contrastText: "#ffffff" },
      background: { default: "#101010", paper: "#1b1b1b" },
    },
    default: {
      type: "light",
      primary: { main: "#356fff", contrastText: "#000000" },
      secondary: { main: "#356fff", contrastText: "#ffffff" },
      background: { default: "#f0f2f5", paper: "#ffffff" },
    },
    dark: {
      type: "dark",
      primary: { main: "#356fff", contrastText: "#ffffff" },
      secondary: { main: "#ff0000", contrastText: "#ff0000" },
      background: { default: "#18191a", paper: "#242526" },
    },
  };

  const theme = (theme) =>
    createMuiTheme({
      palette: themes[theme],
      props: {
        MuiButtonBase: {
          disableRipple: true,
        },
      },
    });

  React.useEffect(() => {
    ["HOME", "PROJECTS", "ISSUES"].includes(props.bottomNav)
      ? setValue(props.bottomNav)
      : setValue(-1);
  }, [props.bottomNav]);

  return (
    <>
      {props.isAuthenticated && (
        <ThemeProvider theme={theme(props.currentTheme)}>
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
              newValue != "MORE" && setValue(newValue);
            }}
            showLabels
            className="bottom-nav"
          >
            <BottomNavigationAction
              label="Home"
              value="HOME"
              icon={<HomeRoundedIcon />}
              component={Link}
              to="/"
              style={{ fontWeight: "700" }}
            />
            <BottomNavigationAction
              label="Projects"
              value="PROJECTS"
              icon={<WidgetsRoundedIcon />}
              component={Link}
              to="/projects"
              style={{ fontWeight: "700" }}
            />
            <BottomNavigationAction
              label="Issues"
              value="ISSUES"
              icon={<BugReportRoundedIcon />}
              component={Link}
              to="/issues"
              style={{ fontWeight: "700" }}
            />

            <BottomNavigationAction
              label="More"
              value="MORE"
              icon={<MenuIcon />}
              onClick={() => {
                props.toggleDrawer(true);
              }}
              style={{ fontWeight: "700" }}
            />
          </BottomNavigation>
        </ThemeProvider>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.currentUser.id != undefined,
    is_master: state.auth.currentUser.is_master,
    currentTheme: state.theme.theme || "default",
    drawerOpen: state.theme.drawerOpen,
    bottomNav: state.theme.bottomNav,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleDrawer: (val) => dispatch(themeActions.toggleDrawer(val)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BottomNav)
);
