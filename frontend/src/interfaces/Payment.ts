export interface Payment {
  id: string;
  member_id: string;
  subscription_id?: string | null;
  amount: number;
  payment_date: string;
  method: string;
  notes: string | null;
}
