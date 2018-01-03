import { createSelector } from 'reselect';
import _ from 'lodash';

const cards = state => state.cards;
const lists = state => state.lists;
const allOrActiveOnly = state => state.useAllSwitch;

const studyCards = (cards, lists, useAll) => {
    if (!useAll) {
        const activeLists = _.filter(lists, list => list.active);
        const cardIDs = _.union(..._.map(activeLists, list => list.cards));

        return _.map(cardIDs, id => cards[id]);
    }
    return _.map(cards, card => card);
};

export const getStudyCards = createSelector(cards, lists, allOrActiveOnly, studyCards);
