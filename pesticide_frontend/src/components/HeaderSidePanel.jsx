import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Tooltip,
  InputBase,
} from "@material-ui/core";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import axios from "axios";

import Avatar from "./Avatar";

import ProjectLogo from "./ProjectLogo";
import * as actions from "../store/actions/auth";
import * as themeActions from "../store/actions/theme";
import * as sidepanelActions from "../store/actions/sidepanel";
import * as api_links from "../APILinks";

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
  const [users, setUsers] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    props.isAuthenticated && getDefaultData();
  }, [props.isAuthenticated]);

  async function getDefaultData() {
    props.fetchSidepanelData();
    axios
      .get(api_links.API_ROOT + "current_user/")
      .then((res) => {
        setIsAdmin(res.data[0].is_master);
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
        props.setSearchSidepanelData(res.data.projects, res.data.issues);
        setUsers(res.data.users);
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

            {props.projects && props.projects.length != 0 && (
              <>
                <div className="sidepanel-section-heading">
                  <div className="sidepanel-section-title">Projects</div>
                  <div className="sidepanel-section-divider"></div>
                </div>
                {props.projects.map((project) => (
                  <Link to={"/projects/" + project.projectslug}>
                    <ListItem button className="drawer-btn-filled">
                      <div className="sidepanel-item sidepanel-item-project">
                        {project.icon ? (
                          <img
                            src={api_links.ROOT + project.icon}
                            className="sidepanel-item-icon"
                          />
                        ) : (
                          <ProjectLogo
                            name={project.name}
                            style={{
                              width: "55px",
                              height: "55px",
                            }}
                          />
                        )}
                        <div className="sidepanel-item-contents">
                          <div
                            className="sidepanel-item-title"
                            title={project.name}
                          >
                            {project.name.length < 15
                              ? project.name
                              : project.name.slice(0, 15) + "..."}
                          </div>
                          <div className="sidepanel-item-context"></div>
                          <div className="sidepanel-item-members">
                            <Tooltip
                              arrow
                              interactive
                              title={
                                <React.Fragment>
                                  <List dense={true}>
                                    {project.project_members.map((member) => (
                                      <ListItem>
                                        <ListItemText primary={member.name} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </React.Fragment>
                              }
                            >
                              <AvatarGroup max={4}>
                                {project.project_members.map((member) =>
                                  member.display_picture ? (
                                    <Avatar
                                      src={member.display_picture}
                                      className="sidepanel-item-member-avatar"
                                      type="image"
                                    />
                                  ) : (
                                    <Avatar
                                      className="sidepanel-item-member-avatar"
                                      name={member.name}
                                      type="name"
                                    ></Avatar>
                                  )
                                )}
                              </AvatarGroup>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </ListItem>
                  </Link>
                ))}
              </>
            )}

            {props.issues && props.issues.length != 0 && (
              <>
                <div className="sidepanel-section-heading">
                  <div className="sidepanel-section-title">
                    {searchQuery == "" && "Newest"} Issues
                  </div>
                  <div className="sidepanel-section-divider"></div>
                </div>
                {props.issues.map((issue) => (
                  <Link to={"/issues/" + issue.id}>
                    <ListItem button className="drawer-btn-filled">
                      <div className="sidepanel-item sidepanel-item-issue">
                        {issue.reporter_details.display_picture ? (
                          <Avatar
                            src={issue.reporter_details.display_picture}
                            className="sidepanel-item-issue-reporter-avatar"
                            type="image"
                          />
                        ) : (
                          <Avatar
                            className="sidepanel-item-issue-reporter-avatar"
                            name={issue.reporter_details.name}
                            type="name"
                          ></Avatar>
                        )}
                        <div className="sidepanel-item-contents">
                          <div
                            className="sidepanel-item-title"
                            title={issue.title}
                          >
                            {issue.title.length < 15
                              ? issue.title
                              : issue.title.slice(0, 15) + "..."}
                          </div>
                          <div className="sidepanel-item-context">
                            <div className="sidepanel-item-context-item">
                              {issue.project_details.name &&
                                (issue.project_details.name.length < 15
                                  ? issue.project_details.name
                                  : issue.project_details.name
                                      .match(/\b([a-zA-Z])/g)
                                      .join("")) + " •"}
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
                        {user && user.display_picture ? (
                          <Avatar
                            src={user.display_picture}
                            className="sidepanel-item-issue-reporter-avatar"
                            type="image"
                          />
                        ) : (
                          <Avatar
                            className="sidepanel-item-issue-reporter-avatar"
                            name={user.name}
                            type="name"
                          ></Avatar>
                        )}
                        <div className="sidepanel-item-contents">
                          <div className="sidepanel-item-title">
                            {user.name.length < 17
                              ? user.name
                              : user.name.slice(0, 17) + "..."}
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
    isAuthenticated: state.auth.currentUser.id != undefined,
    currentTheme: state.theme.theme,
    headerTitle: state.header.title,
    darkTheme:
      state.theme.theme == "dark" ||
      state.theme.theme == "solarizedDark" ||
      state.theme.theme == "palpatine",
    projects: state.sidepanel.projects,
    issues: state.sidepanel.issues,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
    changeTheme: (newTheme) => dispatch(themeActions.changeTheme(newTheme)),
    fetchSidepanelData: () => dispatch(sidepanelActions.fetchSidepanel()),
    setSearchSidepanelData: (projects, issues) =>
      dispatch(sidepanelActions.setSearchSidepanel(projects, issues)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HeaderSidePanel)
);
