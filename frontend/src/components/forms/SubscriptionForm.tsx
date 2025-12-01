import { useState } from 'react';
import { MemberSubscription } from '@/interfaces/MemberSubscription';
import { Membership } from '@/interfaces/Membership';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDaysToDate } from '@/utils/dateHelpers';

interface SubscriptionFormProps {
  memberId: string;
  memberships: Membership[];
  subscription?: MemberSubscription;
  onSubmit: (data: Omit<MemberSubscription, 'id'>) => void;
  onCancel: () => void;
}

export const SubscriptionForm = ({ memberId, memberships, subscription, onSubmit, onCancel }: SubscriptionFormProps) => {
  const [selectedMembershipId, setSelectedMembershipId] = useState(subscription?.membership_id || '');
  const [startDate, setStartDate] = useState(
    subscription?.start_date || new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<string>(subscription?.status || 'active');

  const selectedMembership = memberships.find(m => m.id === selectedMembershipId);
  const endDate = selectedMembership 
    ? addDaysToDate(startDate, selectedMembership.duration_days)
    : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMembershipId) return;

    onSubmit({
      member_id: memberId,
      membership_id: selectedMembershipId,
      start_date: startDate,
      end_date: endDate,
      status: status as 'active' | 'expired' | 'cancelled',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="membership">Select Membership Plan *</Label>
        <Select value={selectedMembershipId} onValueChange={setSelectedMembershipId}>
          <SelectTrigger className="border-2">
            <SelectValue placeholder="Choose a plan" />
          </SelectTrigger>
          <SelectContent>
            {memberships.map(membership => (
              <SelectItem key={membership.id} value={membership.id}>
                {membership.name} - PKR {membership.price} ({membership.duration_days} days)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="start_date">Start Date *</Label>
        <Input
          id="start_date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
          className="border-2"
        />
      </div>

      {subscription && (
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedMembership && (
        <div className="p-4 bg-accent border-2 border-primary">
          <p className="font-medium">Subscription Details:</p>
          <p className="text-sm">Plan: {selectedMembership.name}</p>
          <p className="text-sm">Duration: {selectedMembership.duration_days} days</p>
          <p className="text-sm">Price: PKR {selectedMembership.price}</p>
          <p className="text-sm font-medium mt-2">End Date: {endDate}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-2">
          Cancel
        </Button>
        <Button type="submit" disabled={!selectedMembershipId}>
          {subscription ? 'Update Subscription' : 'Create Subscription'}
        </Button>
      </div>
    </form>
  );
};
