export interface PaginationInterface {
    page?: number | any,
    searchString?: object,
    limit?: number,
    sort?:object,
    populate?:[]|any
}