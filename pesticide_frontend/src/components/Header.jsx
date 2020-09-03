import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/SwipeableDrawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import BugReportRoundedIcon from "@material-ui/icons/BugReportRounded";
import SettingsIcon from "@material-ui/icons/Settings";
import WidgetsRoundedIcon from "@material-ui/icons/WidgetsRounded";
import SecurityRoundedIcon from "@material-ui/icons/SecurityRounded";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import PeopleIcon from "@material-ui/icons/People";
import DefaultTooltip from "@material-ui/core/Tooltip";
import Brightness4RoundedIcon from "@material-ui/icons/Brightness4Rounded";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import NewProjectWithModal from "../components/NewProjectWithModal";
import HeaderSidePanel from "./HeaderSidePanel";
import BackButton from "./BackButton";
import * as actions from "../store/actions/auth";
import * as themeActions from "../store/actions/theme";
import * as api_links from "../APILinks";
import axios from "axios";

const drawerWidth = 240;

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
}));

const Header = (props) => {
  const Tooltip = withStyles({
    tooltip: {
      backgroundColor: props.darkTheme ? "#353535" : "#ffffff",
      color: props.darkTheme ? "#ffffff" : "#353535",
      backdropFilter: "blur(20px)",
      fontSize: "17px",
      fontWeight: "900",
      padding: "5px",
      border: "1px solid #808080b3",
      borderRadius: "10px",
    },
  })(DefaultTooltip);

  const appBarBg = {
    default: {
      backgroundColor: "#ffffff",
    },
    dark: {
      backgroundColor: "#282828",
    },
    solarizedLight: {
      backgroundColor: "#fff7dd",
    },
    solarizedDark: {
      backgroundColor: "#002b36",
    },
    palpatine: {
      backgroundColor: "#1a1a1a",
    },
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const classes = useStyles();
  // const [open, setOpen] = useState(window.innerWidth > 850);
  const [open, setOpen] = useState(props.drawerOpen);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
    props.toggleDrawer(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);

  const handleNavMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNavMenuClose = () => {
    setAnchorEl(null);
  };

  const magic = {
    color: props.currentTheme == "palpatine" && "red",
  };

  const [projects, setProjects] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [enrNo, setEnrNo] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: "Token " + token,
    };
    token &&
      axios
        .get(api_links.API_ROOT + "projects/")
        .then((res) => {
          setProjects(res.data);
        })
        .catch((err) => console.log(err));
    token &&
      axios
        .get(api_links.API_ROOT + "current_user/")
        .then((res) => {
          setEnrNo(res.data[0].enrollment_number);
          setIsAdmin(res.data[0].is_master);
          setUser(res.data[0]);
        })
        .catch((err) => console.log(err));
  }, [props.isAuthenticated, props.currentTheme]);

  const [anchorThemeEl, setAnchorThemeEl] = useState(null);

  const handleThemeBtnClick = (event) => {
    setAnchorThemeEl(event.currentTarget);
  };

  const handleThemeBtnClose = () => {
    setAnchorThemeEl(null);
  };

  return (
    <>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar)}
        style={appBarBg[props.currentTheme]}
      >
        <Toolbar>
          <BackButton />

          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={
              props.currentTheme == "palpatine"
                ? classes.title + " glow"
                : classes.title
            }
            style={{
              textAlign: "center",
              fontWeight: "800",
              position: "absolute",
              left: "0",
              right: "0",
            }}
          >
            {props.headerTitle}
          </Typography>
          <div style={{ position: "absolute", right: "0" }}>
            {
              <Button
                aria-controls="simple-theme-menu"
                aria-haspopup="true"
                color="inherit"
                className="header-title-button"
              >
                <Brightness4RoundedIcon onClick={handleThemeBtnClick} />
                <Menu
                  id="simple-theme-menu"
                  anchorEl={anchorThemeEl}
                  keepMounted
                  open={Boolean(anchorThemeEl)}
                  onClose={handleThemeBtnClose}
                  style={{ marginTop: "30px" }}
                >
                  <div className="menu-list-section-header">
                    <div className="menu-list-section-title">Themes</div>
                    <div className="menu-list-section-divider"></div>
                  </div>

                  <MenuItem
                    className={
                      props.currentTheme === "default" && "active-menu-option"
                    }
                    onClick={() => {
                      handleThemeBtnClose();
                      props.changeTheme("default");
                    }}
                  >
                    Light
                  </MenuItem>
                  <MenuItem
                    className={
                      props.currentTheme === "dark" && "active-menu-option"
                    }
                    onClick={() => {
                      handleThemeBtnClose();
                      props.changeTheme("dark");
                    }}
                  >
                    Dark
                  </MenuItem>
                  <MenuItem
                    className={
                      props.currentTheme === "solarizedLight" &&
                      "active-menu-option"
                    }
                    onClick={() => {
                      handleThemeBtnClose();
                      props.changeTheme("solarizedLight");
                    }}
                  >
                    Solarized Light
                  </MenuItem>
                  <MenuItem
                    className={
                      props.currentTheme === "solarizedDark" &&
                      "active-menu-option"
                    }
                    onClick={() => {
                      handleThemeBtnClose();
                      props.changeTheme("solarizedDark");
                    }}
                  >
                    Solarized Dark
                  </MenuItem>
                </Menu>
              </Button>
            }

            {props.isAuthenticated && (
              <Button className="header-title-button header-title-user">
                <div
                  color="inherit"
                  onClick={handleNavMenuOpen}
                  className="header-user-button"
                >
                  <img
                    src={(user && user.display_picture) || "../sunglasses.svg"}
                    className="header-user-image"
                  />
                  {!isMobile && (
                    <div className="header-user-name">{user && user.name}</div>
                  )}
                </div>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleNavMenuClose}
                  style={{ marginTop: "30px" }}
                >
                  <div className="menu-list-section-header">
                    <div className="menu-list-section-title">
                      {props.currentTheme != "palpatine"
                        ? "Hey!"
                        : "Use The Force"}
                    </div>
                    <div className="menu-list-section-divider"></div>
                  </div>

                  <Link to="/settings">
                    <MenuItem onClick={handleNavMenuClose}>Settings</MenuItem>
                  </Link>
                  <Link to={enrNo && "/users/" + enrNo}>
                    <MenuItem onClick={handleNavMenuClose}>My Page</MenuItem>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin">
                      <MenuItem onClick={handleNavMenuClose}>Admin</MenuItem>
                    </Link>
                  )}
                  <MenuItem
                    onClick={() => {
                      props.logout();
                      window.location.href = "/signin";
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {props.isAuthenticated && (
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          classes={{
            paper: clsx(
              classes.drawerPaper,
              !props.drawerOpen && classes.drawerPaperClose
            ),
          }}
          open={props.drawerOpen}
          ModalProps={{ onBackdropClick: handleDrawerClose }}
        >
          <div className={classes.toolbarIcon}>
            <Typography
              style={{
                margin: "15px",
                marginRight: "auto",
                fontSize: "25px",
                fontWeight: "600",
              }}
            >
              Pesticide
            </Typography>
            <Button
              onClick={handleDrawerClose}
              style={{ padding: "12px", margin: "2px", borderRadius: "10px" }}
              className="header-title-button"
            >
              <ChevronLeftIcon />
            </Button>
          </div>

          <List>
            <Link to="/">
              <Tooltip
                title={!props.drawerOpen ? "Home" : ""}
                placement="right"
                className="drawer-btn-filled"
              >
                <ListItem
                  button
                  onClick={() => {
                    isMobile && handleDrawerClose();
                  }}
                >
                  <ListItemIcon style={magic}>
                    <div className="drawer-project-icon-container">
                      <HomeRoundedIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItem>
              </Tooltip>
            </Link>

            <Link to="/users">
              <Tooltip
                title={!props.drawerOpen ? "Users" : ""}
                placement="right"
                className="drawer-btn-filled"
              >
                <ListItem
                  button
                  onClick={() => {
                    isMobile && handleDrawerClose();
                  }}
                >
                  <ListItemIcon style={magic}>
                    <div className="drawer-project-icon-container">
                      <PeopleIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Users" />
                </ListItem>
              </Tooltip>
            </Link>

            <Link to="/projects">
              <Tooltip
                title={!props.drawerOpen ? "Projects" : ""}
                placement="right"
                className="drawer-btn-filled"
              >
                <ListItem
                  button
                  onClick={() => {
                    isMobile && handleDrawerClose();
                  }}
                >
                  <ListItemIcon style={magic}>
                    <div className="drawer-project-icon-container">
                      <WidgetsRoundedIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Projects" />
                </ListItem>
              </Tooltip>
            </Link>

            <Link to="/issues">
              <Tooltip
                title={!props.drawerOpen ? "Issues" : ""}
                placement="right"
                className="drawer-btn-filled"
              >
                <ListItem
                  button
                  onClick={() => {
                    isMobile && handleDrawerClose();
                  }}
                >
                  <ListItemIcon style={magic}>
                    <div className="drawer-project-icon-container">
                      <BugReportRoundedIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Issues" />
                </ListItem>
              </Tooltip>
            </Link>

            <Link to="/settings">
              <Tooltip
                title={!props.drawerOpen ? "Settings" : ""}
                placement="right"
                className="drawer-btn-filled"
              >
                <ListItem
                  button
                  onClick={() => {
                    isMobile && handleDrawerClose();
                  }}
                >
                  <ListItemIcon style={magic}>
                    <div className="drawer-project-icon-container">
                      <SettingsIcon />
                    </div>
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
              </Tooltip>
            </Link>

            <NewProjectWithModal open={props.drawerOpen} />

            {isAdmin && (
              <Link to="/admin">
                <Tooltip
                  title={!props.drawerOpen ? "Admin" : ""}
                  placement="right"
                  className="drawer-btn-filled"
                >
                  <ListItem
                    button
                    onClick={() => {
                      isMobile && handleDrawerClose();
                    }}
                  >
                    <ListItemIcon style={magic}>
                      <div className="drawer-project-icon-container">
                        <SecurityRoundedIcon />
                      </div>
                    </ListItemIcon>
                    <ListItemText primary="Admin" />
                  </ListItem>
                </Tooltip>
              </Link>
            )}
          </List>

          {isMobile && (
            <List>
              <div className="menu-list-section-header">
                <div className="menu-list-section-title">Projects</div>
                <div className="menu-list-section-divider"></div>
              </div>

              {projects.map((project) => (
                <>
                  <Link to={"/projects/" + project.projectslug}>
                    <Tooltip
                      title={!props.drawerOpen ? project.name : ""}
                      placement="right"
                      className="drawer-btn-filled"
                    >
                      <ListItem
                        button
                        onClick={() => {
                          isMobile && handleDrawerClose();
                        }}
                      >
                        <ListItemIcon>
                          <div className="drawer-project-icon-container">
                            <img
                              src={
                                project.icon != undefined
                                  ? api_links.ROOT + project.icon
                                  : props.currentTheme == "palpatine"
                                  ? "../icon/project/appicon_red.svg"
                                  : "../icon/project/appicon.svg"
                              }
                              style={{
                                width: "35px",
                                borderRadius: "9px",
                                padding: "2px",
                              }}
                            />
                          </div>
                        </ListItemIcon>
                        <ListItemText primary={project.name} />
                      </ListItem>
                    </Tooltip>
                  </Link>
                </>
              ))}
            </List>
          )}
        </Drawer>
      )}

      <HeaderSidePanel />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    currentTheme: state.theme.theme,
    headerTitle: state.header.title,
    drawerOpen: state.theme.drawerOpen,
    darkTheme:
      state.theme.theme == "dark" ||
      state.theme.theme == "solarizedDark" ||
      state.theme.theme == "palpatine",
    showBackButton: state.theme.showBackButton,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
    changeTheme: (newTheme) => dispatch(themeActions.changeTheme(newTheme)),
    toggleDrawer: (val) => dispatch(themeActions.toggleDrawer(val)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
