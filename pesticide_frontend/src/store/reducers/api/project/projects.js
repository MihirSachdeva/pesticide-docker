import * as actionTypes from "../../../actions/actionTypes";
import { updateObject } from "../../../utility";

const initialState = {
  projects: [],
  error: null,
};

const fetchProjectsStart = (state, action) => {
  return updateObject(state, {
    error: null,
  });
};

const fetchProjectsSuccess = (state, action) => {
  return updateObject(state, {
    projects: action.projects,
    error: null,
  });
};

const fetchProjectsFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PROJECTS_START:
      return fetchProjectsStart(state, action);

    case actionTypes.FETCH_PROJECTS_SUCCESS:
      return fetchProjectsSuccess(state, action);

    case actionTypes.FETCH_PROJECTS_FAIL:
      return fetchProjectsFail(state, action);

    default:
      return state;
  }
};

export default reducer;
