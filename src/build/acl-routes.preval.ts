import { AclSet } from 'acl2';
import preval from 'next-plugin-preval';
import { mkdir, readdir, stat, writeFile } from 'fs/promises';
import { parseModelsAsRoutes } from './routes';

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
 * Extend the current model routes to also include their request routes.
 * @param resources array of model routes
 * @param modelRoute current model route
 * @returns array of model and request routes
 */
const requestReducer = (resources: string[], modelRoute: string): string[] => {
  const requestRoutes = ['details', 'edit', 'new'].map(
    (request) => modelRoute + '/' + request
  );
  return [...resources, modelRoute, ...requestRoutes];
};

/**
 * Generate a set of ACL rules for every protected route in the application.
 * @returns a valid set of ACL rules
 */
async function buildRoutesAclRules(): Promise<AclSet[]> {
  let aclRules: AclSet[];
  const rulesPath = process.cwd() + '/src/custom/acl-routes.json';

  try {
    /**
     * If `acl-rules.json` exists, import the file and cache the contents.
     */
    await stat(rulesPath);
    aclRules = require(rulesPath);
  } catch (error) {
    /**
     * If the file does not exist, use the provided data models to generate
     * the default contents and write them to file.
     */
    const admin = await readdir('./admin');
    const models = await readdir('./models');

    /**
     * Route resources are as page URLs in the application. A "/models" resource
     * is also added to the list of permissions, corresponding to the "Home"
     * route in the models navigation.
     */
    const adminResources = admin
      .map(parseModelsAsRoutes('admin'))
      .map((link) => link.href)
      .reduce<string[]>(requestReducer, []);

    const modelResources = models
      .map(parseModelsAsRoutes('models'))
      .map((link) => link.href)
      .reduce<string[]>(requestReducer, []);

    aclRules = defaultRoles.map(({ roles, permissions }) => ({
      roles,
      allows: [
        {
          permissions,
          resources:
            roles === 'administrator'
              ? adminResources
              : ['/models', ...modelResources],
        },
      ],
    }));

    await mkdir('src/custom', { recursive: true });
    await writeFile(rulesPath, JSON.stringify(aclRules, null, 2));
  }

  return aclRules;
}

export default preval(buildRoutesAclRules());
