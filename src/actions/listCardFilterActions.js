import { UPDATE_LIST_CARD_FILTER } from './types';

export const updateFilter = index => ({
    type: UPDATE_LIST_CARD_FILTER,
    payload: index
});
