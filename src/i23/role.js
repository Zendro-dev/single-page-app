import requestGraphql from './request'

export default {

  create : function({url, variables, token}){
  let query = ` mutation addRole(
   $name:String  $description:String      $addUsers:[ID]  ){
    addRole(
     name:$name   description:$description           addUsers:$addUsers     ){id  name   description   }
  }
  `
  return requestGraphql({url, query, variables, token});
},


  readOneRole : function({url, variables, token}){
    let query = `query readOneRole($id:ID!){
      readOneRole(id:$id){id  name   description               countFilteredUsers     }
    }`
    return requestGraphql({url, query, variables, token});
  },

  update : function({url, variables, token}){
    let query = `mutation updateRole($id:ID!
     $name:String  $description:String          $addUsers:[ID] $removeUsers:[ID]     ){
      updateRole(id:$id
       name:$name   description:$description               addUsers:$addUsers removeUsers:$removeUsers       ){id  name   description  }
    }`

    return requestGraphql({url, query, variables, token});
  },

  deleteRole : function({url, variables, token}){
    let query = `mutation deleteRole($id:ID!){
      deleteRole(id:$id)
    }`
    return requestGraphql({url, query, variables, token});
  },

  tableTemplate: function({url}){
    let query = `query {csvTableTemplateRole }`

    return requestGraphql({url,query});
  },

  //simple queries needed in spa components

  vueTable: `{vueTableRole{data {id  name  description countFilteredUsers } total per_page current_page last_page prev_page_url next_page_url from to}}`,

  getAll: function(label, sublabel){
    return `query
    roles($search: searchRoleInput $pagination: paginationInput)
   {roles(search:$search pagination:$pagination){id ${label} ${sublabel} } }`
  },

  getOne: function(subQuery,label, sublabel){
    return `query readOneRole($id: ID!, $offset:Int, $limit:Int) {
      readOneRole(id:$id){ ${subQuery}(pagination:{limit: $limit offset:$offset }){ id ${label} ${sublabel} } } }`
  },

  /*
    @v-data-table support
  */
  //get item count
  getCount: function(url, searchText){
    /*
      Set @search arg
    */
   var s = '';
   var query = '';

   if(searchText !== null && searchText !== '') 
   {
      s = `search: {operator:or, search: [ 
                  {field:name, value:{value:"%${searchText}%"}, operator:like}, 
                  {field:description, value:{value:"%${searchText}%"}, operator:like}, 
              ]}`
      //query with search
      query = `{ countRoles(${s}) }`;
   }
   else {
      //query without search
      query =`{ countRoles }`;
   }

   return requestGraphql({url,query});
  },

  getItems: function(url, searchText, orderBy, orderDirection, paginationOffset, paginationLimit){
    /*
      Set search
    */
    var s = null;
    if(searchText !== null && searchText !== '')
    {
        s = `search: {operator:or, search: [
                      {field:name, value:{value:"%${searchText}%"}, operator:like}, 
                      {field:description, value:{value:"%${searchText}%"}, operator:like}, 
                  ]}`
    }
    /*
      Set order
    */
    var o = null;
    if(typeof orderBy !== 'undefined')
    {
        /*
          Add sort fields
        */
        let upOrderDirection = String(orderDirection).toUpperCase();
        o = `order: [ {field: ${orderBy.field}, order: ${upOrderDirection}} ]`;
    }

    /*
      Set pagination
    */
    var p = `pagination: {offset: ${paginationOffset}, limit: ${paginationLimit}}`

    /*
      Set graphQL query
    */
    var query = '';

    //if has search
    if(s !== null)
    {
      //if has order
      if(o != null)
      {
        //query with search & sort & pagination
        query = 
        `{
          roles(${s}, ${o}, ${p}) {
                    id
                                    name 
                                    description 
                                }
        }`
      }//end: if has order
      else { //has not order
        
        //query with search & pagination
        query = 
        `{
          roles(${s}, ${p}) {
                    id
                                    name 
                                    description 
                                }
        }`
      }//end: else: has not order
    }//end: if has search
    else { // has not search
      
      //if has order
      if(o != null)
      {
        //query with sort & pagination
        query = 
        `{
          roles(${o}, ${p}) {
                    id
                                    name 
                                    description 
                                }
        }`
      }//end: if has order
      else { //has not order
        
        //query with pagination only
        query = 
        `{
          roles(${p}) {
                    id
                                    name 
                                    description 
                                }
        }`
      }//end: else: has not order
    }//end: else: has not search

    console.log("query: gql:\n", query);

    return requestGraphql({url,query});
  }//end: getItems()

}
