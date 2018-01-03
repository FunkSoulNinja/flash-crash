import _ from 'lodash';
import { REHYDRATE } from 'redux-persist/constants';

import { CREATE_CARD, UPDATE_CARD, DELETE_CARD } from '../actions/types';

// const INITIAL_STATE = {
// 	"1": {
// 		id: "1",
// 		question: `Why Am I so awesome? Is it because I'm a ninja? Is it because I'm a programmer ninja?`,
// 		answer: "lkjdlksdklfj skldjfkls dkfjd slkfdsjkl fowefjwo  wflwfek wj fw wjj "
// 	},
// 	"2": {
// 		id: "2",
// 		question: "Why is a fish when it swims",
// 		answer: "d jsldkfjldk s  jejfw ewjf fwef j"
// 	},
// 	"3": {
// 		id: "3",
// 		question: "Ping para ping ping ping",
// 		answer: "test answer 3"
// 	},
// };

export default (state = {}, action) => {
    switch (action.type) {
        case REHYDRATE:
            return action.payload.cards || {};
        case CREATE_CARD:
            return { ...state, [action.payload.id]: { ...action.payload } };
        case UPDATE_CARD:
            return { ...state, [action.payload.id]: { ...action.payload } };
        case DELETE_CARD:
            return _.omit(state, action.payload);

        default:
            return state;
    }
};
