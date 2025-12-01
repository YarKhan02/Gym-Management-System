# Gym Management System - Backend

A clean and minimal Flask-based gym management system backend with PostgreSQL database.

## Features

- Member registration and management
- Membership plans (tiers with duration and pricing)
- Member subscriptions tracking
- Payment processing and history
- RESTful API design
- Clean layered architecture (Router → Service → Repository → Model)

## Tech Stack

- **Framework**: Flask 3.0
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0
- **Validation**: Pydantic
- **Python**: 3.8+

## Project Structure

```
backend/
├── app/
│   ├── routers/          # API endpoints (Flask Blueprints)
│   ├── services/         # Business logic
│   ├── repositories/     # Database CRUD operations
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas for validation
│   ├── database/         # Database connection setup
│   ├── core/             # Configuration
│   └── utils/            # Utility functions
├── main.py               # Application entry point
├── requirements.txt      # Python dependencies
└── .env.example          # Environment variables template
```

## Setup Instructions

### 1. Prerequisites

- Python 3.8 or higher
- PostgreSQL 12 or higher
- pip (Python package manager)

### 2. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Database

1. Create a PostgreSQL database:
```sql
CREATE DATABASE gym_db;
```

2. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```
DATABASE_URL=postgresql://username:password@localhost:5432/gym_db
```

### 5. Run the Application

```bash
python main.py
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Members
- `POST /api/members` - Create a new member
- `GET /api/members` - Get all members
- `GET /api/members/<id>` - Get member by ID
- `PUT /api/members/<id>` - Update member
- `DELETE /api/members/<id>` - Delete member

### Memberships
- `POST /api/memberships` - Create membership plan
- `GET /api/memberships` - Get all membership plans
- `GET /api/memberships/<id>` - Get membership by ID
- `PUT /api/memberships/<id>` - Update membership
- `DELETE /api/memberships/<id>` - Delete membership

### Subscriptions
- `POST /api/subscriptions` - Create member subscription
- `GET /api/subscriptions` - Get all subscriptions
- `GET /api/subscriptions/<id>` - Get subscription by ID
- `GET /api/subscriptions/member/<member_id>` - Get member's subscriptions

### Payments
- `POST /api/payments` - Record a payment
- `GET /api/payments` - Get all payments
- `GET /api/payments/<id>` - Get payment by ID
- `GET /api/payments/member/<member_id>` - Get member's payment history

## Example API Usage

### Create a Member
```bash
curl -X POST http://localhost:5000/api/members \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "gender": "male",
    "address": "123 Main St",
    "join_date": "2024-01-01"
  }'
```

### Create a Membership Plan
```bash
curl -X POST http://localhost:5000/api/memberships \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monthly Premium",
    "duration_days": 30,
    "price": 50.00
  }'
```

## Database Schema

### Members
- `id` (UUID)
- `full_name` (String)
- `phone` (String, nullable)
- `email` (String, nullable)
- `gender` (String, nullable)
- `address` (String, nullable)
- `join_date` (Date)
- `is_active` (Boolean)

### Memberships
- `id` (UUID)
- `name` (String)
- `duration_days` (Integer)
- `price` (Float)

### Member Subscriptions
- `id` (UUID)
- `member_id` (UUID, FK)
- `membership_id` (UUID, FK)
- `start_date` (Date)
- `end_date` (Date)
- `status` (String: active/expired/cancelled)

### Payments
- `id` (UUID)
- `member_id` (UUID, FK)
- `amount` (Float)
- `payment_date` (Date)
- `method` (String: cash/card/online)

## Architecture

The application follows a clean layered architecture:

1. **Router Layer**: Handles HTTP requests/responses, validates input using Pydantic schemas
2. **Service Layer**: Contains business logic, coordinates between routers and repositories
3. **Repository Layer**: Handles all database operations using SQLAlchemy
4. **Model Layer**: SQLAlchemy ORM models that map to database tables
5. **Schema Layer**: Pydantic models for request/response validation

## Development Notes

- Database tables are automatically created on application startup
- All IDs use UUID for better security and scalability
- Proper error handling with meaningful error messages
- Database session management handled via dependency injection
