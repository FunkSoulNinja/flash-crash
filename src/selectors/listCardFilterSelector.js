import { createSelector } from 'reselect';
import _ from 'lodash';

const getCards = (state, props, cards) => cards;
const getList = (state, props, cards, list) => list;
const getFilterIndex = state => state.listCardFilter;


const filterCards = (cards, list, filter) => {
	if(filter === 0) {
		// render cards if inside of list
		let filtered = _.map(list.cards, cardID => cards.find(card => card.id === cardID))
		return _.filter(filtered, item => item)
	}
	else if(filter === 2) {
		// render cards if not in list

		return _.filter(cards,
			card => !list.cards.includes(card.id))
	}
	else {
		// render all cards (index 1)

		return cards;
	}
}

export const listCardFilterSelector = createSelector(
	getCards,
	getList,
	getFilterIndex,
	filterCards
)
