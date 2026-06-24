import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { useNavigate } from 'react-router-dom';
import { useDuePayments, useCreatePayment } from '@/hooks/usePayments';
import { DataTable } from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/Modal';
import { PaymentForm } from '@/components/forms/PaymentForm';
import { AlertCircle, Wallet } from 'lucide-react';
import { formatDate } from '@/utils/dateHelpers';
import { Payment } from '@/interfaces/Payment';
import { PageHeaderSkeleton, TableSkeleton } from '@/components/ui/PageSkeleton';

const DuePayments = () => {
  const navigate = useNavigate();
  const { data: duePayments = [], isLoading } = useDuePayments();
  const createPayment = useCreatePayment();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<{ id: string; amount: number; subscriptionId: string } | null>(null);

  const handleMarkAsPaid = (memberId: string, amount: number, subscriptionId: string) => {
    setSelectedMember({ id: memberId, amount, subscriptionId });
    setIsPaymentModalOpen(true);
  };

  const handleCreatePayment = (data: Omit<Payment, 'id'>) => {
    createPayment.mutate(data, {
      onSuccess: () => {
        setIsPaymentModalOpen(false);
        setSelectedMember(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Seo title="Due Payments | Gym Manager Pro" description="Review outstanding member payments and mark dues as paid." path="/due-payments" />
        <PageHeaderSkeleton />
        <div className="p-3 sm:p-4 border-4 border-destructive bg-destructive/10">
          <div className="h-8 w-72 max-w-full animate-pulse rounded-md bg-muted" />
        </div>
        <TableSkeleton columns={6} />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <Seo title="Due Payments | Gym Manager Pro" description="Review outstanding member payments and mark dues as paid." path="/due-payments" />
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 flex items-center gap-2">
          <AlertCircle className="h-6 w-6 sm:h-8 sm:w-8 text-destructive flex-shrink-0" />
          <span>Due Payments</span>
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">Members with overdue subscriptions</p>
      </div>

      {duePayments.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-64 border-4 border-primary bg-card p-6">
          <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold mb-2">No Due Payments</h2>
          <p className="text-xs sm:text-sm text-muted-foreground text-center">All members are up to date with their payments!</p>
        </div>
      ) : (
        <>
          <div className="p-3 sm:p-4 border-4 border-destructive bg-destructive/10">
            <p className="font-medium text-base sm:text-lg">
              <span className="text-2xl sm:text-3xl font-bold text-destructive">{duePayments.length}</span>
              {' '} member(s) have overdue payments
            </p>
          </div>

          <DataTable
            data={duePayments}
            columns={[
              {
                key: 'member',
                label: 'Member Name',
                render: (item) => (
                  <div>
                    <p className="font-medium">{item.member_name}</p>
                    <p className="text-sm text-muted-foreground">{item.member_phone || 'N/A'}</p>
                  </div>
                ),
              },
              {
                key: 'membership',
                label: 'Plan',
                render: (item) => item.membership_name,
              },
              {
                key: 'end_date',
                label: 'Expired On',
                render: (item) => formatDate(item.end_date),
              },
              {
                key: 'daysOverdue',
                label: 'Days Overdue',
                render: (item) => (
                  <Badge variant="destructive" className="font-bold">
                    {item.days_overdue} days
                  </Badge>
                ),
              },
              {
                key: 'amount',
                label: 'Expected Amount',
                render: (item) => (
                  <span className="text-lg font-bold">
                    PKR {item.membership_price.toFixed(2)}
                  </span>
                ),
              },
              {
                key: 'actions',
                label: 'Actions',
                render: (item) => (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsPaid(item.member_id, item.membership_price, item.subscription_id);
                    }}
                    size="sm"
                    className="gap-2"
                  >
                    <Wallet className="h-4 w-4" />
                    Mark as Paid
                  </Button>
                ),
              },
            ]}
            onRowClick={(item) => navigate(`/members/${item.member_id}`)}
          />
        </>
      )}

      {selectedMember && (
        <Modal
          open={isPaymentModalOpen}
          onOpenChange={(open) => {
            setIsPaymentModalOpen(open);
            if (!open) setSelectedMember(null);
          }}
          title="Record Payment"
          description="Record payment for overdue subscription"
        >
          <PaymentForm
            memberId={selectedMember.id}
            subscriptionId={selectedMember.subscriptionId}
            defaultAmount={selectedMember.amount}
            onSubmit={handleCreatePayment}
            onCancel={() => {
              setIsPaymentModalOpen(false);
              setSelectedMember(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default DuePayments;
