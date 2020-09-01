import * as actionTypes from "../../actionTypes";
import axios from "axios";
import * as api_links from "../../../../APILinks";

export const fetchProjectsStart = () => {
  return {
    type: actionTypes.FETCH_PROJECTS_START,
  };
};

export const fetchProjectsSuccess = (projects) => {
  return {
    type: actionTypes.FETCH_PROJECTS_SUCCESS,
    projects: projects,
  };
};

export const fetchProjectsFail = (error) => {
  return {
    type: actionTypes.FETCH_PROJECTS_FAIL,
    error: error,
  };
};

export const fetchProjects = () => {
  return (dispatch) => {
    dispatch(fetchProjectsStart());
    axios
      .get(api_links.API_ROOT + "projects/")
      .then((res) => {
        const projects = res.data;
        dispatch(fetchProjectsSuccess(projects));
      })
      .catch((err) => {
        dispatch(fetchProjectsFail(err));
      });
  };
};
