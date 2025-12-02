from sqlalchemy.orm import Session
from datetime import date, timedelta

from app.repositories.member_repository import MemberRepository
from app.repositories.subscription_repository import MemberSubscriptionRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.membership_repository import MembershipRepository


class DashboardService:
    def __init__(self):
        self.member_repository = MemberRepository()
        self.subscription_repository = MemberSubscriptionRepository()
        self.payment_repository = PaymentRepository()
        self.membership_repository = MembershipRepository()

    def _count_active_members(self, all_subscriptions):
        active_member_ids = set()
        for sub in all_subscriptions:
            if sub.status == 'active':
                active_member_ids.add(sub.member_id)
        return len(active_member_ids)

    def _count_expired_members(self, all_subscriptions):
        expired_subscriptions = []
        for sub in all_subscriptions:
            if sub.status == 'expired':
                expired_subscriptions.append(sub)
        
        expired_member_ids = set()
        for sub in expired_subscriptions:
            has_active = False
            for s in all_subscriptions:
                if s.member_id == sub.member_id and s.status == 'active':
                    has_active = True
                    break
            if not has_active:
                expired_member_ids.add(sub.member_id)
        return len(expired_member_ids)

    def _calculate_month_revenue(self, all_payments):
        current_month_start = date.today().replace(day=1)
        month_revenue = 0
        for p in all_payments:
            if p.payment_date >= current_month_start:
                month_revenue += p.amount
        return month_revenue

    def _get_expiring_subscriptions(self, db: Session, all_subscriptions):
        today = date.today()
        seven_days_later = today + timedelta(days=7)
        expiring_subs = []
        
        for sub in all_subscriptions:
            if sub.status == 'active' and today <= sub.end_date <= seven_days_later:
                member = self.member_repository.get_by_id(db, sub.member_id)
                membership = self.membership_repository.get_by_id(db, sub.membership_id)
                
                if member and membership:
                    days_until_expiry = (sub.end_date - today).days
                    expiring_subs.append({
                        'subscription_id': str(sub.id),
                        'member_id': str(member.id),
                        'member_name': member.full_name,
                        'membership_id': str(membership.id),
                        'membership_name': membership.name,
                        'end_date': sub.end_date.isoformat(),
                        'days_until_expiry': days_until_expiry,
                    })
        
        expiring_subs.sort(key=lambda x: x['days_until_expiry'])
        return expiring_subs

    def _get_recent_payments(self, db: Session, all_payments):
        sorted_payments = sorted(all_payments, key=lambda p: p.payment_date, reverse=True)
        recent_payments = []
        
        for payment in sorted_payments[:5]:
            member = self.member_repository.get_by_id(db, payment.member_id)
            if member:
                recent_payments.append({
                    'payment_id': str(payment.id),
                    'member_id': str(member.id),
                    'member_name': member.full_name,
                    'amount': payment.amount,
                    'payment_date': payment.payment_date.isoformat(),
                    'method': payment.method,
                })
        return recent_payments

    def get_dashboard_data(self, db: Session):
        all_members = self.member_repository.get_all(db, skip=0, limit=10000)
        all_subscriptions = self.subscription_repository.get_all(db, skip=0, limit=10000)
        all_payments = self.payment_repository.get_all(db, skip=0, limit=10000)
        
        total_members = len(all_members)
        active_members = self._count_active_members(all_subscriptions)
        expired_members = self._count_expired_members(all_subscriptions)
        month_revenue = self._calculate_month_revenue(all_payments)
        expiring_subs = self._get_expiring_subscriptions(db, all_subscriptions)
        recent_payments = self._get_recent_payments(db, all_payments)
        
        return {
            'stats': {
                'total_members': total_members,
                'active_members': active_members,
                'expired_members': expired_members,
                'month_revenue': month_revenue,
            },
            'expiring_subscriptions': expiring_subs,
            'recent_payments': recent_payments,
        }
