import { SetLineWeight } from "./actionTypes/imageProcessorActionType";

export const setLineWeight = (weight: number) => ({
    type: SetLineWeight,
    payload: weight
})