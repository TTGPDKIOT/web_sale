export enum AuditActionType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  RESET_PASSWORD = 'RESET_PASSWORD',
  USER_BLOCKED = 'USER_BLOCKED',
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  ROLE_CREATED = 'ROLE_CREATED',
  ROLE_UPDATED = 'ROLE_UPDATED',
  ROLE_PERMISSION_UPDATED = 'ROLE_PERMISSION_UPDATED',
  PERMISSION_ASSIGNED = 'PERMISSION_ASSIGNED',
  PRODUCT_CREATED = 'PRODUCT_CREATED',
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',
  ORDER_STATUS_UPDATED = 'ORDER_STATUS_UPDATED',
}

export class AuditLog {
  id: string;
  userId?: string;
  action: AuditActionType | string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}
