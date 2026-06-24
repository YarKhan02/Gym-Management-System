import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { usePayments, useCreatePayment } from '@/hooks/usePayments';
import { useMembers } from '@/hooks/useMembers';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Download } from 'lucide-react';
import { formatDate } from '@/utils/dateHelpers';
import { Payment } from '@/interfaces/Payment';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Payments = () => {
  const { data: payments = [], isLoading } = usePayments();
  const { data: members = [] } = useMembers();
  const createPayment = useCreatePayment();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const enrichedPayments = payments.map(payment => ({
    ...payment,
    member: members.find(m => m.id === payment.member_id),
  }));

  const filteredPayments = enrichedPayments.filter(payment => {
    if (!startDate && !endDate) return true;
    if (startDate && payment.payment_date < startDate) return false;
    if (endDate && payment.payment_date > endDate) return false;
    return true;
  });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);

  const handleCreatePayment = (data: Omit<Payment, 'id'>) => {
    createPayment.mutate(data, {
      onSuccess: () => setIsModalOpen(false),
    });
  };

  const handleExportCSV = () => {
    const headers = ['Member', 'Amount', 'Date', 'Method'];
    const rows = filteredPayments.map(p => [
      p.member?.full_name || 'N/A',
      `PKR ${p.amount.toFixed(2)}`,
      p.payment_date,
      p.method,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Seo title="Payments | Gym Manager Pro" description="Record and review gym member payments and transaction history." path="/payments" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Payments</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Record and manage all payments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportCSV} className="gap-2 border-2 w-full sm:w-auto text-sm">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 border-4 border-primary bg-card">
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border-2"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border-2"
            />
          </div>
        </div>
        <div className="border-l-4 border-primary pl-4">
          <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
          <p className="text-3xl font-bold">PKR {totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <DataTable
        data={filteredPayments}
        columns={[
          {
            key: 'member',
            label: 'Member',
            render: (payment) => payment.member?.full_name || 'N/A',
          },
          {
            key: 'amount',
            label: 'Amount',
            render: (payment) => `PKR ${payment.amount.toFixed(2)}`,
          },
          {
            key: 'payment_date',
            label: 'Date',
            render: (payment) => formatDate(payment.payment_date),
          },
          {
            key: 'method',
            label: 'Method',
          },
        ]}
      />
    </div>
  );
};

export default Payments;
