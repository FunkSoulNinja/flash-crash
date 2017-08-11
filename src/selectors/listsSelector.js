import { createSelector } from 'reselect';
import _ from 'lodash';

const getLists = state => state.lists;
const activeListFilter = state => state.activeListFilter;
const listSearchInput = state => state.listSearchInput;

// const lists = (lists, input) => {
// 	return !input
// 		? _.map(lists, list => list)
// 		: _.filter(lists, list => list.name.includes(input))
// }

const lists = (lists, filter, searchInput) => {
	if(filter === "active") {
		return !searchInput
			? _.filter(lists, list => list.active)
			: _.filter(lists, list => list.active && list.name.includes(searchInput));
	}
	else if(filter === "inactive") {
		return !searchInput
			? _.filter(lists, list => !list.active)
			: _.filter(lists, list => !list.active && list.name.includes(searchInput));
	}
	return _.map(lists, list => list);
}

export default createSelector(
	getLists,
	activeListFilter,
	listSearchInput,
	lists
);
