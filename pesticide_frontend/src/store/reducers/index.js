import { combineReducers } from "redux";
import auth from "./auth";
import theme from "./theme";
import header from "./header";
import projects from "./api/project/projects";
import issues from "./api/issue/issues";
import snackbar from "./snackbar";
import sidepanel from "./sidepanel";

export default combineReducers({
  auth,
  theme,
  header,
  projects,
  issues,
  snackbar,
  sidepanel,
});
