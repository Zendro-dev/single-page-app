/**
 * requests.index.js module provides function loadApi() which
 * imports dynamically the api modules required.
 */
import { retry } from '../utils';

const modelNamesIndex = ['no_assoc', 'role', 'role_to_user', 'user'];

/**
 * loadApi  imports (dynamically) the api requests from modules required in @target parameter and
 * returns and object with each of the modules required.
 *
 * @param {array | string} target target model's name string to import or string array of
 * target models names to import.
 * @returns {object}  object with api index modules imported of the required models.
 */
export async function loadApi(target) {
  //check
  if (!target || (typeof target !== 'string' && !Array.isArray(target)))
    throw new Error(`expected string or array in arg: ${target}`);

  let api = {};
  let _target = [];

  //set target array
  if (typeof target === 'string') _target.push(target);
  else {
    for (let i = 0; i < target.length; i++) {
      if (!_target.includes(target[i])) _target.push(target[i]);
    }
  }
  //loads api module of models names in target array
  for (let i = 0; i < _target.length; i++) {
    let modelName = _target[i];
    //check
    if (!modelNamesIndex.includes(modelName))
      throw new Error(
        `target model name provided '${modelName}' does not exists`
      );

    let module = null;
    switch (modelName) {
      case 'no_assoc':
        module = await retry(() =>
          import(/* webpackChunkName: "Request-NoAssoc" */ './no_assoc')
        ).catch((e) => {
          console.log(e);
          return null;
        });
        if (!module) return null;
        else api['no_assoc'] = module.default;
        break;
      case 'role':
        module = await retry(() =>
          import(/* webpackChunkName: "Request-Role" */ './role')
        ).catch((e) => {
          console.log(e);
          return null;
        });
        if (!module) return null;
        else api['role'] = module.default;
        break;
      case 'role_to_user':
        module = await retry(() =>
          import(/* webpackChunkName: "Request-RoleToUser" */ './role_to_user')
        ).catch((e) => {
          console.log(e);
          return null;
        });
        if (!module) return null;
        else api['role_to_user'] = module.default;
        break;
      case 'user':
        module = await retry(() =>
          import(/* webpackChunkName: "Request-User" */ './user')
        ).catch((e) => {
          console.log(e);
          return null;
        });
        if (!module) return null;
        else api['user'] = module.default;
        break;

      default:
        console.error('unknown model request: ' + modelName);
        return null;
    }
  }
  return api;
}
