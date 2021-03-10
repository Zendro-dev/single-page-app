import { mkdir, readdir, stat, writeFile } from 'fs/promises';
import { parse } from 'path';
import { RawModule } from '@/types/build';

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

export default async (): Promise<RawModule> => {
  const admin = await readdir('./admin');
  const models = await readdir('./models');

  const adminResources = admin.map((file) => parse(file).name);
  const modelResources = models.map((file) => parse(file).name);

  // Generate the default set of acl rules
  const rules = defaultRoles.map(({ roles, permissions }) => ({
    roles,
    allows: [
      {
        permissions,
        resources: roles === 'administrator' ? adminResources : modelResources,
      },
    ],
  }));

  // Create a default acl-rules file if it does not exist
  const customDir = './src/custom';
  const aclRulesFile = `${customDir}/acl-rules.json`;
  try {
    await stat(aclRulesFile);
  } catch (error) {
    await mkdir(customDir, { recursive: true });
    await writeFile(aclRulesFile, JSON.stringify(rules, null, 2));
  }

  return {
    cacheable: true,
    code: `module.exports = ${JSON.stringify(rules)}`,
  };
};
