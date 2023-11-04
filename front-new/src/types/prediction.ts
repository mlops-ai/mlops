export interface Prediction {
    prediction_id: string;
    prediction_date: Date;
    predicted_by: string;
    prediction_status: string;
    predicted_value: number | string;
    [key: string]: any;
}