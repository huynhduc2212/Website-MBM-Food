export type TCreateRegisterParams = {
  id_user: string;
  id_table: string;
  start_time: string | Date;
  create_at: string | Date;
  status?: "Pending" | "Confirmed" | "Cancelled";
};
