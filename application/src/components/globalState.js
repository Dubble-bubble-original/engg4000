import { createStore } from 'react-hooks-global-state';

const persistenceKey = 'notasocial';

const firstState = {
  termsChecked: false,
};

const initialStringFromStorage = localStorage.getItem(persistenceKey)
const initialState = initialStringFromStorage === null
	? firstState
	: JSON.parse(initialStringFromStorage)

const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'setChecked': return {
      ...state,
      termsChecked: true,
    };
    default: return state;
  }
};

const persistentReducer = (state, action) => {
	const mutated = myReducer(state, action)
	localStorage.setItem(persistenceKey, JSON.stringify(mutated))
	return mutated;
}

export const { GlobalStateProvider, dispatch, useGlobalState } = createStore(persistentReducer, initialState)
  