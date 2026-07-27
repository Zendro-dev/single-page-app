export type AclPermission = 'create' | 'read' | 'update' | 'delete' | '*';

export type ParsedPermissions = {
  [key in Exclude<AclPermission, '*'>]: boolean;
};

// acl2's own bundled types declare the equivalent shape (as `RolePermission`)
// without an `export` keyword inside its `declare module "acl2"` block, so
// it isn't actually importable - a local type is more robust than relying
// on an internal, unexported declaration of a third-party package.
export interface AclRuleSet {
  roles: string;
  allows: {
    resources: string[];
    permissions: AclPermission | AclPermission[];
  }[];
}
