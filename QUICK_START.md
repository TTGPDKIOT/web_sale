# Quick Start Guide - Authentication System

## 🚀 Getting Started (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
```bash
# Copy example
cp .env.example .env

# Update .env with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=dac_san_db

JWT_SECRET=your-secret-key-here
ADMIN_PASSWORD=Admin@123456
```

### Step 3: Start the Server
```bash
# Development mode with auto-reload
npm run start:dev

# Or production mode
npm run build
npm start
```

The server will be running at `http://localhost:3000`

### Step 4: Seed the Database
In another terminal:
```bash
npm run seed
```

This creates:
- Roles: CUSTOMER, STAFF, MANAGER, ADMIN
- 55+ Permissions (organized by feature)
- Admin user: admin@example.com / Admin@123456

## 🧪 Testing with Postman/Curl

### 1. Login as Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin@example.com",
    "password": "Admin@123456"
  }'
```

Response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "3a4b5c6d7e8f...",
  "user": {
    "id": "uuid-here",
    "email": "admin@example.com",
    "fullName": "Administrator",
    "roles": ["ADMIN"],
    "permissions": ["*"]
  }
}
```

### 2. Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. List All Users
```bash
curl -X GET http://localhost:3000/api/admin/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 4. List All Roles
```bash
curl -X GET http://localhost:3000/api/admin/roles \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. List All Permissions
```bash
curl -X GET http://localhost:3000/api/admin/permissions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 6. Register New Customer
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "phone": "0901234567",
    "password": "Customer@123",
    "fullName": "John Customer"
  }'
```

### 7. Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### 8. Change Password
```bash
curl -X POST http://localhost:3000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "OldPass@123",
    "newPassword": "NewPass@456"
  }'
```

## 📊 Swagger API Documentation

Swagger documentation is automatically generated. Visit:
```
http://localhost:3000/api/docs
```

## 🎯 Key API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/logout-all` - Logout from all devices
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/me` - Get current user info

### User Management
- `GET /api/admin/users` - List users
- `GET /api/admin/users/:id` - Get user details
- `PATCH /api/admin/users/:id` - Update user
- `POST /api/admin/users/:id/assign-roles` - Assign roles
- `POST /api/admin/users/:id/block` - Block user
- `POST /api/admin/users/:id/unblock` - Unblock user

### Role Management
- `GET /api/admin/roles` - List roles
- `GET /api/admin/roles/:id` - Get role details
- `POST /api/admin/roles` - Create role
- `PATCH /api/admin/roles/:id` - Update role
- `DELETE /api/admin/roles/:id` - Delete role
- `POST /api/admin/roles/:id/permissions` - Assign permissions

### Permission Management
- `GET /api/admin/permissions` - List permissions
- `GET /api/admin/permissions/:id` - Get permission details
- `POST /api/admin/permissions` - Create permission
- `PATCH /api/admin/permissions/:id` - Update permission
- `DELETE /api/admin/permissions/:id` - Delete permission

### Audit Logs
- `GET /api/admin/audit-logs/user/:userId` - Get user's audit log
- `GET /api/admin/audit-logs/target/:targetId` - Get target's audit log

## 🔐 Default Credentials

After seeding:
- **Email**: admin@example.com
- **Password**: Admin@123456 (or value of ADMIN_PASSWORD env var)
- **Role**: ADMIN
- **Permissions**: All (*)

⚠️ **Change the admin password immediately in production!**

## 🧩 Integrating with Your Endpoints

### Protect an Endpoint
```typescript
import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/require-permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('api/products')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ProductController {
  @Get()
  @RequirePermissions('product.read')
  getProducts() {
    // Only users with product.read permission
  }

  @Post()
  @RequirePermissions('product.create')
  createProduct(@Body() createProductDto) {
    // Only users with product.create permission
  }

  @Patch(':id')
  @RequirePermissions('product.update')
  updateProduct(@Param('id') id: string, @Body() updateProductDto) {
    // Only users with product.update permission
  }

  @Delete(':id')
  @RequirePermissions('product.delete')
  deleteProduct(@Param('id') id: string) {
    // Only users with product.delete permission
  }
}
```

### Use Current User Info
```typescript
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Get('my-orders')
@UseGuards(JwtAuthGuard)
getMyOrders(@CurrentUser() user: any) {
  console.log('User ID:', user.id);
  console.log('User Email:', user.email);
  console.log('User Roles:', user.roles);
  console.log('User Permissions:', user.permissions);
  
  // Fetch only this user's orders
  return this.orderService.getOrdersByUserId(user.id);
}
```

## 📝 Common Permission Codes

### Product Management
- `product.read` - View products
- `product.create` - Create products
- `product.update` - Update products
- `product.delete` - Delete products

### Order Management
- `order.read` - View all orders
- `order.read_own` - View own orders only
- `order.create` - Create orders
- `order.cancel` - Cancel any order
- `order.cancel_own` - Cancel own order
- `order.confirm` - Confirm orders
- `order.ship` - Ship orders
- `order.complete` - Complete orders
- `order.refund` - Refund orders

### User Management
- `user.read` - View users
- `user.create` - Create users
- `user.update` - Update users
- `user.delete` - Delete users
- `user.block` - Block/Unblock users

### Role & Permission Management
- `role.read` - View roles
- `role.create` - Create roles
- `role.update` - Update roles
- `role.delete` - Delete roles
- `role.assign` - Assign roles to users
- `permission.read` - View permissions
- `permission.assign` - Assign permissions to roles

See `AUTH_IMPLEMENTATION.md` for the complete list.

## 🐛 Debugging

### Check logs in development
```bash
# Enable SQL logging in .env
DB_LOGGING=true

# Run with debug
DEBUG=* npm run start:dev
```

### Common Issues

**"Unauthorized" error**
- Verify access token is included in Authorization header
- Check token hasn't expired (default: 15 minutes)
- Ensure JWT_SECRET matches

**"Forbidden" error**
- User doesn't have required permission
- Verify permission code matches decorator
- Check user's roles have the permission assigned

**Cannot connect to database**
- Verify PostgreSQL is running
- Check DB credentials in .env
- Ensure database exists

**Seed fails**
- Database must exist first
- Ensure all migrations have run
- Check for unique constraint violations

## 📚 Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## 📞 Next Steps

1. ✅ Install and run the system
2. ✅ Test authentication endpoints
3. ✅ Create users with different roles
4. ✅ Test permission guards
5. ✅ Integrate with existing endpoints
6. ✅ Customize permissions as needed
7. ✅ Deploy to production (update JWT_SECRET!)

---

**Need help?** Refer to `AUTH_IMPLEMENTATION.md` for comprehensive documentation.
