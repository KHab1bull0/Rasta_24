export const PERMISSIONS = {
  PRODUCT_READ: 'product:read',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',

  ORDER_READ: 'order:read',
  ORDER_CREATE: 'order:create',
  ORDER_UPDATE: 'order:update',

  SHOP_READ: 'shop:read',
  SHOP_UPDATE: 'shop:update',

  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',

  BAKER_READ: 'baker:read',
  BAKER_APPROVE: 'baker:approve',

  ANALYTICS_READ: 'analytics:read',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
