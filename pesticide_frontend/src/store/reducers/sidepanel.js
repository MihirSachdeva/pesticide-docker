import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  projects: [],
  issues: [],
  error: null
};

const fetchSidepanelDataStart = (state, action) => {
  return updateObject(state, {
    error: null,
  });
};

const fetchSidepanelDataSuccess = (state, action) => {
  return updateObject(state, {
    projects: action.projects,
    issues: action.issues,
    error: null,
  });
};

const setSearchSidepanelData = (state, action) => {
  return updateObject(state, {
    projects: action.projects,
    issues: action.issues,
    error: null,
  });
};

const fetchSidepanelDataFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SIDEPANEL_DATA_START:
      return fetchSidepanelDataStart(state, action);

    case actionTypes.FETCH_SIDEPANEL_DATA_SUCCESS:
      return fetchSidepanelDataSuccess(state, action);

    case actionTypes.FETCH_SIDEPANEL_DATA_FAIL:
      return fetchSidepanelDataFail(state, action);

    case actionTypes.SET_SEARCH_SIDEPANEL_DATA:
      return setSearchSidepanelData(state, action);

    default:
      return state;
  }
};

export default reducer;
