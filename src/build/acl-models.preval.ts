import { AclSet } from 'acl';
import preval from 'next-plugin-preval';
import { mkdir, readdir, stat, writeFile } from 'fs/promises';
import { parse } from 'path';

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

async function buildModelsAclRules(): Promise<AclSet[]> {
  const rulesFile = 'acl-models.json';
  const customPath = process.cwd() + `/src/custom/${rulesFile}`;
  const overridePath = process.cwd() + `/src/${rulesFile}`;

  /**
   * Re-generate the default file and write them to file.
   */
  const admin = await readdir('./admin');
  const models = await readdir('./models');

  const adminResources = admin.map((file) => parse(file).name);
  const modelResources = models.map((file) => parse(file).name);

  let aclRules: AclSet[] = defaultRoles.map(({ roles, permissions }) => ({
    roles,
    allows: [
      {
        permissions,
        resources: roles === 'administrator' ? adminResources : modelResources,
      },
    ],
  }));

  await mkdir('src/custom', { recursive: true });
  await writeFile(customPath, JSON.stringify(aclRules, null, 2));

  /**
   * If `acl-models.json` exists, import the file and cache the contents.
   */
  try {
    await stat(overridePath);
    aclRules = require(overridePath);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }

  return aclRules;
}

export default preval(buildModelsAclRules());
