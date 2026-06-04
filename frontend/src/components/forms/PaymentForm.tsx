import { useEffect, useState } from 'react';
import { Payment } from '@/interfaces/Payment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentFormProps {
  memberId?: string;
  defaultAmount?: number;
  subscriptionId?: string | null;
  subscriptionOptions?: Array<{ id: string; label: string }>;
  onSubmit: (data: Omit<Payment, 'id'>) => void;
  onCancel: () => void;
}

export const PaymentForm = ({
  memberId,
  defaultAmount,
  subscriptionId,
  subscriptionOptions,
  onSubmit,
  onCancel,
}: PaymentFormProps) => {
  const [formData, setFormData] = useState({
    member_id: memberId || '',
    subscription_id: subscriptionId ?? subscriptionOptions?.[0]?.id ?? null,
    amount: defaultAmount || 0,
    payment_date: new Date().toISOString().split('T')[0],
    method: 'Cash',
    notes: '',
  });

  useEffect(() => {
    if (subscriptionId) {
      setFormData((prev) => ({ ...prev, subscription_id: subscriptionId }));
      return;
    }

    if (subscriptionOptions?.length) {
      setFormData((prev) => {
        if (prev.subscription_id) {
          return prev;
        }
        return { ...prev, subscription_id: subscriptionOptions[0].id };
      });
    }
  }, [subscriptionId, subscriptionOptions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subscriptionOptions && !formData.subscription_id) {
      return;
    }
    onSubmit({
      ...formData,
      notes: formData.notes || null,
    });
  };

  const showSubscriptionSelect = Boolean(subscriptionOptions);
  const hasSubscriptionOptions = (subscriptionOptions?.length ?? 0) > 0;
  const isSubmitDisabled = showSubscriptionSelect && !formData.subscription_id;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount (PKR) *</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: Number.parseFloat(e.target.value) })}
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

      {showSubscriptionSelect && (
        <div className="space-y-2">
          <Label htmlFor="subscription">Subscription *</Label>
          {hasSubscriptionOptions ? (
            <Select
              value={formData.subscription_id ?? ''}
              onValueChange={(value) => setFormData({ ...formData, subscription_id: value })}
            >
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Select subscription" />
              </SelectTrigger>
              <SelectContent>
                {subscriptionOptions?.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground">No unpaid subscriptions available.</p>
          )}
        </div>
      )}

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
        <Button type="submit" disabled={isSubmitDisabled}>
          Record Payment
        </Button>
      </div>
    </form>
  );
};
