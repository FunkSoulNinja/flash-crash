import {
	UPDATE_SEARCH_BAR
} from '../actions/types';

export default (state = "", action) => {
	switch(action.type) {
	case UPDATE_SEARCH_BAR:
		return action.payload;

	default:
		return state;
	}
}
