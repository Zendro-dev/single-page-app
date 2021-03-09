const { readdir, stat, writeFile } = require('fs/promises');
const { parse } = require('path');

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

module.exports = async () => {
  const admin = await readdir('./admin');
  const models = await readdir('./models');

  const adminResources = admin.map((file) => parse(file).name);
  const modelResources = models.map((file) => parse(file).name);

  // Generate the default set of acl rules
  const aclRules = defaultRoles.map(({ roles, permissions }) => ({
    roles,
    allows: [
      {
        permissions,
        resources: roles === 'administrator' ? adminResources : modelResources,
      },
    ],
  }));

  // Create a default acl-rules file if it does not exist
  const aclRulesFile = './src/config/acl-rules.json';
  try {
    await stat(aclRulesFile);
  } catch (error) {
    await writeFile(aclRulesFile, JSON.stringify(aclRules, null, 2));
  }

  return {
    cacheable: false,
    code: `module.exports = ${JSON.stringify(aclRules)}`,
  };
};
