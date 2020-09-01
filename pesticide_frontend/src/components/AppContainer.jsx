import React from 'react';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ProjectPage from './ProjectPage';
import Projects from './Projects';
import Header from "./Header";
import Settings from './Settings';

import { ThemeProvider } from '@material-ui/styles';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';


const theme = createMuiTheme({
  palette: {
    type: "dark",
  }
});


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
}));

export default function Dashboard() {
  const classes = useStyles();

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <div className={classes.root}>
          <CssBaseline />

          <Header />



          <main className={classes.content}>

            <div className={classes.appBarSpacer} />
            <Route path="/projects" exact component={Projects} />
            <Route path="/projects/slambook" exact component={ProjectPage} />
            <Route path="/settings" exact component={Settings} />


          </main>
        </div>
      </ThemeProvider>
    </Router>
  );
}