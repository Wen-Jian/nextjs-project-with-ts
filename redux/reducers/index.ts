import { combineReducers } from 'redux';
import pytonRuntimeReducer from '~/redux/reducers/pytonRuntime';
import imageProcessorReducer from '~/redux/reducers/imageProcessor';

export default combineReducers({
  pythonRuntime: pytonRuntimeReducer,
  imageProcessor: imageProcessorReducer,
});
