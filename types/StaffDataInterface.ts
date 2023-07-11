export interface StaffDataInterface {
  _id?:string,
  birthdate?: Date;
  fac_a_department?: string;
  fullname?:string;
  gender?:string;
  phone?:string;
  password?:string,
  scheduler?:string;
  unique_id_no?:string;
  work_position?:string;
}


export interface StaffRosterUpdateInterface {
    _id?:string| unknown,
    row?: number| unknown;
    value?:string | unknown
  }
