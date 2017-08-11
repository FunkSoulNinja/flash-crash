import { UPDATE_SEARCH_BAR } from './types';

export const updateSearchBar = input => ({
    type: UPDATE_SEARCH_BAR,
    payload: input.trim().toLowerCase()
});
