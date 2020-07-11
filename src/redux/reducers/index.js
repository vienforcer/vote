import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import Common from './commonReducers';
 

export default combineReducers({ todos, visibilityFilter, Common })