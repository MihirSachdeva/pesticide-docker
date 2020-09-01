import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import BugReportRoundedIcon from "@material-ui/icons/BugReportRounded";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import * as api_links from "../APILinks";
import UtilityComponent from "../components/UtilityComponent";
import HEADER_NAV_TITLES from "../header_nav_titles";

const SignIn = (props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      height: "91.55vh",
    },
    image: {
      backgroundImage: props.bgImage,
      backgroundRepeat: "no-repeat",
      backgroundColor: props.bgColor,
      backgroundSize: "contain",
      backgroundPosition: "center",
    },
    paper: {
      marginTop: "170px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: "100%",
      marginTop: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      marginTop: "30px",
    },
  }));

  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <UtilityComponent not title={HEADER_NAV_TITLES.SIGNIN} page="SIGNIN" />

      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <BugReportRoundedIcon style={{ fontSize: "40px" }} />
          </Avatar>
          <Typography component="h1" variant="h5" className="signin-title">
            Welcome to Pesticide
          </Typography>
          <form className={classes.form} noValidate>
            <a href={api_links.OMNIPORT_OAUTH}>
              <Button
                variant="contained"
                color="secondary"
                startIcon={
                  <img
                    src="./omniport.png"
                    style={{ width: "35px", margin: "0 10px" }}
                  />
                }
                style={{ textTransform: "none" }}
              >
                Sign in with Omniport
              </Button>
            </a>
            <br />
            <a href={api_links.RICKROLLED}>
              <Button
                variant="contained"
                color="primary"
                startIcon={
                  <img
                    src="./imglogo.png"
                    style={{ width: "35px", margin: "0 10px" }}
                  />
                }
                style={{ textTransform: "none" }}
              >
                Not in IMG?
              </Button>
            </a>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    bgColor: ((theme) => {
      switch (theme) {
        case "default":
          return "#ffffff";
        case "dark":
          return "#242526";
        case "solarizedDark":
          return "#0f2b36";
        case "solarizedLight":
          return "#fdf7dd";
        case "palpatine":
          return "#1b1b1b";
        default:
          return "#ffffff";
      }
    })(state.theme.theme),
    bgImage:
      state.theme.theme != "palpatine"
        ? "url(../illustrations/code_default.svg)"
        : "url(../illustrations/code_palpatine.svg)",
  };
};

export default withRouter(connect(mapStateToProps, null)(SignIn));
