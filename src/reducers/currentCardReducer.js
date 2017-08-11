import {
	SET_CURRENT_CARD
} from '../actions/types';

export default (state = null, action) => {
	switch(action.type) {
	case SET_CURRENT_CARD:
		return action.payload;

	default:
		return state;
	}
}
