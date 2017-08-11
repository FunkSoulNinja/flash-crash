import { createSelector } from 'reselect';

const cards = state => state.cards;
const getCardCount = cards => Object.keys(cards).length;

export default createSelector(
	cards,
	getCardCount
);
