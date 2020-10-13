import * as actionTypes from "./actionTypes";
import axios from "axios";
import * as api_links from "../../APILinks";

export const fetchSidepanelDataStart = () => {
  return {
    type: actionTypes.FETCH_SIDEPANEL_DATA_START,
  };
};

export const fetchSidepanelDataSuccess = (projects, issues) => {
  return {
    type: actionTypes.FETCH_SIDEPANEL_DATA_SUCCESS,
    projects: projects,
    issues: issues
  };
};

export const fetchSidepanelDataFail = (error) => {
  return {
    type: actionTypes.FETCH_SIDEPANEL_DATA_FAIL,
    error: error,
  };
};

export const setSearchSidepanelData = (projects, issues) => {
  return {
    type: actionTypes.SET_SEARCH_SIDEPANEL_DATA,
    projects: projects,
    issues: issues
  };
};

export const fetchSidepanel = () => {
  return (dispatch) => {
    dispatch(fetchSidepanelDataStart());
    axios
      .get(api_links.API_ROOT + "projects/")
      .then((res) => {
        const projects = res.data;
        axios
          .get(api_links.API_ROOT + "issues/")
          .then((res) => {
            const issues = res.data.results.slice(0, 5);
            dispatch(fetchSidepanelDataSuccess(projects, issues))
          })
          .catch((err) => {
            dispatch(fetchSidepanelDataFail(err));
          });
      })
      .catch((err) => {
        dispatch(fetchSidepanelDataFail(err));
      });
  };
};

export const setSearchSidepanel = (projects, issues) => {
  return (dispatch) => {
    dispatch(setSearchSidepanelData(projects, issues));
  };
};
