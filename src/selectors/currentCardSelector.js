import { createSelector } from 'reselect';

const cardsSelector = state => state.cards;
const currentCardIDSelector = state => state.currentCardID;

const getCurrentCard = (cards, currentCardID) => cards[currentCardID];

export default createSelector(
	cardsSelector,
	currentCardIDSelector,
	getCurrentCard
);
