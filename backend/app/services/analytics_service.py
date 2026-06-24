from datetime import date, datetime, timedelta
from collections import defaultdict
from typing import List

from app.repositories.member_repository import MemberRepository
from app.repositories.subscription_repository import MemberSubscriptionRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.membership_repository import MembershipRepository


class AnalyticsService:
    def __init__(self):
        self.member_repo = MemberRepository()
        self.sub_repo = MemberSubscriptionRepository()
        self.pay_repo = PaymentRepository()
        self.membership_repo = MembershipRepository()

    def overview(self, db, user_id: str):
        members = self.member_repo.get_all(db, user_id, skip=0, limit=10000)
        subs = self.sub_repo.get_all(db, user_id, skip=0, limit=10000)
        payments = self.pay_repo.get_all(db, user_id, skip=0, limit=10000)

        total_members = len(members)
        active_members = len({s.member_id for s in subs if s.status == 'active'})
        inactive_members = total_members - active_members
        active_subscriptions = len([s for s in subs if s.status == 'active'])

        today = date.today()
        in_week = today + timedelta(days=7)
        in_month = today + timedelta(days=30)
        expiring_this_week = len([s for s in subs if s.status == 'active' and today <= s.end_date <= in_week])
        expiring_this_month = len([s for s in subs if s.status == 'active' and today <= s.end_date <= in_month])

        total_revenue_all_time = sum((p.amount or 0) for p in payments)

        month_start = today.replace(day=1)
        revenue_this_month = sum(p.amount for p in payments if p.payment_date >= month_start)

        # previous month range
        first_of_this_month = month_start
        last_month_end = first_of_this_month - timedelta(days=1)
        last_month_start = last_month_end.replace(day=1)
        revenue_last_month = sum(p.amount for p in payments if last_month_start <= p.payment_date <= last_month_end)

        revenue_growth_percent = 0
        if revenue_last_month > 0:
            revenue_growth_percent = ((revenue_this_month - revenue_last_month) / revenue_last_month) * 100

        new_members_this_month = len([m for m in members if m.join_date >= month_start])
        new_members_last_month = len([m for m in members if last_month_start <= m.join_date <= last_month_end])

        return {
            'total_members': total_members,
            'active_members': active_members,
            'inactive_members': inactive_members,
            'active_subscriptions': active_subscriptions,
            'expiring_this_week': expiring_this_week,
            'expiring_this_month': expiring_this_month,
            'total_revenue_all_time': total_revenue_all_time,
            'revenue_this_month': revenue_this_month,
            'revenue_last_month': revenue_last_month,
            'revenue_growth_percent': revenue_growth_percent,
            'new_members_this_month': new_members_this_month,
            'new_members_last_month': new_members_last_month,
        }

    def member_growth(self, db, user_id: str, months: int = 12) -> List[dict]:
        members = self.member_repo.get_all(db, user_id, skip=0, limit=10000)
        today = date.today()
        points = []
        cumulative = 0
        # build map of year-month to count
        counts = defaultdict(int)
        for m in members:
            key = m.join_date.strftime('%Y-%m')
            counts[key] += 1

        for i in range(months - 1, -1, -1):
            dt = (today.replace(day=1) - timedelta(days=1)).replace(day=1) - timedelta(days=0)
            # compute month start by shifting months
            month_start = (today.replace(day=1) - timedelta(days=30 * i)).replace(day=1)
            label = month_start.strftime('%b %Y')
            key = month_start.strftime('%Y-%m')
            new_members = counts.get(key, 0)
            cumulative += new_members
            points.append({'month': key, 'label': label, 'new_members': new_members, 'cumulative': cumulative})

        return points

    def demographics(self, db, user_id: str):
        members = self.member_repo.get_all(db, user_id, skip=0, limit=10000)
        gender_counts = defaultdict(int)
        for m in members:
            gender = (m.gender or 'Unknown')
            gender_counts[gender] += 1

        subs = self.sub_repo.get_all(db, user_id, skip=0, limit=10000)
        status_counts = defaultdict(int)
        for s in subs:
            status_counts[s.status] += 1

        return {
            'gender': [{'label': k, 'count': v} for k, v in gender_counts.items()],
            'status': [{'label': k, 'count': v} for k, v in status_counts.items()],
        }

    def revenue_timeline(self, db, user_id: str, months: int = 12):
        payments = self.pay_repo.get_all(db, user_id, skip=0, limit=10000)
        today = date.today()
        totals = defaultdict(float)
        for p in payments:
            key = p.payment_date.strftime('%Y-%m')
            totals[key] += p.amount

        points = []
        cumulative = 0
        for i in range(months - 1, -1, -1):
            month = (today.replace(day=1) - timedelta(days=30 * i)).replace(day=1)
            key = month.strftime('%Y-%m')
            label = month.strftime('%b %Y')
            revenue = totals.get(key, 0)
            points.append({'month': key, 'label': label, 'revenue': revenue})

        return points

    def payment_methods(self, db, user_id: str):
        payments = self.pay_repo.get_all(db, user_id, skip=0, limit=10000)
        stats = defaultdict(lambda: {'count': 0, 'total': 0.0})
        for p in payments:
            stats[p.method]['count'] += 1
            stats[p.method]['total'] += p.amount

        return [{'method': k, 'count': v['count'], 'total': v['total']} for k, v in stats.items()]

    def subscription_status(self, db, user_id: str):
        subs = self.sub_repo.get_all(db, user_id, skip=0, limit=10000)
        stats = defaultdict(int)
        for s in subs:
            stats[s.status] += 1
        return [{'status': k, 'count': v} for k, v in stats.items()]

    def plans(self, db, user_id: str):
        memberships = self.membership_repo.get_all(db, user_id, skip=0, limit=10000)
        subs = self.sub_repo.get_all(db, user_id, skip=0, limit=10000)
        payments = self.pay_repo.get_all(db, user_id, skip=0, limit=10000)

        # map membership id to its subscriptions
        subs_by_membership = defaultdict(list)
        for s in subs:
            subs_by_membership[s.membership_id].append(s)

        payments_by_subscription = defaultdict(float)
        for p in payments:
            if p.subscription_id:
                payments_by_subscription[p.subscription_id] += p.amount

        result = []
        for m in memberships:
            membership_subs = subs_by_membership.get(m.id, [])
            subscriber_ids = set(s.member_id for s in membership_subs)
            total_revenue = sum(payments_by_subscription.get(s.id, 0) for s in membership_subs)
            avg_renewals = 0
            if subscriber_ids:
                avg_renewals = len(membership_subs) / len(subscriber_ids)

            result.append({
                'plan_id': str(m.id),
                'plan_name': m.name,
                'price': m.price,
                'duration_days': m.duration_days,
                'subscriber_count': len(subscriber_ids),
                'active_count': len([s for s in membership_subs if s.status == 'active']),
                'total_revenue': total_revenue,
                'avg_renewals': avg_renewals,
            })

        return result

    def expiring(self, db, user_id: str, days: int = 30):
        subs = self.sub_repo.get_all(db, user_id, skip=0, limit=10000)
        members = {m.id: m for m in self.member_repo.get_all(db, user_id, skip=0, limit=10000)}
        today = date.today()
        cutoff = today + timedelta(days=days)
        rows = []
        for s in subs:
            if s.status == 'active' and today <= s.end_date <= cutoff:
                member = members.get(s.member_id)
                rows.append({
                    'member_id': str(member.id) if member else None,
                    'member_name': member.full_name if member else None,
                    'phone_number': member.phone if member else None,
                    'plan_name': None,
                    'end_date': s.end_date.isoformat(),
                    'days_remaining': (s.end_date - today).days,
                })

        rows.sort(key=lambda r: r['days_remaining'])
        return rows

    def top_members(self, db, user_id: str, limit: int = 10):
        payments = self.pay_repo.get_all(db, user_id, skip=0, limit=10000)
        members = {m.id: m for m in self.member_repo.get_all(db, user_id, skip=0, limit=10000)}
        totals = defaultdict(float)
        counts = defaultdict(int)
        for p in payments:
            totals[p.member_id] += p.amount
            counts[p.member_id] += 1

        sorted_members = sorted(totals.items(), key=lambda x: x[1], reverse=True)[:limit]
        result = []
        for member_id, total in sorted_members:
            m = members.get(member_id)
            result.append({
                'member_id': str(member_id),
                'member_name': m.full_name if m else None,
                'subscription_count': counts.get(member_id, 0),
                'total_paid': total,
                'join_date': m.join_date.isoformat() if m else None,
                'is_active': m.is_active if m else False,
            })

        return result
