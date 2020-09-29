import React from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import KeyboardBackspaceRoundedIcon from "@material-ui/icons/KeyboardBackspaceRounded";

const BackButton = (props) => {
  return (
    <>
      {props.isAuthenticated && props.showBack && (
        <Link
          to={props.backLink}
          style={{ borderRadius: "100px", zIndex: "1200" }}
        >
          <Button
            edge="start"
            color="secondary"
            aria-label="open drawer"
            // onClick={open ? handleDrawerClose : handleDrawerOpen}
            // className={isMobile && clsx(classes.menuButton)}
            className="header-title-button"
          >
            <KeyboardBackspaceRoundedIcon
              style={{ marginRight: "5px" }}
              color="secondary"
            />
            <Typography color="secondary" style={{ fontWeight: "500" }}>
              {props.backText}
            </Typography>
          </Button>
        </Link>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.currentUser.id != undefined,
    currentTheme: state.theme.theme,
    headerTitle: state.header.title,
    drawerOpen: state.theme.drawerOpen,
    darkTheme:
      state.theme.theme == "dark" ||
      state.theme.theme == "solarizedDark" ||
      state.theme.theme == "palpatine",
    showBack: state.theme.backButton.showBack,
    backText: state.theme.backButton.backText,
    backLink: state.theme.backButton.backLink,
  };
};

// const mapDispatchToProps = (dispatch) => {
//   return {
//     logout: () => dispatch(actions.logout()),
//     changeTheme: (newTheme) => dispatch(themeActions.changeTheme(newTheme)),
//     toggleDrawer: (val) => dispatch(themeActions.toggleDrawer(val)),
//   };
// };

export default withRouter(connect(mapStateToProps, null)(BackButton));
