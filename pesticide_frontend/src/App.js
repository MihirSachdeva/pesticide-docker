import React from "react";
import "./App.css";
import { connect } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import BaseRouter from "./routes";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import * as actions from "./store/actions/auth";
import Layout from "./containers/Layout";
import themes from "../src/themes"


const App = (props) => {
  const theme = (theme) =>
    createMuiTheme({
      palette: themes[theme],
      // props: {
      //   MuiButtonBase: {
      //     disableRipple: true,
      //   },
      // },
    });

  React.useEffect(() => {
    props.onTryAutoSignup();
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme(props.currentTheme)}>
        <Layout>
          <BaseRouter />
        </Layout>
      </ThemeProvider>
    </Router>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.currentUser.id != undefined,
    currentTheme: state.theme.theme || "default",
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
