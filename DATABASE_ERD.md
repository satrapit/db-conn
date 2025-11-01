# Database Entity Relationship Diagram (ERD)

## Database: `portal`

### Overview

This database manages user authentication and verification through OTP (One-Time Password) system with token-based session management.

---

## Tables

### 1. **users**

Main user information table.

| Column       | Type            | Constraints                         | Description                             |
| ------------ | --------------- | ----------------------------------- | --------------------------------------- |
| `id`         | bigint UNSIGNED | PRIMARY KEY, AUTO_INCREMENT         | Unique user identifier                  |
| `first_name` | varchar(255)    | NOT NULL                            | User's first name                       |
| `last_name`  | varchar(255)    | NOT NULL                            | User's last name                        |
| `birth_date` | char(10)        | NOT NULL                            | User's birth date                       |
| `phone`      | char(11)        | NOT NULL, UNIQUE                    | User's phone number (unique identifier) |
| `email`      | varchar(255)    | NULL                                | User's email address (optional)         |
| `created_at` | timestamp       | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp               |
| `updated_at` | timestamp       | NULL, ON UPDATE CURRENT_TIMESTAMP   | Record last update timestamp            |

**Indexes:**

- PRIMARY KEY: `id`
- UNIQUE KEY: `phone`

**Character Set:** utf8mb3 (utf8mb3_persian_ci)

---

### 2. **otps**

OTP verification codes table for phone number authentication.

| Column       | Type            | Constraints                         | Description                          |
| ------------ | --------------- | ----------------------------------- | ------------------------------------ |
| `id`         | bigint UNSIGNED | PRIMARY KEY, AUTO_INCREMENT         | Unique OTP record identifier         |
| `phone`      | char(11)        | NOT NULL                            | Phone number receiving the OTP       |
| `otp_code`   | varchar(255)    | NOT NULL                            | One-time password code               |
| `created_at` | timestamp       | NOT NULL, DEFAULT CURRENT_TIMESTAMP | OTP generation timestamp             |
| `used_at`    | timestamp       | NULL                                | Timestamp when OTP was used/verified |

**Indexes:**

- PRIMARY KEY: `id`
- INDEX: `idx_phone` on `phone`

**Character Set:** utf8mb3 (utf8mb3_persian_ci)

---

### 3. **tokens**

Authentication tokens for session management.

| Column       | Type            | Constraints                         | Description                 |
| ------------ | --------------- | ----------------------------------- | --------------------------- |
| `id`         | bigint UNSIGNED | PRIMARY KEY, AUTO_INCREMENT         | Unique token identifier     |
| `user_id`    | bigint UNSIGNED | NOT NULL, FOREIGN KEY               | References `users.id`       |
| `token`      | varchar(512)    | NOT NULL                            | Authentication token string |
| `ip_address` | varchar(45)     | NULL                                | IP address of the client    |
| `user_agent` | varchar(255)    | NULL                                | Browser/client user agent   |
| `expires_at` | datetime        | NOT NULL                            | Token expiration timestamp  |
| `created_at` | timestamp       | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Token creation timestamp    |

**Indexes:**

- PRIMARY KEY: `id`
- INDEX: `idx_user_id` on `user_id`

**Foreign Keys:**

- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

**Character Set:** utf8mb3 (utf8mb3_persian_ci)

---

## Relationships

```
┌─────────────────┐
│     users       │
│─────────────────│
│ • id (PK)       │
│   first_name    │
│   last_name     │
│   birth_date    │
│   phone (UNIQUE)│
│   email         │
│   created_at    │
│   updated_at    │
└─────────────────┘
         │
         │ 1
         │
         │
         │ *
         ├──────────────────────┐
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌─────────────────┐
│     tokens      │    │      otps       │
│─────────────────│    │─────────────────│
│ • id (PK)       │    │ • id (PK)       │
│ ○ user_id (FK)  │    │   phone         │
│   token         │    │   otp_code      │
│   ip_address    │    │   created_at    │
│   user_agent    │    │   used_at       │
│   expires_at    │    └─────────────────┘
│   created_at    │
└─────────────────┘
```

### Relationship Details

1. **users → tokens** (One-to-Many)

   - One user can have multiple authentication tokens
   - `tokens.user_id` → `users.id`
   - CASCADE DELETE: When a user is deleted, all their tokens are deleted

2. **users ↔ otps** (Implicit via phone)
   - OTPs are linked to users via phone number
   - No formal foreign key constraint
   - Used for authentication before user registration/login

---

## Data Flow

### Authentication Process

1. **OTP Generation**

   - User enters phone number
   - System creates record in `otps` table with generated code
   - OTP sent to user's phone

2. **OTP Verification**

   - User submits OTP code
   - System verifies code in `otps` table
   - Updates `used_at` timestamp upon successful verification

3. **User Creation/Login**

   - New user: Creates record in `users` table
   - Existing user: Retrieves user data by phone number

4. **Token Generation**

   - Creates authentication token in `tokens` table
   - Links token to user via `user_id`
   - Records IP address and user agent for security
   - Sets expiration time

5. **Session Management**
   - Client includes token in subsequent requests
   - System validates token against `tokens` table
   - Checks expiration and user association

---

## Security Considerations

### Current Implementation

✅ **Strengths:**

- Foreign key constraints ensure referential integrity
- CASCADE DELETE prevents orphaned tokens
- Timestamps for audit trail
- Unique phone constraint prevents duplicates
- Token expiration for security

⚠️ **Recommendations:**

1. **OTP Table:**

   - Consider adding expiration logic (currently no `expires_at` field)
   - Add attempts counter to prevent brute force
   - Consider adding foreign key to users table (optional)

2. **Tokens Table:**

   - Token should be hashed/encrypted in storage
   - Consider adding a `revoked_at` field for manual token revocation
   - Add cleanup job for expired tokens

3. **Users Table:**

   - Email should have UNIQUE constraint if used for authentication
   - Consider adding `is_active` or `status` field
   - Add email verification status

4. **General:**
   - Consider adding indexes on frequently queried timestamp fields
   - Add `last_login_at` to users table for monitoring
   - Implement rate limiting at application level

---

## Database Engine & Charset

- **Engine:** InnoDB (supports transactions and foreign keys)
- **Character Set:** utf8mb3 with persian_ci collation
- **Timezone:** UTC (+00:00)

---

## Maintenance Queries

### Clean expired tokens

```sql
DELETE FROM tokens WHERE expires_at < NOW();
```

### Clean old unused OTPs (older than 24 hours)

```sql
DELETE FROM otps
WHERE used_at IS NULL
AND created_at < DATE_SUB(NOW(), INTERVAL 24 HOUR);
```

### Find active sessions per user

```sql
SELECT u.phone, u.first_name, u.last_name, COUNT(t.id) as active_tokens
FROM users u
LEFT JOIN tokens t ON u.id = t.user_id AND t.expires_at > NOW()
GROUP BY u.id;
```

---

_Document generated on: November 2, 2025_
_Schema version: 1.0_
