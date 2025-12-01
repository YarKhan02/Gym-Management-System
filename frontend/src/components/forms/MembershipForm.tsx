import { useState } from 'react';
import { Membership } from '@/interfaces/Membership';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MembershipFormProps {
  membership?: Membership;
  onSubmit: (data: Omit<Membership, 'id'>) => void;
  onCancel: () => void;
}

export const MembershipForm = ({ membership, onSubmit, onCancel }: MembershipFormProps) => {
  const [formData, setFormData] = useState({
    name: membership?.name || '',
    duration_days: membership?.duration_days || 30,
    price: membership?.price || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Plan Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="e.g., Monthly Premium"
          className="border-2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration_days">Duration (Days) *</Label>
        <Input
          id="duration_days"
          type="number"
          value={formData.duration_days}
          onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
          required
          min="1"
          className="border-2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (PKR) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          required
          min="0"
          className="border-2"
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-2">
          Cancel
        </Button>
        <Button type="submit">
          {membership ? 'Update' : 'Create'} Plan
        </Button>
      </div>
    </form>
  );
};
