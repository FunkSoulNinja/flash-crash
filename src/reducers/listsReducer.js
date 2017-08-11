import {
	CREATE_LIST,
	UPDATE_LIST_NAME,
	ADD_CARD_TO_LIST,
	TOGGLE_LIST_ACTIVE,
	REMOVE_CARD_FROM_LIST,
	LIST_CLEANUP,
	DELETE_LIST,
} from '../actions/types';
import _ from 'lodash';

const INITIAL_STATE = {
};

//TODO: possibly map list.cards an object rather than an array

export default (state = INITIAL_STATE, action) => {
	switch(action.type) {
	case CREATE_LIST:
		return {
			...state,
			[action.payload.id]: {
				id: action.payload.id,
				name: action.payload.name,
				active: false,
				cards: [] // will contain card IDs only
			}
		};
	case UPDATE_LIST_NAME:
		return {
			...state,
			[action.payload.listID]: {
				...state[action.payload.listID],
				name: action.payload.name
			}
		};
	case ADD_CARD_TO_LIST:
		return {
			...state,
			[action.payload.listID]: {
				...state[action.payload.listID],
				cards: _.uniq([...state[action.payload.listID].cards, action.payload.cardID])
			}
		}
	case TOGGLE_LIST_ACTIVE:
		return {
			...state,
			[action.payload.listID]: {
				...state[action.payload.listID],
				active: !state[action.payload.listID].active
			}
		}
	case REMOVE_CARD_FROM_LIST:
		return {
			...state,
			[action.payload.listID]: {
				...state[action.payload.listID],
				cards: _.filter(state[action.payload.listID].cards,
					cardID => cardID !== action.payload.cardID)
			}
		};
	case LIST_CLEANUP:
		return {
			..._.mapValues(state, list => ({
				...list,
				cards: _.filter(list.cards, cardID => cardID !== action.payload.cardID)
			}))
		};
	case DELETE_LIST:
		return { ..._.omit(state, action.payload) };
	default:
		return state;
	}
}
