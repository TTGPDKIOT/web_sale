# Authentication & Authorization Implementation Guide

## Overview

This document provides a complete guide to the Authentication & Authorization system implemented in this NestJS e-commerce backend.

## Architecture

The system follows a **Clean Architecture** pattern with the following structure:

```
src/
  modules/
    auth/                    # Authentication module
      application/
        dtos/               # Request/Response DTOs
        strategies/         # JWT Strategy
      auth.service.ts
      auth.controller.ts
      auth.module.ts
    
    users/                  # User management module
      domain/
        entities/
        repositories/
      infrastructure/
        persistence/
          typeorm/
      users.service.ts
      users.controller.ts
      users.module.ts
    
    roles/                  # Role management module
    permissions/            # Permission management module
    audit-logs/             # Audit logging module
  
  common/
    guards/                 # JWT & Permissions guards
    decorators/             # Custom decorators
    utils/                  # Shared utilities
  
  database/
    seeds/                  # Database seeding scripts
```

## Key Features Implemented

### 1. User Authentication
- **Register**: Create new user accounts with validation
- **Login**: Email/phone + password authentication
- **Refresh Token**: JWT refresh token with rotation
- **Logout**: Revoke refresh tokens (single device or all devices)
- **Change Password**: Secure password update with old password verification
- **Get Current User**: Retrieve authenticated user details with permissions

### 2. JWT Token Management
- **Access Token**: 15-minute expiry (configurable)
- **Refresh Token**: 7-day expiry with rotation (configurable)
- **Token Rotation**: Old tokens are revoked when new tokens are issued
- **Token Hashing**: Refresh tokens are hashed in database (SHA-256)
- **Device Tracking**: Tokens track device info, IP address, user agent

### 3. Role-Based Access Control (RBAC)
- **4 Default Roles**: CUSTOMER, STAFF, MANAGER, ADMIN
- **Role Assignment**: Assign multiple roles to users
- **Protected Roles**: Cannot delete CUSTOMER or ADMIN roles
- **ADMIN Override**: ADMIN role has all permissions

### 4. Permission-Based Authorization
- **55+ Default Permissions**: Grouped by feature (Product, Order, User, etc.)
- **Granular Control**: Fine-grained permissions like `order.read_own`, `product.update`
- **Permission Guard**: `@RequirePermissions()` decorator protects endpoints
- **Wildcard Permission**: ADMIN role gets `*` (all permissions)

### 5. Audit Logging
- **Login Events**: Track successful/failed logins
- **User Management**: Log user creation, updates, blocking
- **Role Management**: Track role and permission changes
- **Data Actions**: Log product, order, and other business operations
- **Metadata**: Capture IP, user agent, action details

### 6. Security Features
- **Password Hashing**: bcrypt with salt=10
- **Token Hashing**: SHA-256 for refresh tokens
- **Password Validation**: Minimum 8 chars, requires uppercase, lowercase, number, special char
- **User Status Checks**: Blocked/Inactive users cannot login
- **Soft Deletes**: Users/Roles can be soft-deleted (not permanently removed)

## Database Schema

### Users Table
```sql
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  phone VARCHAR UNIQUE,
  passwordHash VARCHAR,
  fullName VARCHAR,
  avatarUrl VARCHAR,
  status ENUM (ACTIVE, INACTIVE, BLOCKED, PENDING_VERIFY),
  provider ENUM (LOCAL, GOOGLE, FACEBOOK),
  providerId VARCHAR,
  lastLoginAt TIMESTAMP,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  deletedAt TIMESTAMP
)
```

### Roles Table
```sql
roles (
  id UUID PRIMARY KEY,
  code VARCHAR UNIQUE,
  name VARCHAR,
  description TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  deletedAt TIMESTAMP
)
```

### Permissions Table
```sql
permissions (
  id UUID PRIMARY KEY,
  code VARCHAR UNIQUE,
  name VARCHAR,
  groupName VARCHAR,
  description TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
)
```

### Junction Tables
```sql
user_roles (
  user_id UUID REFERENCES users(id),
  role_id UUID REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
)

role_permissions (
  role_id UUID REFERENCES roles(id),
  permission_id UUID REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id)
)
```

### Refresh Tokens Table
```sql
refresh_tokens (
  id UUID PRIMARY KEY,
  userId UUID REFERENCES users(id),
  tokenHash VARCHAR NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  revokedAt TIMESTAMP,
  replacedByTokenId UUID,
  deviceInfo VARCHAR,
  ipAddress VARCHAR,
  userAgent TEXT,
  createdAt TIMESTAMP
)
```

### Audit Logs Table
```sql
audit_logs (
  id UUID PRIMARY KEY,
  userId UUID,
  action VARCHAR,
  targetType VARCHAR,
  targetId UUID,
  metadata JSONB,
  ipAddress VARCHAR,
  userAgent TEXT,
  createdAt TIMESTAMP
)
```

## API Endpoints

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "0900000000",
  "password": "SecurePass@123",
  "fullName": "John Doe"
}

Response:
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "random-token-hash",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "roles": ["CUSTOMER"],
    "permissions": ["order.create", "profile.read"]
  }
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "identifier": "user@example.com",
  "password": "SecurePass@123"
}

Response: Same as Register
```

#### Refresh Token
```
POST /api/auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "random-token-hash"
}

Response:
{
  "accessToken": "new-jwt-token",
  "refreshToken": "new-random-token"
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "refreshToken": "random-token-hash"
}

Response:
{
  "message": "Logged out successfully"
}
```

#### Logout All Devices
```
POST /api/auth/logout-all
Authorization: Bearer {accessToken}

Response:
{
  "message": "Logged out from all devices"
}
```

#### Change Password
```
POST /api/auth/change-password
Authorization: Bearer {accessToken}
Content-Type: application/json

{
  "oldPassword": "OldPass@123",
  "newPassword": "NewPass@456"
}

Response:
{
  "message": "Password changed successfully"
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer {accessToken}

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "phone": "0900000000",
  "fullName": "John Doe",
  "roles": ["CUSTOMER"],
  "permissions": ["order.read_own", "profile.update"]
}
```

### User Management Endpoints

```
GET    /api/admin/users              # List users (requires user.read)
GET    /api/admin/users/:id          # Get user details
PATCH  /api/admin/users/:id          # Update user (requires user.update)
POST   /api/admin/users/:id/assign-roles # Assign roles (requires role.assign)
POST   /api/admin/users/:id/block    # Block user (requires user.block)
POST   /api/admin/users/:id/unblock  # Unblock user (requires user.block)
```

### Role Management Endpoints

```
GET    /api/admin/roles              # List roles (requires role.read)
GET    /api/admin/roles/:id          # Get role details
POST   /api/admin/roles              # Create role (requires role.create)
PATCH  /api/admin/roles/:id          # Update role (requires role.update)
DELETE /api/admin/roles/:id          # Delete role (requires role.delete)
POST   /api/admin/roles/:id/permissions # Assign permissions (requires permission.assign)
```

### Permission Management Endpoints

```
GET    /api/admin/permissions        # List permissions (requires permission.read)
GET    /api/admin/permissions/:id    # Get permission details
POST   /api/admin/permissions        # Create permission (requires permission.create)
PATCH  /api/admin/permissions/:id    # Update permission (requires permission.update)
DELETE /api/admin/permissions/:id    # Delete permission (requires permission.delete)
```

### Audit Logs Endpoints

```
GET    /api/admin/audit-logs/user/:userId    # Get user's audit logs
GET    /api/admin/audit-logs/target/:targetId # Get target's audit logs
```

## Usage Examples

### 1. Protecting an Endpoint with Permissions

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductController {
  @Get()
  @RequirePermissions('product.read')
  getProducts() {
    // Only users with product.read permission can access
  }

  @Post()
  @RequirePermissions('product.create')
  createProduct() {
    // Only users with product.create permission can access
  }
}
```

### 2. Getting Current User in Controller

```typescript
import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('profile')
export class ProfileController {
  @Get('my-orders')
  getMyOrders(@CurrentUser() user: any) {
    // user contains: id, email, roles, permissions
    const userId = user.id;
  }
}
```

### 3. Data Ownership Check

For endpoints like `/api/orders/:id`, implement ownership check:

```typescript
@Get(':id')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('order.read', 'order.read_own')
async getOrder(
  @Param('id') orderId: string,
  @CurrentUser() user: any
) {
  const order = await this.orderService.getOrderById(orderId);
  
  // If user has order.read, allow viewing any order
  // If user only has order.read_own, allow only their own orders
  if (!user.permissions.includes('order.read')) {
    if (order.customerId !== user.id) {
      throw new ForbiddenException('You can only view your own orders');
    }
  }
  
  return order;
}
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=dac_san_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# Admin
ADMIN_PASSWORD=Admin@123456
```

### 3. Run Database Migrations

```bash
npm run typeorm -- migration:run -d src/database/typeorm.config.ts
```

Or let TypeORM auto-sync (set synchronize: true in config):

```bash
# The app will auto-create tables on startup
npm run start:dev
```

### 4. Seed Database with Initial Data

```bash
npm run seed
```

This will create:
- 4 default roles (CUSTOMER, STAFF, MANAGER, ADMIN)
- 55+ default permissions
- Admin user (admin@example.com / Admin@123456)

### 5. Start the Server

```bash
npm run start:dev
```

The server will start on `http://localhost:3000`

## Authentication Flow

### Login Flow

1. User sends POST to `/auth/login` with email/phone and password
2. System validates credentials and user status
3. System generates access token (JWT) and refresh token (random)
4. Refresh token is hashed and stored in database with expiry
5. Both tokens returned to client
6. Client stores both tokens (access token in memory, refresh in httpOnly cookie recommended)

### Protected Request Flow

1. Client sends request with `Authorization: Bearer {accessToken}`
2. `JwtAuthGuard` validates the JWT signature and expiry
3. JWT payload is decoded and user info is attached to request
4. `PermissionsGuard` checks if user has required permissions
5. If authorized, endpoint handler executes
6. If not authorized, 403 Forbidden is returned

### Refresh Token Flow

1. Client detects access token expired (401 response or JWT decode)
2. Client sends POST to `/auth/refresh-token` with refresh token
3. System validates refresh token: hash it and find in DB
4. Check: not revoked, not expired, user still active
5. Old token is revoked (marked with `revokedAt`)
6. New access token (JWT) and new refresh token (random) are generated
7. New refresh token is hashed and linked to old token via `replacedByTokenId`
8. Both new tokens returned to client

### Logout Flow

1. User sends POST to `/auth/logout` with refresh token
2. System hashes refresh token and finds it in DB
3. Token is revoked by setting `revokedAt = now()`
4. User can still use access token until expiry (if needed, implement blacklist)

## Permission Defaults by Role

### CUSTOMER Role
```
- profile.read
- profile.update
- cart.manage
- wishlist.manage
- order.create
- order.read_own
- order.cancel_own
- review.create
- review.update_own
```

### STAFF Role
```
- product.read
- customer.read
- order.read
- order.confirm
- order.ship
- payment.read
```

### MANAGER Role
```
- All STAFF permissions +
- product.create, product.update, product.delete
- category.*
- coupon.*
- inventory.*
- report.*
- order.complete, order.refund
- payment.confirm, payment.refund
```

### ADMIN Role
```
- * (all permissions)
```

## Common Tasks

### Add New Permission

1. Create permission in database:
```typescript
// In service
const permission = await permissionRepository.create({
  code: 'feature.action',
  name: 'Action Description',
  groupName: 'Feature',
});
```

2. Assign to role:
```typescript
// Via API or manually
const role = await roleRepository.findWithPermissions(roleId);
role.permissions.push(permission);
await roleRepository.save(role);
```

3. Use in controller:
```typescript
@Post()
@RequirePermissions('feature.action')
async doAction() { }
```

### Create New Role

```
POST /api/admin/roles
{
  "code": "WAREHOUSE_MANAGER",
  "name": "Warehouse Manager",
  "description": "Manages inventory and warehouse"
}
```

Then assign permissions:
```
POST /api/admin/roles/{roleId}/permissions
{
  "permissionIds": ["uuid1", "uuid2", ...]
}
```

### Implement Ownership Check

```typescript
// Check if order belongs to user
const permission = user.permissions.find(p => 
  p === 'order.read' || p === '*'
);

if (!permission && order.customerId !== user.id) {
  throw new ForbiddenException();
}
```

## Security Best Practices

1. **JWT Secret**: Change `JWT_SECRET` to a strong random value in production
2. **HTTPS**: Always use HTTPS in production
3. **CORS**: Configure CORS properly to prevent CSRF
4. **Refresh Token Storage**: Store refresh tokens in httpOnly cookies, not localStorage
5. **Token Expiry**: Adjust `JWT_EXPIRY` and `REFRESH_TOKEN_EXPIRY` based on security needs
6. **Rate Limiting**: Implement rate limiting on login endpoint
7. **2FA**: Consider adding two-factor authentication for admin users
8. **Audit Logs**: Monitor audit logs regularly for suspicious activity
9. **Password Policy**: Enforce strong password requirements
10. **GDPR**: Implement data deletion/export for compliance

## Troubleshooting

### "Unauthorized" Error on Protected Endpoint
- Check if access token is being sent in Authorization header
- Verify token hasn't expired (15 min default)
- Check JWT_SECRET matches in env file

### "Forbidden" Error on Endpoint
- Verify user has required permission
- Check permission code matches endpoint decorator
- Use `/api/auth/me` to see current user's permissions

### Cannot Login
- Check user status is ACTIVE (not BLOCKED or INACTIVE)
- Verify password is correct
- Check email or phone exists in database

### Refresh Token Not Working
- Verify refresh token hasn't been revoked
- Check token hasn't expired (7 days default)
- Ensure user account is still ACTIVE

## Future Enhancements

1. **Two-Factor Authentication (2FA)**: SMS/Email OTP for sensitive operations
2. **OAuth Integration**: Google, Facebook, GitHub social login
3. **Rate Limiting**: Prevent brute force attacks
4. **Token Blacklist**: Immediately invalidate access tokens on logout
5. **Password Reset**: Email-based password recovery
6. **Role Hierarchy**: Child roles inherit parent permissions
7. **Dynamic Permissions**: Permissions based on resource ownership
8. **IP Whitelisting**: Restrict login from certain IPs
9. **Session Management**: View/manage active sessions
10. **Compliance**: SOC 2, GDPR, PCI-DSS compliance features
