import {combineReducers} from "redux";
import app from "./app/reducer";
import courses from "./courses/reducer";
import calendar from "./calendar/reducer";
import languages from "./languages/reducer";
import interruptions from "./interruptions/reducer";
import evaluationTypes from "./evaluationTypes/reducer";
import userGroups from "./userGroups/reducer";

const reducers = combineReducers({
    app,
    courses,
    calendar,
    languages,
    interruptions,
    evaluationTypes,
    userGroups,
});

export default reducers;
