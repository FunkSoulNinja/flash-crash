import { SET_CURRENT_CARD, SET_USE_ALL_SWITCH } from './types';

export const setCurrentCard = (id = null) => ({
    type: SET_CURRENT_CARD,
    payload: id
});

export const toggleUseAllSwitch = toggle => ({
    type: SET_USE_ALL_SWITCH,
    payload: toggle
});
