export interface StaffAttendancePagingInterface {
    _id: string,
    selectedDate?:string | undefined,
    page?: number | any,
    searchString?: object,
    limit?: number,
    sort?:object,
    populate?:[]|any
}