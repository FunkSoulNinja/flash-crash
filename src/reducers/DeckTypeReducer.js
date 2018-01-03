import { SET_DECK_TYPE } from '../actions/types';

export default (state = true, action) => {
    switch (action.type) {
        case SET_DECK_TYPE:
            return action.payload;
        default:
            return state;
    }
};
