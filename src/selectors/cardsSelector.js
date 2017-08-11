import { createSelector } from 'reselect';
import _ from 'lodash';

const cards = state => state.cards;
const searchSelector = state => state.searchBar;

const createCardList = (cards, input) => {
	return !input
		? _.map(cards, (card) => card)
		: _.filter(cards, (card) => {
			return card.question.toLowerCase().includes(input)
				|| card.answer.toLowerCase().includes(input);
		});
}

export const cardsSelector =  createSelector(
	cards,
	searchSelector,
	createCardList
);

export default cardsSelector;
