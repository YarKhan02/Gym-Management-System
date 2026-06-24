import { useState } from 'react';
import { Seo } from '@/components/Seo';
import { useParams, useNavigate } from 'react-router-dom';
import { useMember, useUpdateMember } from '@/hooks/useMembers';
import {
  useMemberSubscriptions,
  useActiveMemberSubscription,
  useUnpaidMemberSubscriptions,
  useCreateSubscription,
  useUpdateSubscription,
  useDeleteSubscription,
} from '@/hooks/useSubscriptions';
import { useMemberPayments, useCreatePayment } from '@/hooks/usePayments';
import { useMemberships } from '@/hooks/useMemberships';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/DataTable';
import { Modal } from '@/components/ui/Modal';
import { MemberForm } from '@/components/forms/MemberForm';
import { PaymentForm } from '@/components/forms/PaymentForm';
import { SubscriptionForm } from '@/components/forms/SubscriptionForm';
import { ArrowLeft, Edit, CreditCard, Calendar, AlertCircle, Trash2 } from 'lucide-react';
import { formatDate, getDaysUntilExpiry } from '@/utils/dateHelpers';
import { Member } from '@/interfaces/Member';
import { Payment } from '@/interfaces/Payment';
import { MemberSubscription } from '@/interfaces/MemberSubscription';

const MemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: member, isLoading } = useMember(id!);
  const { data: subscriptions = [] } = useMemberSubscriptions(id!);
  const { data: activeSubscription } = useActiveMemberSubscription(id!);
  const { data: unpaidSubscriptions = [] } = useUnpaidMemberSubscriptions(id!);
  const { data: payments = [] } = useMemberPayments(id!);
  const { data: memberships = [] } = useMemberships();
  
  const updateMember = useUpdateMember();
  const createSubscription = useCreateSubscription();
  const updateSubscription = useUpdateSubscription();
  const deleteSubscription = useDeleteSubscription();
  const createPayment = useCreatePayment();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const [isEditSubscriptionModalOpen, setIsEditSubscriptionModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<MemberSubscription | null>(null);

  const handleUpdateMember = (data: Omit<Member, 'id'>) => {
    updateMember.mutate({ id: id!, data }, {
      onSuccess: () => setIsEditModalOpen(false),
    });
  };

  const handleCreatePayment = (data: Omit<Payment, 'id'>) => {
    createPayment.mutate(data, {
      onSuccess: () => setIsPaymentModalOpen(false),
    });
  };

  const handleCreateSubscription = (data: Omit<MemberSubscription, 'id'>) => {
    createSubscription.mutate(data, {
      onSuccess: () => setIsSubscriptionModalOpen(false),
    });
  };

  const handleEditSubscription = () => {
    if (activeSubscription) {
      setEditingSubscription(activeSubscription);
      setIsEditSubscriptionModalOpen(true);
    }
  };

  const handleUpdateSubscription = (data: Omit<MemberSubscription, 'id'>) => {
    if (editingSubscription) {
      updateSubscription.mutate(
        { id: editingSubscription.id, data },
        {
          onSuccess: () => {
            setIsEditSubscriptionModalOpen(false);
            setEditingSubscription(null);
          },
        }
      );
    }
  };

  const handleDeleteSubscription = () => {
    if (activeSubscription && window.confirm('Are you sure you want to delete this subscription?')) {
      deleteSubscription.mutate(activeSubscription.id);
    }
  };

  if (isLoading || !member) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  const isSubExpired = activeSubscription?.status === 'expired';
  const daysLeft = activeSubscription && activeSubscription.status === 'active' 
    ? getDaysUntilExpiry(activeSubscription.end_date) 
    : 0;
  const unpaidSubscriptionOptions = unpaidSubscriptions.map((subscription) => {
    const membershipName = subscription.membership_name || 'N/A';
    return {
      id: subscription.id,
      label: `${membershipName} (${formatDate(subscription.start_date)} - ${formatDate(subscription.end_date)})`,
    };
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      <Seo title="Member Profile | Gym Manager Pro" description="View and edit a gym member's profile, subscriptions, and payment history." path="/members" />
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/members')} className="border-2 w-full sm:w-auto">
          <ArrowLeft className="h-4 w-4" />
          <span className="ml-2 sm:ml-0">Back</span>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">{member.full_name}</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Member Profile</p>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)} className="gap-2 w-full sm:w-auto text-sm sm:text-base">
          <Edit className="h-4 w-4" />
          <span className="hidden sm:inline">Edit Profile</span>
          <span className="sm:hidden">Edit</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="border-4 border-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Member Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Phone</p>
              <p className="font-medium text-sm sm:text-base truncate">{member.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Gender</p>
              <p className="font-medium text-sm sm:text-base">{member.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Address</p>
              <p className="font-medium text-sm sm:text-base line-clamp-2">{member.address || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground">Join Date</p>
              <p className="font-medium text-sm sm:text-base">{formatDate(member.join_date)}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground\">Status</p>
              <Badge variant={member.is_active ? 'default' : 'secondary'} className="text-xs">
                {member.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 border-primary lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Current Subscription
            </CardTitle>
            <Button onClick={() => setIsSubscriptionModalOpen(true)} size="sm" className="gap-2">
              <CreditCard className="h-4 w-4" />
              New Subscription
            </Button>
          </CardHeader>
          <CardContent>
            {activeSubscription ? (
              <div className="space-y-4">
                {isSubExpired && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 border-2 border-destructive">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <p className="text-sm font-medium text-destructive">
                      Subscription expired! Please renew.
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Plan</p>
                    <p className="font-medium">
                      {memberships.find(m => m.id === activeSubscription.membership_id)?.name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    <Badge variant={activeSubscription.status === 'expired' ? 'destructive' : 'default'}>
                      {activeSubscription.status.charAt(0).toUpperCase() + activeSubscription.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p className="font-medium">{formatDate(activeSubscription.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">End Date</p>
                    <p className="font-medium">{formatDate(activeSubscription.end_date)}</p>
                  </div>
                  {!isSubExpired && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Days Remaining</p>
                      <p className="text-2xl font-bold">{daysLeft} days</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleEditSubscription} variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button onClick={handleDeleteSubscription} variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active subscription</p>
                <Button onClick={() => setIsSubscriptionModalOpen(true)} className="mt-4">
                  Create Subscription
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-4 border-primary">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subscription History</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={subscriptions}
            columns={[
              {
                key: 'membership_id',
                label: 'Plan',
                render: (sub) => memberships.find(m => m.id === sub.membership_id)?.name || 'N/A',
              },
              {
                key: 'start_date',
                label: 'Start Date',
                render: (sub) => formatDate(sub.start_date),
              },
              {
                key: 'end_date',
                label: 'End Date',
                render: (sub) => formatDate(sub.end_date),
              },
              {
                key: 'status',
                label: 'Status',
                render: (sub) => (
                  <Badge variant={sub.status === 'active' ? 'default' : 'secondary'}>
                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                  </Badge>
                ),
              },
            ]}
            itemsPerPage={5}
          />
        </CardContent>
      </Card>

      <Card className="border-4 border-primary">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment History</CardTitle>
          <Button onClick={() => setIsPaymentModalOpen(true)} size="sm" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Add Payment
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={payments}
            columns={[
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
            itemsPerPage={5}
          />
        </CardContent>
      </Card>

      <Modal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Edit Member"
        description="Update member information"
      >
        <MemberForm
          member={member}
          onSubmit={handleUpdateMember}
          onCancel={() => setIsEditModalOpen(false)}
        />
      </Modal>

      <Modal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        title="Record Payment"
        description="Add a new payment for this member"
      >
        <PaymentForm
          memberId={id}
          subscriptionOptions={unpaidSubscriptionOptions}
          onSubmit={handleCreatePayment}
          onCancel={() => setIsPaymentModalOpen(false)}
        />
      </Modal>

      <Modal
        open={isSubscriptionModalOpen}
        onOpenChange={setIsSubscriptionModalOpen}
        title="New Subscription"
        description="Create a new subscription for this member"
      >
        <SubscriptionForm
          memberId={id!}
          memberships={memberships}
          onSubmit={handleCreateSubscription}
          onCancel={() => setIsSubscriptionModalOpen(false)}
        />
      </Modal>

      <Modal
        open={isEditSubscriptionModalOpen}
        onOpenChange={setIsEditSubscriptionModalOpen}
        title="Edit Subscription"
        description="Update subscription details"
      >
        {editingSubscription && (
          <SubscriptionForm
            memberId={id!}
            memberships={memberships}
            subscription={editingSubscription}
            onSubmit={handleUpdateSubscription}
            onCancel={() => {
              setIsEditSubscriptionModalOpen(false);
              setEditingSubscription(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default MemberProfile;
