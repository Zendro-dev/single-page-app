export type AclPermission = 'create' | 'read' | 'update' | 'delete' | '*';

export type ParsedPermissions = {
  [key in Exclude<AclPermission, '*'>]: boolean;
};
