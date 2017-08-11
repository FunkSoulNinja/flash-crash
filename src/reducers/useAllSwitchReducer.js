import {
	SET_USE_ALL_SWITCH
} from '../actions/types';


export default (state = true, action) => {
	switch(action.type) {
	case SET_USE_ALL_SWITCH:
		return action.payload;
	default:
		return state;
	}
}
