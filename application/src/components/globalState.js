import {createGlobalState} from 'react-hooks-global-state';

// Global state for terms & conditions checkbox
const {setGlobalState, useGlobalState} = createGlobalState({
    termsChecked: 'false',
  });
  
export { setGlobalState, useGlobalState };