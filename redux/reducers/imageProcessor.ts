import {
  imageProcessorState,
  PythonRuntimeState,
  StoreActions,
} from '~/models/redux/storeModel';
import { SetLineWeight } from '../actions/actionTypes/imageProcessorActionType';

const initialState = {
  lineWeight: 1,
};

const imageProcessorReducer = (
  state: imageProcessorState = initialState,
  action: StoreActions
): imageProcessorState => {
  switch (action.type) {
    case SetLineWeight:
      return { ...state, lineWeight: action.payload };
    default:
      return state;
  }
};

export default imageProcessorReducer;
