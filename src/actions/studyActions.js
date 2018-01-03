import { SET_CURRENT_CARD, SET_USE_ALL_SWITCH, SET_DECK_TYPE } from './types';

export const setCurrentCard = (id = null) => ({
    type: SET_CURRENT_CARD,
    payload: id
});

export const toggleUseAllSwitch = toggle => ({
    type: SET_USE_ALL_SWITCH,
    payload: toggle
});

export const setDeckType = toggle => ({
    type: SET_DECK_TYPE,
    payload: toggle
});

