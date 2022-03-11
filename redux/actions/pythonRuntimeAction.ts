import { initialPythonRuntime } from './actionTypes/pythonRuntimeActionType';

export const setPythonRuntime = (runtime: any) => ({
  type: initialPythonRuntime,
  payload: runtime,
});
