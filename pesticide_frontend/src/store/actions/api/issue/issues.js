import * as actionTypes from "../../actionTypes";
import axios from "axios";
import * as api_links from "../../../../APILinks";

export const fetchIssuesStart = () => {
  return {
    type: actionTypes.FETCH_ISSUES_START,
  };
};

export const fetchIssuesSuccess = (issues) => {
  return {
    type: actionTypes.FETCH_ISSUES_SUCCESS,
    issues: issues,
  };
};

export const fetchIssuesFail = (error) => {
  return {
    type: actionTypes.FETCH_ISSUES_FAIL,
    error: error,
  };
};

export const fetchIssues = () => {
  return (dispatch) => {
    dispatch(fetchIssuesStart());
    axios
      .get(api_links.API_ROOT + "issues/")
      .then((res) => {
        const issues = res.data;
        dispatch(fetchIssuesSuccess(issues));
      })
      .catch((err) => {
        dispatch(fetchIssuesFail(err));
      });
  };
};
