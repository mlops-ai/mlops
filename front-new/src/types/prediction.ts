import { Keyable } from "./types";

export interface Prediction {
    id: string;
    prediction_date: string;
    predicted_by: string;
    input_data: Keyable;
    prediction: number;
}