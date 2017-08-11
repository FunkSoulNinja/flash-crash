import { createSelector } from 'reselect';

const lists = state => state.lists;
const listCount = (lists) => Object.keys(lists).length;


export const cardListCountSelector =  createSelector(
	lists,
	listCount
);

export default cardListCountSelector;
