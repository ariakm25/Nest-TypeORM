export enum PermissionStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum PermissionEnum {
  ROLE_CREATE = 'create role',
  ROLE_READ = 'read role',
  ROLE_UPDATE = 'update role',
  ROLE_DELETE = 'delete role',

  PERMISSION_CREATE = 'create permission',
  PERMISSION_READ = 'read permission',
  PERMISSION_UPDATE = 'update permission',
  PERMISSION_DELETE = 'delete permission',

  USER_CREATE = 'create user',
  USER_READ = 'read user',
  USER_UPDATE = 'update user',
  USER_DELETE = 'delete user',
}
