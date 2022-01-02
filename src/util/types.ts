export type Nullable<T> = T | null | undefined;

export type QueryParams = (number | string)[];

export interface HttpResponse {
    errors: string[]
}