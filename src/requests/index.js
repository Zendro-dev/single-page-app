import roleQueries from './role'
//import role_to_userQueries from './role_to_user'
import userQueries from './user'
import userQueriesB from './userB'
import roleQueriesB from './roleB'

export default {
    role: roleQueries,
    roleB: roleQueriesB,
    //Role_to_user: role_to_userQueries,
    user: userQueries,
    userB: userQueriesB,
}
