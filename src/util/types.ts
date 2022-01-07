export type Nullable<T> = T | null | undefined;

export type QueryParams = (number | string)[];

export interface HttpResponse {
    errors: string[],
    results?: any
}

export interface TimeReport {
    breakInMinutes: string,
    workInMinutes: string,
    breakInHours: string,
    workInHours: string,
    firstLogTimeStamp: string,
    lastLogTimeStamp: string,
    totalTimeTrackedHours: number
}