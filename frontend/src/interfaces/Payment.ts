export interface Payment {
  id: string;
  member_id: string;
  amount: number;
  payment_date: string;
  method: string;
  notes: string | null;
}
