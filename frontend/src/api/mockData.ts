import { Member } from '@/interfaces/Member';
import { Membership } from '@/interfaces/Membership';
import { MemberSubscription } from '@/interfaces/MemberSubscription';
import { Payment } from '@/interfaces/Payment';
import { addDaysToDate } from '@/utils/dateHelpers';

const today = new Date().toISOString().split('T')[0];

export const mockMembers: Member[] = [
  {
    id: 'm1',
    full_name: 'John Smith',
    phone: '555-0101',
    email: 'john.smith@email.com',
    gender: 'Male',
    dob: '1990-05-15',
    address: '123 Main St, City',
    join_date: '2024-01-15',
    is_active: true,
  },
  {
    id: 'm2',
    full_name: 'Sarah Johnson',
    phone: '555-0102',
    email: 'sarah.j@email.com',
    gender: 'Female',
    dob: '1988-08-22',
    address: '456 Oak Ave, City',
    join_date: '2024-02-01',
    is_active: true,
  },
  {
    id: 'm3',
    full_name: 'Mike Davis',
    phone: '555-0103',
    email: 'mike.d@email.com',
    gender: 'Male',
    dob: '1995-03-10',
    address: '789 Pine Rd, City',
    join_date: '2024-03-12',
    is_active: true,
  },
  {
    id: 'm4',
    full_name: 'Emily Brown',
    phone: '555-0104',
    email: 'emily.brown@email.com',
    gender: 'Female',
    dob: '1992-11-30',
    address: '321 Elm St, City',
    join_date: '2024-01-20',
    is_active: true,
  },
  {
    id: 'm5',
    full_name: 'David Wilson',
    phone: '555-0105',
    email: null,
    gender: 'Male',
    dob: '1985-07-08',
    address: '654 Maple Dr, City',
    join_date: '2023-11-15',
    is_active: false,
  },
];

export const mockMemberships: Membership[] = [
  {
    id: 'p1',
    name: 'Monthly Basic',
    duration_days: 30,
    price: 49.99,
  },
  {
    id: 'p2',
    name: 'Quarterly Premium',
    duration_days: 90,
    price: 129.99,
  },
  {
    id: 'p3',
    name: 'Annual Elite',
    duration_days: 365,
    price: 499.99,
  },
  {
    id: 'p4',
    name: 'Weekly Trial',
    duration_days: 7,
    price: 19.99,
  },
];

export const mockSubscriptions: MemberSubscription[] = [
  {
    id: 's1',
    member_id: 'm1',
    membership_id: 'p2',
    start_date: '2024-11-01',
    end_date: addDaysToDate('2024-11-01', 90),
    status: 'active',
  },
  {
    id: 's2',
    member_id: 'm2',
    membership_id: 'p1',
    start_date: '2024-11-15',
    end_date: addDaysToDate('2024-11-15', 30),
    status: 'active',
  },
  {
    id: 's3',
    member_id: 'm3',
    membership_id: 'p3',
    start_date: '2024-03-12',
    end_date: addDaysToDate('2024-03-12', 365),
    status: 'active',
  },
  {
    id: 's4',
    member_id: 'm4',
    membership_id: 'p1',
    start_date: '2024-11-01',
    end_date: '2024-12-05',
    status: 'active',
  },
  {
    id: 's5',
    member_id: 'm5',
    membership_id: 'p2',
    start_date: '2023-11-15',
    end_date: '2024-02-15',
    status: 'expired',
  },
];

export const mockPayments: Payment[] = [
  {
    id: 'pay1',
    member_id: 'm1',
    amount: 129.99,
    payment_date: '2024-11-01',
    method: 'Credit Card',
    notes: 'Quarterly premium membership',
  },
  {
    id: 'pay2',
    member_id: 'm2',
    amount: 49.99,
    payment_date: '2024-11-15',
    method: 'Cash',
    notes: null,
  },
  {
    id: 'pay3',
    member_id: 'm3',
    amount: 499.99,
    payment_date: '2024-03-12',
    method: 'Bank Transfer',
    notes: 'Annual elite membership',
  },
  {
    id: 'pay4',
    member_id: 'm4',
    amount: 49.99,
    payment_date: '2024-11-01',
    method: 'Credit Card',
    notes: null,
  },
  {
    id: 'pay5',
    member_id: 'm1',
    amount: 49.99,
    payment_date: '2024-10-15',
    method: 'Cash',
    notes: 'Previous month payment',
  },
];
