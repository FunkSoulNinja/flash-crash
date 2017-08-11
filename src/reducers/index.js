import { combineReducers } from 'redux';

import cards from './cardsReducer';
import lists from './listsReducer';
import currentCardID from './currentCardReducer';
import searchBar from './SearchBarReducer';
import activeListFilter from './listFilterReducer'
import useAllSwitch from './useAllSwitchReducer';
import listCardFilter from './listCardFilterReducer';

export default combineReducers({
	cards,
	lists,
	currentCardID,
	searchBar,
	activeListFilter,
	useAllSwitch,
	listCardFilter
});
