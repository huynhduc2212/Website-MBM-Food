export type TCreateRegisterParams = {
  id_user: string;
  id_table: string;
  start_time: string | Date;
  booking_date: string;
  status?: "Pending" | "Confirmed" | "Cancelled";
};
