import { CREATE_CARD, DELETE_CARD, UPDATE_CARD } from './types';
import uuid from './util';

export const createCard = newCard => {
    return {
        type: CREATE_CARD,
        payload: { ...newCard, id: uuid() }
    };
};

export const deleteCard = cardID => {
    return {
        type: DELETE_CARD,
        payload: cardID
    };
};

export const updateCard = card => {
    return {
        type: UPDATE_CARD,
        payload: card
    };
};
