export const DEFAULT_PERMISSIONS = [
  // Profile & Account
  { code: 'profile.read', name: 'View Profile', groupName: 'Profile' },
  { code: 'profile.update', name: 'Update Profile', groupName: 'Profile' },

  // Cart & Wishlist
  { code: 'cart.manage', name: 'Manage Cart', groupName: 'Cart' },
  { code: 'wishlist.manage', name: 'Manage Wishlist', groupName: 'Wishlist' },

  // Order
  { code: 'order.create', name: 'Create Order', groupName: 'Order' },
  { code: 'order.read', name: 'Read All Orders', groupName: 'Order' },
  { code: 'order.read_own', name: 'Read Own Orders', groupName: 'Order' },
  { code: 'order.cancel', name: 'Cancel Any Order', groupName: 'Order' },
  { code: 'order.cancel_own', name: 'Cancel Own Order', groupName: 'Order' },
  { code: 'order.confirm', name: 'Confirm Order', groupName: 'Order' },
  { code: 'order.ship', name: 'Ship Order', groupName: 'Order' },
  { code: 'order.complete', name: 'Complete Order', groupName: 'Order' },
  { code: 'order.refund', name: 'Refund Order', groupName: 'Order' },

  // Product
  { code: 'product.read', name: 'Read Products', groupName: 'Product' },
  { code: 'product.create', name: 'Create Product', groupName: 'Product' },
  { code: 'product.update', name: 'Update Product', groupName: 'Product' },
  { code: 'product.delete', name: 'Delete Product', groupName: 'Product' },

  // Category
  { code: 'category.read', name: 'Read Categories', groupName: 'Category' },
  { code: 'category.create', name: 'Create Category', groupName: 'Category' },
  { code: 'category.update', name: 'Update Category', groupName: 'Category' },
  { code: 'category.delete', name: 'Delete Category', groupName: 'Category' },

  // Payment
  { code: 'payment.read', name: 'Read Payments', groupName: 'Payment' },
  { code: 'payment.confirm', name: 'Confirm Payment', groupName: 'Payment' },
  { code: 'payment.refund', name: 'Refund Payment', groupName: 'Payment' },

  // Coupon
  { code: 'coupon.read', name: 'Read Coupons', groupName: 'Coupon' },
  { code: 'coupon.create', name: 'Create Coupon', groupName: 'Coupon' },
  { code: 'coupon.update', name: 'Update Coupon', groupName: 'Coupon' },
  { code: 'coupon.delete', name: 'Delete Coupon', groupName: 'Coupon' },

  // Inventory
  { code: 'inventory.read', name: 'Read Inventory', groupName: 'Inventory' },
  { code: 'inventory.import', name: 'Import Inventory', groupName: 'Inventory' },
  { code: 'inventory.export', name: 'Export Inventory', groupName: 'Inventory' },
  { code: 'inventory.adjust', name: 'Adjust Inventory', groupName: 'Inventory' },

  // Reports
  { code: 'report.sales', name: 'View Sales Report', groupName: 'Report' },
  { code: 'report.order', name: 'View Order Report', groupName: 'Report' },
  { code: 'report.customer', name: 'View Customer Report', groupName: 'Report' },
  { code: 'report.inventory', name: 'View Inventory Report', groupName: 'Report' },

  // Customer Management
  { code: 'customer.read', name: 'Read Customers', groupName: 'Customer' },

  // User Management
  { code: 'user.read', name: 'Read Users', groupName: 'User' },
  { code: 'user.create', name: 'Create User', groupName: 'User' },
  { code: 'user.update', name: 'Update User', groupName: 'User' },
  { code: 'user.delete', name: 'Delete User', groupName: 'User' },
  { code: 'user.block', name: 'Block/Unblock User', groupName: 'User' },

  // Role Management
  { code: 'role.read', name: 'Read Roles', groupName: 'Role' },
  { code: 'role.create', name: 'Create Role', groupName: 'Role' },
  { code: 'role.update', name: 'Update Role', groupName: 'Role' },
  { code: 'role.delete', name: 'Delete Role', groupName: 'Role' },
  { code: 'role.assign', name: 'Assign Roles', groupName: 'Role' },

  // Permission Management
  { code: 'permission.read', name: 'Read Permissions', groupName: 'Permission' },
  { code: 'permission.create', name: 'Create Permission', groupName: 'Permission' },
  { code: 'permission.update', name: 'Update Permission', groupName: 'Permission' },
  { code: 'permission.delete', name: 'Delete Permission', groupName: 'Permission' },
  { code: 'permission.assign', name: 'Assign Permissions', groupName: 'Permission' },

  // Settings
  { code: 'setting.read', name: 'Read Settings', groupName: 'Setting' },
  { code: 'setting.update', name: 'Update Settings', groupName: 'Setting' },

  // Review
  { code: 'review.create', name: 'Create Review', groupName: 'Review' },
  { code: 'review.update_own', name: 'Update Own Review', groupName: 'Review' },
];

export const ROLE_PERMISSIONS_MAPPING = {
  CUSTOMER: [
    'profile.read',
    'profile.update',
    'cart.manage',
    'wishlist.manage',
    'order.create',
    'order.read_own',
    'order.cancel_own',
    'review.create',
    'review.update_own',
  ],
  STAFF: [
    'product.read',
    'customer.read',
    'order.read',
    'order.confirm',
    'order.ship',
    'payment.read',
  ],
  MANAGER: [
    'product.read',
    'product.create',
    'product.update',
    'product.delete',
    'category.read',
    'category.create',
    'category.update',
    'category.delete',
    'order.read',
    'order.confirm',
    'order.ship',
    'order.complete',
    'order.refund',
    'payment.read',
    'payment.confirm',
    'payment.refund',
    'coupon.read',
    'coupon.create',
    'coupon.update',
    'coupon.delete',
    'inventory.read',
    'inventory.import',
    'inventory.export',
    'inventory.adjust',
    'report.sales',
    'report.order',
    'report.customer',
    'report.inventory',
    'customer.read',
  ],
  ADMIN: ['*'], // All permissions
};
