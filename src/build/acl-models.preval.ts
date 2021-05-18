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
  let aclRules: AclSet[];
  const rulesPath = process.cwd() + '/src/custom/acl-models.json';

  try {
    /**
     * If `acl-rules.json` exists, import the file and cache the contents.
     */
    await stat(rulesPath);
    aclRules = require(rulesPath);
  } catch (error) {
    /**
     * If the file does not exist, generate the default contents and
     * write them to file.
     */
    const admin = await readdir('./admin');
    const models = await readdir('./models');

    const adminResources = admin.map((file) => parse(file).name);
    const modelResources = models.map((file) => parse(file).name);

    aclRules = defaultRoles.map(({ roles, permissions }) => ({
      roles,
      allows: [
        {
          permissions,
          resources:
            roles === 'administrator' ? adminResources : modelResources,
        },
      ],
    }));

    await mkdir('src/custom', { recursive: true });
    await writeFile(rulesPath, JSON.stringify(aclRules, null, 2));
  }

  return aclRules;
}

export default preval(buildModelsAclRules());
