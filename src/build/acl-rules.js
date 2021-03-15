const { mkdir, readdir, stat, writeFile } = require('fs/promises');
const { parse } = require('path');
const { resolveCustom } = require('./helpers/resolve-custom');

/** @typedef {import('acl').AclSet} AclSet */

const defaultRoles = [
  {
    roles: 'administrator',
    permissions: '*',
  },
  {
    roles: 'editor',
    permissions: ['create', 'delete', 'update'],
  },
  {
    roles: 'reader',
    permissions: ['read'],
  },
];

/**
 * Import a custom or create default ACL rules.
 * @returns {AclSet} acl rules
 */
async function buildAclRules() {
  let rules;

  const rulesPath = resolveCustom('acl-rules.json');

  try {
    /**
     * If `acl-rules.json` exists, import the file and cache the contents.
     */
    await stat(rulesPath.absolute);
    rules = require(rulesPath.relative);
  } catch (error) {
    /**
     * If the file does not exist, generate the default contents and
     * write them to file.
     */
    const admin = await readdir('./admin');
    const models = await readdir('./models');

    const adminResources = admin.map((file) => parse(file).name);
    const modelResources = models.map((file) => parse(file).name);

    rules = defaultRoles.map(({ roles, permissions }) => ({
      roles,
      allows: [
        {
          permissions,
          resources:
            roles === 'administrator' ? adminResources : modelResources,
        },
      ],
    }));

    await mkdir(rulesPath.customDir, { recursive: true });
    await writeFile(rulesPath.absolute, JSON.stringify(rules, null, 2));
  }

  return {
    cacheable: false,
    code: `module.exports = ${JSON.stringify(rules)}`,
  };
}

module.exports = buildAclRules;
