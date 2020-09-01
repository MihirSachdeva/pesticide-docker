import { combineReducers } from "redux";
import auth from "./auth";
import theme from "./theme";
import header from "./header";
import projects from "./api/project/projects";
import issues from "./api/issue/issues";

export default combineReducers({
  auth,
  theme,
  header,
  projects,
  issues,
});
