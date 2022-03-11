export type StoreState = {
  pythonRuntime: PythonRuntimeState;
  imageProcessor: imageProcessorState;
};

export type StoreActions = {
  type: string;
  payload: any;
};

export type PythonRuntimeState = {
  pythonRuntime: any;
};
export type pythonRuntimeActions = {
  setPythonRuntime: () => {
    type: string;
    payload: any;
  };
};

export type imageProcessorState = {
  lineWeight: number;
};
