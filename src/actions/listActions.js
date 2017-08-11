import {
    CREATE_LIST,
    UPDATE_LIST_NAME,
    ADD_CARD_TO_LIST,
    TOGGLE_LIST_ACTIVE,
    REMOVE_CARD_FROM_LIST,
    LIST_CLEANUP,
    SET_LIST_FILTER,
    DELETE_LIST
} from './types';

import uuid from './util';

export const createList = (name: string) => ({
    type: CREATE_LIST,
    payload: { name, id: uuid() }
});

export const updateListName = (listID: string, name: string) => ({
    type: UPDATE_LIST_NAME,
    payload: { listID, name }
});

export const addCardToList = (listID: number, cardID: number) => ({
    type: ADD_CARD_TO_LIST,
    payload: { listID, cardID }
});

export const toggleListActive = listID => ({
    type: TOGGLE_LIST_ACTIVE,
    payload: { listID }
});

export const setFilter = filter => ({
    type: SET_LIST_FILTER,
    payload: filter
});

export const removeCardFromList = (listID, cardID) => ({
    type: REMOVE_CARD_FROM_LIST,
    payload: { listID, cardID }
});

export const listCleanup = cardID => ({
    type: LIST_CLEANUP,
    payload: { cardID }
});

export const deleteList = (id: string) => ({
    type: DELETE_LIST,
    payload: id
});
