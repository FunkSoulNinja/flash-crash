import {
	SET_LIST_FILTER
} from '../actions/types';

export default (state = "all", action) => {
	switch(action.type) {
	case SET_LIST_FILTER:
		return action.payload;
	default:
		return state;
	}
}
