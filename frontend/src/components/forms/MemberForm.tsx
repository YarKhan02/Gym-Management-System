import { useState } from 'react';
import { Member } from '@/interfaces/Member';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: Omit<Member, 'id'>) => void;
  onCancel: () => void;
}

export const MemberForm = ({ member, onSubmit, onCancel }: MemberFormProps) => {
  const [formData, setFormData] = useState({
    full_name: member?.full_name || '',
    phone: member?.phone || '',
    gender: member?.gender || '',
    address: member?.address || '',
    join_date: member?.join_date || new Date().toISOString().split('T')[0],
    is_active: member?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
            className="border-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="border-2"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
            <SelectTrigger className="border-2">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="join_date">Join Date *</Label>
          <Input
            id="join_date"
            type="date"
            value={formData.join_date}
            onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
            required
            className="border-2"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="border-2"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={formData.is_active}
          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          className="h-4 w-4"
        />
        <Label htmlFor="is_active">Active Member</Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-2">
          Cancel
        </Button>
        <Button type="submit">
          {member ? 'Update' : 'Create'} Member
        </Button>
      </div>
    </form>
  );
};
