import { useState } from 'react';
import { Payment } from '@/interfaces/Payment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentFormProps {
  memberId?: string;
  defaultAmount?: number;
  subscriptionId?: string | null;
  onSubmit: (data: Omit<Payment, 'id'>) => void;
  onCancel: () => void;
}

export const PaymentForm = ({ memberId, defaultAmount, subscriptionId, onSubmit, onCancel }: PaymentFormProps) => {
  const [formData, setFormData] = useState({
    member_id: memberId || '',
    subscription_id: subscriptionId || null,
    amount: defaultAmount || 0,
    payment_date: new Date().toISOString().split('T')[0],
    method: 'Cash',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      notes: formData.notes || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (PKR) *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          required
          min="0"
          className="border-2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="payment_date">Payment Date *</Label>
        <Input
          id="payment_date"
          type="date"
          value={formData.payment_date}
          onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
          required
          className="border-2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="method">Payment Method *</Label>
        <Select value={formData.method} onValueChange={(value) => setFormData({ ...formData, method: value })}>
          <SelectTrigger className="border-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cash">Cash</SelectItem>
            <SelectItem value="Credit Card">Credit Card</SelectItem>
            <SelectItem value="Debit Card">Debit Card</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-2">
          Cancel
        </Button>
        <Button type="submit">
          Record Payment
        </Button>
      </div>
    </form>
  );
};
