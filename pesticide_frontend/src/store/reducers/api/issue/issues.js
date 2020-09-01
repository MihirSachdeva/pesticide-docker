import * as actionTypes from "../../../actions/actionTypes";
import { updateObject } from "../../../utility";

const initialState = {
  issues: [],
  error: null,
};

const fetchIssuesStart = (state, action) => {
  return updateObject(state, {
    error: null,
  });
};

const fetchIssuesSuccess = (state, action) => {
  return updateObject(state, {
    issues: action.issues,
    error: null,
  });
};

const fetchIssuesFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_ISSUES_START:
      return fetchIssuesStart(state, action);

    case actionTypes.FETCH_ISSUES_SUCCESS:
      return fetchIssuesSuccess(state, action);

    case actionTypes.FETCH_ISSUES_FAIL:
      return fetchIssuesFail(state, action);

    default:
      return state;
  }
};

export default reducer;
