import * as actionTypes from "./actionTypes";

export const setTheme = (theme) => {
  return {
    type: actionTypes.CHANGE_THEME,
    theme: theme,
  }
}

export const toggleLeftDrawer = (drawerOpen) => {
  return {
    type: actionTypes.TOGGLE_DRAWER,
    drawerOpen: drawerOpen,
  }
}

export const updateBackButton = (showBack, backText, backLink) => {
  return {
    type: actionTypes.UPDATE_BACK_BUTTON,
    backButton: {
      showBack: showBack,
      backText: backText,
      backLink: backLink
    }
  }
}

export const updateBottomNav = (bottomNav) => {
  return {
    type: actionTypes.UPDATE_BOTTOM_NAV,
    bottomNav: bottomNav
  }
}

export const changeTheme = (theme = "default") => {
  return (dispatch) => {
    dispatch(setTheme(theme));
    localStorage.setItem("theme", theme);
  };
};

export const toggleDrawer = (drawerOpen = false) => {
  return (dispatch) => {
    dispatch(toggleLeftDrawer(drawerOpen));
  };
};

export const changeBackButton = (showBack = false, backText = "", backLink = "") => {
  return (dispatch) => {
    dispatch(updateBackButton(showBack, backText, backLink));
  };
};

export const changeBottomNav = (bottomNav = "HOME") => {
  return (dispatch) => {
    dispatch(updateBottomNav(bottomNav));
  };
};
