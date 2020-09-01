import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  theme: localStorage.getItem("theme") || "default",
  drawerOpen: false,
  backButton: {
    showBack: false,
    backText: "",
    backLink: "",
  },
  bottomNav: "HOME"
};

const changeTheme = (state, action) => {
  return updateObject(state, {
    theme: action.theme,
  });
};

const toggleDrawer = (state, action) => {
  return updateObject(state, {
    drawerOpen: action.drawerOpen,
  });
};

const changeBackButton = (state, action) => {
  return updateObject(state, {
    backButton: {
      showBack: action.backButton.showBack,
      backText: action.backButton.backText,
      backLink: action.backButton.backLink
    }
  });
};

const changeBottomNav = (state, action) => {
  return updateObject(state, {
    bottomNav: action.bottomNav
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_THEME:
      return changeTheme(state, action);
    case actionTypes.TOGGLE_DRAWER:
      return toggleDrawer(state, action);
    case actionTypes.UPDATE_BACK_BUTTON:
      return changeBackButton(state, action);
    case actionTypes.UPDATE_BOTTOM_NAV:
      return changeBottomNav(state, action);
    default:
      return state;
  }
};

export default reducer;
