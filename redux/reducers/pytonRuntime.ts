import { PythonRuntimeState, StoreActions } from '~/models/redux/storeModel';

const initialState = {
  pythonRuntime: null,
};

const pythonRuntimeReducer = (
  state: PythonRuntimeState = initialState,
  action: StoreActions
): PythonRuntimeState => {
  switch (action.type) {
    case 'InitialPythonRuntime':
      return { ...state, pythonRuntime: action.payload };
    default:
      return state;
  }
};

export default pythonRuntimeReducer;
