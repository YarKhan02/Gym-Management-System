export interface Member {
  id: string;
  full_name: string;
  phone: string | null;
  gender: string | null;
  address: string | null;
  join_date: string;
  is_active: boolean;
}
