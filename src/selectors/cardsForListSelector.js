import { createSelector } from 'reselect';
import _ from 'lodash';

const getCards = (state) => state.cards;
const getList = (state, props) => state.lists[props.navigation.state.params.id];


// const getCardsForList = (cards, list) => {
// 	const cardsInList = _.filter(cards, card => _.includes(list.cards, card.id));
// 	// use map for performance
// 	return {
// 		name: list.name,
// 		id: list.id,
// 		cards: cardsInList
// 	};
// };

const getCardsForList = (cards, list) => {
	const cardsInList = _.map(list.cards, listCardID => cards[listCardID]);

		return {
			name: list.name,
			id: list.id,
			cards: cardsInList
		};
}

export const cardsForListSelector = createSelector(
	getCards,
	getList,
	getCardsForList
);

export default cardsForListSelector;
