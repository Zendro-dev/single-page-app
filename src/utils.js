import decode from 'jwt-decode';
import axios from 'axios';
import getAttributes from './requests/requests.attributes'

/**
 * makeCancelable()
 * 
 * This function equips a promise with a cancel() method.
 * 
 * Solution given by @istarkov on:  https://github.com/facebook/react/issues/5465#issuecomment-157888325
 * Also referenced here: https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html
 */
export const makeCancelable = (promise) => {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (val) => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
      (error) => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

/** 
 * isAuthenticated()
 * 
 * This function validates the following conditions to determine 
 * if there is an authenticated session:
 * 
 *  1) Token exists on localStorage, and,
 *  2) Expiration time is valid (greater than current time).
 * 
 * @return {boolean} true if authenticated, false otherwise. 
 */
export function isAuthenticated() {

  //get token from local storage
  var token = localStorage.getItem('token');
  var decoded_token = null;

  //check 1: token not null
  if(token == null)
  {
    return false;
  }
  else
  {
    /*
      Decode JWT
    */
    try {
      decoded_token = decode(token);

    }
    catch(err) { //bad token
      
      //clean up localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');

      return false;
    }
  }
  //check 1: token not null: ok

  //check 2: expiration date
  if(decoded_token.hasOwnProperty('exp'))
  {
    //get current date
    var d = new Date();
    //get exp date
    var expDate = new Date(decoded_token.exp * 1000);

    if(d >= expDate)
    {
      //expired
      return false;
    }
    else
    {//check 2: expiration date: ok

      //not expired
      return decoded_token;
    }
  }
  else{ //bad json

    //clean up localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');

    return false;
  }
}

export function removeToken() {
  //clean up token
  localStorage.removeItem('token');
}

/** 
 * requestGraphql()
 * 
 * GraphQL API Query made with axios.
 * 
 * @return {Promise} Axios promise of the request made. 
 */
export function requestGraphql({ url, query, variables }) {

  var token = localStorage.getItem('token');
  if(token) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }

  return axios.post(url,
    {
        query: query,
        variables: variables
    }
  );
}

export function checkResponse(response, graphqlErrors, queryName) {
  //check: internal errors
  if(!Array.isArray(graphqlErrors)) throw new Error("internal_error: array expected");
  if(typeof queryName !== 'string') throw new Error("internal_error: string expected");
  
  //check: server error
  if(!response||!response.data) throw new Error("bad_server_response");
  //check: graphql errors
  if(response.data.errors) graphqlErrors.push({query: queryName, errors: response.data.errors});
  //check: data errors
  if(response.data.data === undefined) return "no_data"; 
  if(response.data.data === null) return "null_data";
  if(response.data.errors) return "with_errors";

  return "ok";
}

export function logRequest(name, query, variables) {
  console.group(`%caction  %cREQUEST  %c@${name}()`, 
  "color: grey; font-weight: normal; padding: 2px", "color: black; font-weight: bold; padding: 2px",
  "color: grey; font-weight: normal; padding: 2px");
  console.group("%cquery", "color: #03A9F4; font-weight: bold; padding-left: 4px");
  console.log(`%c${query}`, "color: grey; font-weight: normal;");
  console.groupEnd();
  console.log("%cvariables  %o", "color: #4CAF50; font-weight: bold; padding-left: 4px", variables);
  if(variables) {
    console.groupCollapsed("%cvariables", "color: grey; font-weight: bold; padding-left: 12px");
    console.log(`%c${JSON.stringify(variables, null, 2)}`, "color: grey; font-weight: normal;");
    console.groupEnd();
  
    if(variables.pagination) {
      console.groupCollapsed("%cpagination", "color: grey; font-weight: normal; padding-left: 16px");
      console.log(`%c${JSON.stringify(variables.pagination, null, 2)}`, "color: grey; font-weight: normal;");
      console.groupEnd();
    }
    if(variables.search) {
      console.groupCollapsed("%csearch", "color: grey; font-weight: normal; padding-left: 16px");
      console.log(`%c${JSON.stringify(variables.search, null, 2)}`, "color: grey; font-weight: normal;");
      console.groupEnd();
    }
    if(variables.order) {
      console.groupCollapsed("%corder", "color: grey; font-weight: normal; padding-left: 16px");
      console.log(`%c${JSON.stringify(variables.order, null, 2)}`, "color: grey; font-weight: normal;");
      console.groupEnd();
    }
  }
  console.groupEnd();
}

/**
 * Search utils
 */
export function getSearchArgument(filterName, searchText, ops, format, attributes) {
  //internal checks
  if(!getAttributes && !attributes) throw new Error("internal_error: attributes or getAttributes expected");
  if(getAttributes && !filterName) throw new Error("internal_error: filterName expected");
  if(searchText && typeof searchText !== 'string') throw new Error("internal_error: string expected in searchText");
  
  let filterAttributes = '';
  if(attributes) filterAttributes = attributes;
  else filterAttributes = getAttributes(filterName);
  let modelAttributes = Object.keys(filterAttributes);
  
  //strings
  let ors = '';
  let orSearch = null;
  let ands = '';
  let andSearch = null;
  //objects
  let o_ors = [];
  let o_orSearch = null;
  let o_ands = [];
  let o_andSearch = null;

  if(searchText && modelAttributes.length > 0) {
    /*
      Make AND fields
    */
    let words = searchText.split(' ');

    //for each word
    for(let w = 0; w < words.length; w++) {
      /*
        Make OR fields
      */

      //for each attribute
      for(let i = 0; i < modelAttributes.length; i++) {
        let num = 0;
        let d = '';
        let t = '';
        let dt = '';

        switch (filterAttributes[modelAttributes[i]]) {
          case 'String':
            //add
            ors += `{field:${modelAttributes[i]}, value:"%${words[w]}%", operator:like},`;
            o_ors.push({field: modelAttributes[i], value: `%${words[w]}%`, operator: "like"});
            break;

          case 'Int':
            if (!words[w].includes(',')){
              num = parseInt(words[w]);
              //add if: word is an integer number
              if (!isNaN(num)) {
                ors += `{field:${modelAttributes[i]}, value:"${num}", operator:eq},`;
                o_ors.push({field: modelAttributes[i], value: `${num}`, operator: "eq"});
              }
            }
            
            break;

          case 'Float':
            if (!words[w].includes(',')){
              num = parseFloat(words[w]);
              //add if: word is a float number
              if (!isNaN(num)) {
                ors += `{field:${modelAttributes[i]}, value:"${num}", operator:eq},`;
                o_ors.push({field: modelAttributes[i], value: `${num}`, operator: "eq"});
              }
            }
            break;
            
          case 'Boolean':
            //add if: word is 'true' or 'false'
            if (words[w] === 'true' || words[w] === 'false') {
              ors += `{field:${modelAttributes[i]}, value:"${words[w]}", operator:eq},`;
              o_ors.push({field: modelAttributes[i], value: `${words[w]}`, operator: "eq"});
            }
            break;

          case 'Date':
            if (!words[w].includes(',')){
              d = getIsoDate(words[w]);
              //add if: word is an ISO date
              if (d !== '') {
                ors += `{field:${modelAttributes[i]}, value:"${d}", operator:eq},`;
                o_ors.push({field: modelAttributes[i], value: `${d}`, operator: "eq"});
              }
            }
            break;

          case 'Time':
            if (!words[w].includes(',')){
              t = getIsoTime(words[w]);
              //add if: word is an ISO time
              if (t !== '') {
                ors += `{field:${modelAttributes[i]}, value:"${t}", operator:eq},`;
                o_ors.push({field: modelAttributes[i], value: `${t}`, operator: "eq"});
              }
            }
            break;

          case 'DateTime':
            if (!words[w].includes(',')){
              dt = getIsoDateTime(words[w]);
              //add if: word is an ISO datetime
              if (dt !== '') {
                ors += `{field:${modelAttributes[i]}, value:"${dt}", operator:eq},`;
                o_ors.push({field: modelAttributes[i], value: `${dt}`, operator: "eq"});
              }
            }
            break;

          case '[String]':
            ors += `{field:${modelAttributes[i]}, value:"${words[w]}", operator:in},`;
            o_ors.push({field: modelAttributes[i], value: `${words[w]}`, operator: "in"});
            break;

          case '[Int]':
            num = words[w].split(',').map(x=>{
            if (!x.includes('.')) {
              return parseInt(x)
            }});
            if (Array.isArray(num) && !num.includes(NaN) && !num.includes(undefined)) {
              ors += `{field:${modelAttributes[i]}, value:"${words[w]}", operator:in},`;
              o_ors.push({field: modelAttributes[i], value: `${num}`, operator: "in"});
            }
            break;

          case '[Float]':
            num = words[w].split(',').map(x=>parseFloat(x));
            if (Array.isArray(num) && !num.includes(NaN) && !num.includes(undefined)) {
              ors += `{field:${modelAttributes[i]}, value:"${words[w]}", operator:in},`;
              o_ors.push({field: modelAttributes[i], value: `${num}`, operator: "in"});
            }
            break;

          case '[Boolean]':
            num = words[w].split(',')
            if (num[0] === 'true' || num[0] === 'false') {
              num = num.map(x=> x === 'true');
              ors += `{field:${modelAttributes[i]}, value:"${words[w]}", operator:in},`;
              o_ors.push({field: modelAttributes[i], value: `${num}`, operator: "in"});
            }
            break;

          case '[Date]':
            d = words[w].split(',').map(x=>getIsoDate(x));
            if (Array.isArray(d) && d[0] !== '') {
              ors += `{field:${modelAttributes[i]}, value:"${d}", operator:in},`;
              o_ors.push({field: modelAttributes[i], value: `${d}`, operator: "in"});
            }
            break;

          case '[Time]':
            t = words[w].split(',').map(x=>getIsoTime(x));
            if (Array.isArray(t) && t[0] !== '') {
              ors += `{field:${modelAttributes[i]}, value:"${t}", operator:in},`;
              o_ors.push({field: modelAttributes[i], value: `${t}`, operator: "in"});
            }
            break;

          case '[DateTime]':
            dt = words[w].split(',').map(x=>getIsoDateTime(x));
            if (Array.isArray(dt) && dt[0] !== '') {
              ors += `{field:${modelAttributes[i]}, value:"${dt}", operator:in},`;
              o_ors.push({field: modelAttributes[i], value: `${dt}`, operator: "in"});
            }
            break;
            
          default:
            break;
        }

        //make OR search argument
        orSearch = `{operator:or, search: [ ${ors} ]},`;
        o_orSearch = {operator: "or", search: o_ors};

      }//end: for each attribute (ORs)

      //add to ANDs
      ands += orSearch;
      o_ands.push(o_orSearch);

    }//end: for each word (ANDs)

    /*
      Options
    */
    if (ops !== undefined && ops !== null && typeof ops === 'object') {

      /*
        -- 'only' option --
        For each field name in only array, an AND search argument will be added to search string.

        Format:
          {
            only: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('only') && Array.isArray(ops.only)) {
        //strings
        let onlyOrs = '';
        let onlySearch = '';
        //objects
        let o_onlyOrs = [];
        let o_onlySearch = {};


        //for each only object
        for(let i = 0; i < ops.only.length; i++) {
          let o = ops.only[i];
          /*
            Switch type
            At the momment, this only works for [InternalId] fields.
            An internalID can be of types: Int, Float or String.
          */
          if (o.type === 'Int' || o.type === 'Float' || o.type === 'String') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for(let k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //in
              onlyOrs += `{field:${vkeys[k]}, valueType: Array, value:"${va.join()}", operator:in},`;
              o_onlyOrs.push({field: vkeys[k], valueType: "Array", value: va.join(), operator:"in"});

            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch only object

        onlySearch = `{operator:or, search: [ ${onlyOrs} ]},`;
        ands += onlySearch;

        o_onlySearch = {operator: "or", search: o_onlyOrs};
        o_ands.push(o_onlySearch);

      }//end: if has 'only'

      /*
        -- 'exclude' option --
        For each field name in exclude array, an AND search argument will be added to search string.

        Format:
          {
            exclude: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('exclude') && Array.isArray(ops.exclude)) {
        //for each exclude object
        for(let i = 0; i < ops.exclude.length; i++) {
          let o = ops.exclude[i];

          /*
            Switch type
            At the momment, this only works for [InternalId] fields.
            An internalID can be of types: Int, Float or String.
          */
          if (o.type === 'Int' || o.type === 'Float' || o.type === 'String') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for(let k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //notIn
              ands += `{field:${vkeys[k]}, valueType: Array, value:"${va.join()}", operator:notIn},`;
              o_ands.push({field: vkeys[k], valueType: "Array", value: va.join(), operator:"notIn"});

            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch exclude object
      }//end: if has 'exclude'
    }//end: if has 'ops'

    //make search argument
    andSearch = `search: {operator:and, search: [ ${ands} ]}`;
    o_andSearch = {search: {operator: "and", search: o_ands}};

    /**
     * Debug
     */
    console.log("@@ andSearch: ", orSearch);
    console.log("@@ o_andSearch: ", o_andSearch);
  }//end: if searchText
  else {
    /*
      Check: ops
    */
    /*
      Options
    */
    if (ops !== undefined && ops !== null && typeof ops === 'object') {
      /*
        -- 'only' option --
        For each field name in only array, an AND search argument will be added to search string.

        Format:
          {
            only: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('only') && Array.isArray(ops.only)) {
        //strings
        let onlyOrs = '';
        let onlySearch = '';
        //objects
        let o_onlyOrs = [];
        let o_onlySearch = {};

        //for each only object
        for(let i = 0; i < ops.only.length; i++) {
          let o = ops.only[i];
          /*
            Switch type
            At the momment, this only works for [InternalId] fields.
            An internalID can be of types: Int, Float or String.
          */
          if (o.type === 'Int' || o.type === 'Float' || o.type === 'String') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for(let k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //in
              onlyOrs += `{field:${vkeys[k]}, valueType: Array, value:"${va.join()}", operator:in},`
              o_onlyOrs.push({field: vkeys[k], valueType: "Array", value: va.join(), operator:"in"});

            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch only object

        onlySearch = `{operator:or, search: [ ${onlyOrs} ]},`;
        ands += onlySearch;

        o_onlySearch = {operator: "or", search: o_onlyOrs};
        o_ands.push(o_onlySearch);

      }//end: if has 'only'

      /*
        -- 'exclude' option --
        For each field name in exclude array, an AND search argument will be added to search string.

        Format:
          {
            exclude: [
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameM': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              },
              ...
              {
                values: {
                  'fieldName1': ['value1', 'value2', ..., 'valueN'],
                  ...
                  'fieldNameN': ['value1', 'value2', ..., 'valueN'],
                }
                type: 'type'
              }
            ]
          }
      */
      if (ops.hasOwnProperty('exclude') && Array.isArray(ops.exclude)) {

        //for each exclude object
        for(let i = 0; i < ops.exclude.length; i++) {
          let o = ops.exclude[i];
          /*
            Switch type
            At the momment, this only works for [InternalId] fields.
            An internalID can be of types: Int, Float or String.
          */
          if (o.type === 'Int' || o.type === 'Float' || o.type === 'String') {
            let v = o.values;
            let vkeys = Object.keys(v);

            //for each key
            for(let k = 0; k < vkeys.length; k++) {
              let va = v[vkeys[k]]; //values array

              //notIn
              ands += `{field:${vkeys[k]}, valueType: Array, value:"${va.join()}", operator:notIn},`
              o_ands.push({field: vkeys[k], valueType: "Array", value: va.join(), operator:"notIn"});

            }//end: for earch key
          }//end: if type 'Int
        }//end: for earch exclude object
      }//end: if has 'exclude'

      //make search argument
      andSearch = `search: {operator:and, search: [ ${ands} ]}`
      o_andSearch = {search: {operator: "and", search: o_ands}};

      /**
       * Debug
       */
      console.log("@@ andSearch: ", orSearch);
      console.log("@@ o_andSearch: ", o_andSearch);
    }//end: if has 'ops'
  }//end: if !searchText

  //return search filters
  switch(format) {
    case 'ands':
      return ands;
    case 'ands_object':
      return o_ands;
    case 'object':
      return o_andSearch;
    default: //string
      return andSearch;
  }
}


function getIsoDate(text) {
  //if has the form: aaaa[-/]mm[-/]dd
  if (/^\d{4}[-/][01]\d[-/][0-3]\d/.test(text)) {

    let m = text.slice(5, 7);
    let d = text.slice(8, 10);

    let numM = parseInt(m);
    let numD = parseInt(d);

    //if has the correct content
    if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31)) {
      return text;
    }
  }
  return '';
}

function getIsoTime(text) {

  /**
   * Case: complete precision: hh:mm:ss.d+
   */
  if (/^[0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(text)) {

    let h = text.slice(0, 2);
    let numH = parseInt(h);

    if (numH >= 0 && numH <= 23) {
      return text;
    }

    return '';
  } else {
    /**
     * Case: no milliseconds: hh:mm:ss
     */
    if (/^[0-2]\d:[0-5]\d:[0-5]\d/.test(text)) {

      let h = text.slice(0, 2);
      let numH = parseInt(h);

      if (numH >= 0 && numH <= 23) {
        return text;
      }

      return '';
    } else {
      /**
       * Case: no seconds: hh:mm
       */
      if (/^[0-2]\d:[0-5]\d/.test(text)) {

        let h = text.slice(0, 2);
        let numH = parseInt(h);

        if (numH >= 0 && numH <= 23) {
          return text;
        }

        return '';
      }
    }
  }

  return '';
}

function getIsoDateTime(text) {

  /**
   * Case: complete precision: YYYY[-/]MM[-/]DD[ T]hh:mm:ss.d+
   */
  if (/^\d{4}[/-][01]\d[/-][0-3]\d[T ][0-2]\d:[0-5]\d:[0-5]\d\.\d+/.test(text)) {

    let M = text.slice(5, 7);
    let D = text.slice(8, 10);
    let h = text.slice(11, 13);

    let numM = parseInt(M);
    let numD = parseInt(D);
    let numH = parseInt(h);

    //if content ok
    if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31) && (numH >= 0 && numH <= 23)) {
      return text;
    }

    return '';
  } else {
    /**
     * Case: no milliseconds: YYYY[-/]MM[-/]DD[ T]hh:mm:ss
     */
    if (/^\d{4}[/-][01]\d[/-][0-3]\d[T ][0-2]\d:[0-5]\d:[0-5]\d/.test(text)) {

      let M = text.slice(5, 7);
      let D = text.slice(8, 10);
      let h = text.slice(11, 13);

      let numM = parseInt(M);
      let numD = parseInt(D);
      let numH = parseInt(h);

      //if content ok
      if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31) && (numH >= 0 && numH <= 23)) {
        return text;
      }

      return '';
    } else {
      /**
       * Case: no seconds: YYYY[-/]MM[-/]DD[ T]hh:mm
       */
      if (/^\d{4}[/-][01]\d[/-][0-3]\d[T ][0-2]\d:[0-5]\d/.test(text)) {

        let M = text.slice(5, 7);
        let D = text.slice(8, 10);
        let h = text.slice(11, 13);

        let numM = parseInt(M);
        let numD = parseInt(D);
        let numH = parseInt(h);

        //if content ok
        if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31) && (numH >= 0 && numH <= 23)) {
          return text;
        }

        return '';
      } else {
        /**
         * Case: no time: YYYY[-/]MM[-/]DD
         */
        if (/^\d{4}[/-][01]\d[/-][0-3]\d/.test(text)) {

          let M = text.slice(5, 7);
          let D = text.slice(8, 10);

          let numM = parseInt(M);
          let numD = parseInt(D);

          //if content ok
          if ((numM >= 1 && numM <= 12) && (numD >= 1 && numD <= 31)) {
            return text;
          }

          return '';
        }
      }
    }
  }

  return '';
}