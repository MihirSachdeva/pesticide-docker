import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const Layout = (props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      height: "100vh",
      overflow: "auto",
      paddingBottom: (props.isAuthenticated && isMobile) && "60px"
    },
  }));
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <Header />
        <main id="main-main" className={classes.content}>
          <div className={classes.appBarSpacer} />
          {props.children}
        </main>
        {isMobile && <BottomNav />}
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    currentTheme: state.theme.theme,
    headerTitle: state.header.title,
  };
};

export default withRouter(connect(mapStateToProps, null)(Layout));
