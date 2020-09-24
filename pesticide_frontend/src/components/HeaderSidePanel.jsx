import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import DefaultTooltip from "@material-ui/core/Tooltip";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";

import * as actions from "../store/actions/auth";
import * as themeActions from "../store/actions/theme";
import * as api_links from "../APILinks";

import axios from "axios";

const drawerWidth = 270;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  fixedHeight: {
    height: 240,
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: 0,
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
  },
}));

const HeaderSidePanel = (props) => {
  const Tooltip = withStyles({
    tooltip: {
      backgroundColor: props.darkTheme ? "#353535" : "#ffffff",
      color: props.darkTheme ? "#ffffff" : "#353535",
      backgroundFilter: "blur(20px)",
      fontSize: "17px",
      fontWeight: "900",
      padding: "5px",
      border: "1px solid #808080b3",
      borderRadius: "10px",
    },
  })(DefaultTooltip);
  const searchClass = {
    position: "relative",
    borderRadius: "7px",
    backgroundColor: props.darkTheme ? "rgba(0,0,0,0.20)" : "rgba(0,0,0,0.10)",
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "10px 5px",
    height: "50px",
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  const [projects, setProjects] = React.useState([]);
  const [issues, setIssues] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    };
    token && getDefaultData();
  }, [props.isAuthenticated]);

  async function getDefaultData() {
    axios
      .get(api_links.API_ROOT + "projects/")
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => console.log(err));
    axios
      .get(api_links.API_ROOT + "current_user/")
      .then((res) => {
        setIsAdmin(res.data[0].is_master);
      })
      .catch((err) => console.log(err));
    axios
      .get(api_links.API_ROOT + "issues/")
      .then((res) => {
        setIssues(res.data.results.slice(0, 5));
      })
      .catch((err) => console.log(err));
    axios
      .get(api_links.API_ROOT + "users/")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }

  async function getSearchData(search) {
    axios
      .get(api_links.API_ROOT + `search?q=${search}`)
      .then((res) => {
        setIssues(res.data.issues);
        setUsers(res.data.users);
        setProjects(res.data.projects);
      })
      .catch((err) => console.log(err));
  }

  const handleSearch = (event) => {
    const newSearchQuery = event.target.value;
    if (newSearchQuery != searchQuery) {
      setSearchQuery(newSearchQuery);
      newSearchQuery != "" ? getSearchData(newSearchQuery) : getDefaultData();
    }
  };

  const special = [
    "zeroth",
    "first",
    "second",
    "third",
    "fourth",
    "fifth",
    "sixth",
    "seventh",
    "eighth",
    "ninth",
    "tenth",
    "eleventh",
    "twelfth",
    "thirteenth",
    "fourteenth",
    "fifteenth",
    "sixteenth",
    "seventeenth",
    "eighteenth",
    "nineteenth",
  ];
  const deca = [
    "twent",
    "thirt",
    "fort",
    "fift",
    "sixt",
    "sevent",
    "eight",
    "ninet",
  ];
  function stringifyNumber(n) {
    if (n < 20) return special[n];
    if (n % 10 === 0) return deca[Math.floor(n / 10) - 2] + "ieth";
    return deca[Math.floor(n / 10) - 2] + "y-" + special[n % 10];
  }

  return (
    <>
      {props.isAuthenticated && !isMobile && (
        <Drawer
          variant={"permanent"}
          classes={{
            paper: clsx(classes.drawerPaper),
          }}
        >
          <div className={classes.toolbarIcon}>
            <Typography
              style={{
                margin: "15px",
                marginRight: "auto",
                fontSize: "25px",
                fontWeight: "600",
              }}
            ></Typography>
          </div>

          <List>
            <ListItem
              style={{ padding: "4px 10px", margin: "7px", width: "auto" }}
            >
              <div style={searchClass}>
                <div className={classes.searchIcon}>
                  <SearchIcon />
                </div>
                <InputBase
                  placeholder="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  inputProps={{ "aria-label": "search" }}
                />
              </div>
            </ListItem>

            {projects.length != 0 && (
              <>
                <div className="sidepanel-section-heading">
                  <div className="sidepanel-section-title">Projects</div>
                  <div className="sidepanel-section-divider"></div>
                </div>
                {projects.map((project) => (
                  <Link to={"/projects/" + project.projectslug}>
                    <ListItem button className="drawer-btn-filled">
                      <div className="sidepanel-item sidepanel-item-project">
                        <img
                          src={
                            project.icon
                              ? api_links.ROOT + project.icon
                              : props.currentTheme == "palpatine"
                              ? "/icon/project/appicon_red.svg"
                              : "/icon/project/appicon.svg"
                          }
                          className="sidepanel-item-icon"
                        />
                        <div className="sidepanel-item-contents">
                          <div className="sidepanel-item-title">
                            {project.name.length < 15
                              ? project.name
                              : project.name.slice(0, 15) + "..."}
                          </div>
                          <div className="sidepanel-item-context"></div>
                          <div className="sidepanel-item-members">
                            {project.project_members.map((member) => (
                              <img
                                src={
                                  member.display_picture || "/sunglasses.svg"
                                }
                                className="sidepanel-item-member-image"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </ListItem>
                  </Link>
                ))}
              </>
            )}

            {issues.length != 0 && (
              <>
                <div className="sidepanel-section-heading">
                  <div className="sidepanel-section-title">
                    {searchQuery == "" && "Newest"} Issues
                  </div>
                  <div className="sidepanel-section-divider"></div>
                </div>
                {issues.map((issue) => (
                  <Link to={"/issues/" + issue.id}>
                    <ListItem button className="drawer-btn-filled">
                      <div className="sidepanel-item sidepanel-item-issue">
                        <img
                          src={
                            (issue.reporter_details &&
                              issue.reporter_details.display_picture) ||
                            "/sunglasses.svg"
                          }
                          className="sidepanel-item-icon"
                          style={{ borderRadius: "100px" }}
                        />
                        <div className="sidepanel-item-contents">
                          <div className="sidepanel-item-title">
                            {issue.title.length < 15
                              ? issue.title
                              : issue.title.slice(0, 15) + "..."}
                          </div>
                          <div className="sidepanel-item-context">
                            <div className="sidepanel-item-context-item">
                              {issue.project_details.name + " •"}
                            </div>
                            <div className="sidepanel-item-context-item">
                              {issue.status_text.length < 10
                                ? issue.status_text
                                : issue.status_text.slice(0, 10) + "..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListItem>
                  </Link>
                ))}
              </>
            )}

            {searchQuery != "" && users.length != 0 && (
              <>
                <div className="sidepanel-section-heading">
                  <div className="sidepanel-section-title">Users</div>
                  <div className="sidepanel-section-divider"></div>
                </div>
                {users.map((user) => (
                  <Link to={"/users/" + user.enrollment_number}>
                    <ListItem button className="drawer-btn-filled">
                      <div className="sidepanel-item sidepanel-item-issue">
                        <img
                          src={user.display_picture || "/sunglasses.svg"}
                          className="sidepanel-item-icon"
                          style={{ borderRadius: "100px" }}
                        />
                        <div className="sidepanel-item-contents">
                          <div className="sidepanel-item-title">
                            {user.name}
                          </div>
                          <div className="sidepanel-item-context">
                            <div className="sidepanel-item-context-item">
                              {stringifyNumber(user.current_year) &&
                                stringifyNumber(user.current_year)
                                  .charAt(0)
                                  .toUpperCase() +
                                  stringifyNumber(user.current_year).slice(1) +
                                  " year"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </ListItem>
                  </Link>
                ))}
              </>
            )}
          </List>
        </Drawer>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    currentTheme: state.theme.theme,
    headerTitle: state.header.title,
    darkTheme:
      state.theme.theme == "dark" ||
      state.theme.theme == "solarizedDark" ||
      state.theme.theme == "palpatine",
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
    changeTheme: (newTheme) => dispatch(themeActions.changeTheme(newTheme)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HeaderSidePanel)
);
