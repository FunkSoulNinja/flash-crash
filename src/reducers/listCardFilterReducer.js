import { UPDATE_LIST_CARD_FILTER } from '../actions/types';

export default (state = 1, action) => {
    switch (action.type) {
        case UPDATE_LIST_CARD_FILTER:
            return action.payload;
        default:
            return state;
    }
};
