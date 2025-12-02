import random
import uuid
from datetime import datetime, timedelta

from app.models.member import Member
from app.models.membership import Membership
from app.models.member_subscription import MemberSubscription
from app.models.payment import Payment
from app.database.database import SessionLocal

from faker import Faker

fake = Faker()

def seed():
    session = SessionLocal()

    # Seed Members
    members = []
    for _ in range(25):
        member = Member(
            id=str(uuid.uuid4()),
            full_name=fake.name(),
            phone=fake.phone_number(),
            gender=fake.random_element(elements=('Male', 'Female')),
            address=fake.address(),
            join_date=fake.date_between(start_date='-2y', end_date='today'),
            is_active=fake.boolean(chance_of_getting_true=80)
        )
        session.add(member)
        members.append(member)

    # Seed Memberships
    memberships = []
    for i in range(25):
        membership = Membership(
            id=str(uuid.uuid4()),
            name=f"{random.choice(['Gold', 'Silver', 'Bronze', 'Platinum'])} {random.choice(['Monthly', 'Quarterly', 'Yearly'])}",
            price=random.randint(1000, 10000),
            duration_days=random.choice([30, 90, 180, 365]),
        )
        session.add(membership)
        memberships.append(membership)

    session.commit()

    # Seed MemberSubscriptions
    subscriptions = []
    for i in range(25):
        member = random.choice(members)
        membership = random.choice(memberships)
        start_date = fake.date_between(start_date='-1y', end_date='today')
        duration = membership.duration_days
        end_date = start_date + timedelta(days=duration)
        status = random.choice(['active', 'expired', 'cancelled'])
        subscription = MemberSubscription(
            id=str(uuid.uuid4()),
            member_id=member.id,
            membership_id=membership.id,
            start_date=start_date,
            end_date=end_date,
            status=status
        )
        session.add(subscription)
        subscriptions.append(subscription)

    session.commit()

    # Seed Payments
    for i in range(25):
        subscription = random.choice(subscriptions)
        payment_date = subscription.start_date + timedelta(days=random.randint(0, 10))
        amount = random.randint(500, 10000)
        method = random.choice(['credit_card', 'cash', 'bank_transfer'])
        payment = Payment(
            id=str(uuid.uuid4()),
            member_id=subscription.member_id,
            subscription_id=subscription.id,
            amount=amount,
            payment_date=payment_date,
            method=method
        )
        session.add(payment)

    session.commit()
    print("Seeded 25 entries for each table.")

if __name__ == "__main__":
    seed()