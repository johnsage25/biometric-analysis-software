import { CalculatedColumn } from "react-data-grid";

export interface StaffObjectInterface {
  scheduler?: any[];
  _id?: string;
  email?: string;
  gender?: string;
  right_fingerprint?: string;
  mobile?: string;
  fac_a_department?: string;
  nfc_card_code?: string;
  enrolled_date?: string;
  right_inpsize?: string;
  left_fingerprint?: string;
  birthdate?: string;
  status?: boolean;
  left_inpsize?: string;
  username?: string;
  unique_id_no?: string;
  work_position?: string;
  fullname?: string;
  password?: string;
  uuid?: string;
  staff_image?: string;
  by_staff?: [];
  staff_category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface EditorProps<TRow, TSummaryRow = unknown> {
  column: CalculatedColumn<TRow, TSummaryRow>;
  row: TRow;
  onRowChange: (row: TRow, commitChanges?: boolean) => void;
  onClose: (commitChanges?: boolean) => void;
}
