import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Signin from "./containers/Signin";
import Onlogin from "./containers/Onlogin";
import Dashboard from "./containers/Dashboard";
import Settings from "./containers/Settings";
import Projects from "./containers/Projects";
import Issues from "./containers/Issues";
import ProjectPage from "./containers/ProjectPage";
import UsersPage from "./containers/UsersPage";
import UserPage from "./containers/UserPage";
import Admin from "./containers/Admin";
import Issue from "./containers/Issue";
import Page404 from "./containers/404";

const BaseRouter = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/signin" component={Signin} />
      <Route exact path="/onlogin" component={Onlogin} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/projects" component={Projects} />
      <Route exact path="/issues" component={Issues} />
      <Route exact path="/users" component={UsersPage} />
      <Route exact path="/admin" component={Admin} />
      <Route exact path="/users/:enrollmentNumber" component={UserPage} />
      <Route exact path="/projects/:projectslug" component={ProjectPage} />
      <Route
        exact
        path="/projects/:projectslug/issues/:issueId"
        component={Issue}
      />
      <Route exact path="/issues/:issueId" component={Issue} />
      <Route
        exact
        path="/issues/:issueId/comment/:commentId"
        component={Issue}
      />
      <Route exact path="/404" component={Page404} />
      <Route exact path="">
        <Redirect to="/404" />
      </Route>
    </Switch>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.currentUser.id != undefined,
  };
};

export default withRouter(connect(mapStateToProps, null)(BaseRouter));
