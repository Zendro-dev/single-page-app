<template>
  <div class="ui container">
    <filter-bar></filter-bar>
    <div class="inline field pull-left">
      <router-link v-bind:to="'role'"><button class="ui primary button">Add role</button></router-link>
      <button class="ui primary button" @click="downloadExampleCsv">CSV Template Table</button>
      <router-link v-bind:to="'/roles/upload_csv'"><button class="ui primary button">CSV Upload</button></router-link>
    </div>
    <vuetable ref="vuetable"
      :api-url="this.$baseUrl()"
      :fields="fields"
      :per-page="20"
      :appendParams="moreParams"
      :http-options="{ headers: {Authorization: `Bearer ${this.$store.getters.authToken}`} }"
      pagination-path="data.vueTableRole"
      detail-row-component="role-detail-row"
      data-path="data.vueTableRole.data"
      @vuetable:pagination-data="onPaginationData"
      @vuetable:cell-clicked="onCellClicked"
      @vuetable:load-error="onError"
    ></vuetable>
    <div class="vuetable-pagination ui basic segment grid">
      <vuetable-pagination-info ref="paginationInfo"
      ></vuetable-pagination-info>
      <vuetable-pagination ref="pagination"
        @vuetable-pagination:change-page="onChangePage"
      ></vuetable-pagination>
    </div>

    <!-- React: Material Table -->
    <div id="react-material-table-div"></div>

  </div>
</template>

<script>
/*
  React support
*/
import React from 'react'
import ReactDOM from 'react-dom'
import MaterialTable from "material-table";
import RoleDetailRow from './RoleDetailRow.js'
import { createBrowserHistory } from 'history';
const history = createBrowserHistory();


/*
  Dialog
*/
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

/*
  Icons
*/
import Add from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';

import Vuetable from 'vuetable-2/src/components/Vuetable.vue'
import VuetablePagination from 'vuetable-2/src/components/VuetablePagination.vue'
import VuetablePaginationInfo from 'vuetable-2/src/components/VuetablePaginationInfo.vue'
import roleCustomActions from './roleCustomActions.vue'
import roleDetailRow from './roleDetailRow.vue'
import FilterBar from './FilterBar.vue'

import axios from 'axios'

import Vue from 'vue'
import VueEvents from 'vue-events'
import Queries from '../requests/index'
Vue.use(VueEvents)

Vue.component('role-custom-actions', roleCustomActions)
Vue.component('role-detail-row', roleDetailRow)
Vue.component('filter-bar', FilterBar)

export default {
  components: {
    Vuetable,
    VuetablePagination,
    VuetablePaginationInfo,
    roleDetailRow
  },
  data() {
    return {
      fields: [{
          name: 'id',
          title: 'ID',
          titleClass: 'center aligned',
          dataClass: 'right aligned'
        },
        // For now, we do not render checkboxes, as we yet have to provide
        // functions for selected rows.
        //{
        //  name: '__checkbox',
        //  titleClass: 'center aligned',
        //  dataClass: 'center aligned'
        //},
                  {
            name: 'name',
            sortField: 'name'
          },
                  {
            name: 'description',
            sortField: 'description'
          },
                {
          name: '__component:role-custom-actions',
          title: 'Actions',
          titleClass: 'center aligned',
          dataClass: 'center aligned'
        }
      ],
      moreParams: {
        query: Queries.Role.vueTable
      }
    }
  },
  mounted() {
    /*
      React component: Table
    */
    class Table extends React.Component {
      /*
        Constructor
      */
      constructor(props) {
        super(props);
        this.state = {

          /*
            Table state
          */
          data: [],

          /*
            Dialog state
          */
          dialogHeadline: "",
          dialogText: "",
          dialogAcceptText: "",
          dialogCancelText: "",
          dialogOpen: false
        };

        /*
          Fields
        */
        //graphql url
        this.baseUrl = "http://localhost:3000/graphql";

        //current item on active action
        this.currentActionItem = null;

        //current total items
        this.cTotalItems = 0;
      }

      /*
        LifeCycle methods
      */
      // componentDidMount() {
      //   console.log("on: componentDidMount");
      // }
      /*
        Render
      */
      render() {
        return React.createElement("div", {
            style: {
              maxWidth: "100%"
            }
          }, 
          
          /*
            Material Table
          */
          React.createElement(MaterialTable, {
            /*
              @icons
            */
            icons: {
              Add: Add,
              Check: Check,
              Clear: Clear,
              Delete: Delete,
              DetailPanel: ChevronRight,
              Edit: Edit,
              Export: SaveAlt,
              Filter: FilterList,
              FirstPage: FirstPage,
              LastPage: LastPage,
              NextPage: ChevronRight,
              PreviousPage: ChevronLeft,
              ResetSearch: Clear,
              Search: Search,
              SortArrow: ArrowDownward,
              ThirdStateCheck: Remove,
              ViewColumn: ViewColumn
            },
            /*
              @table: headers
            */
           columns: [
              {
                title: 'ID',
                field: 'id',
                headerStyle: {
                  textAlign: 'center',
                  color: '#000'
                },
                cellStyle: {
                  textAlign: 'center',
                  color: '#000'
                },
                sorting: true,
              },
              {
                title: 'Name',
                field: 'name',
                headerStyle: {
                  textAlign: 'left',
                  color: '#000'
                },
                cellStyle: {
                  textAlign: 'left',
                  color: '#000'
                },
                sorting: true,
              },
              {
                title: 'Description',
                field: 'description',
                headerStyle: {
                  textAlign: 'left',
                  color: '#000'
                },
                cellStyle: {
                  textAlign: 'left',
                  color: '#000'
                },
                sorting: true,
              },
            ],
            //data
            //data: this.state.data,
            data: query => new Promise((resolve, reject) => {
              
              /*
                Get totalItems
              */
              var t = this;
              Queries.Role.getCount(this.baseUrl, query.search)
                .then(response => {
                  //Check response
                  if (
                    response.data &&
                    response.data.data
                  ) {
                    //set totalItems
                    t.cTotalItems = response.data.data.countRoles;

                    console.log("cTotalItems: ", t.cTotalItems);
                    console.log("query: ", query);

                    //check empty page
                    var p = query.page;
                    if( (t.cTotalItems === (query.page * query.pageSize)) && (query.page > 0) ) 
                    {
                      p = query.page - 1;
                    }

                    /*
                      Get items
                    */
                    Queries.Role.getItems(t.baseUrl, 
                                          query.search,
                                          query.orderBy,
                                          query.orderDirection,
                                          p * query.pageSize, //paginationOffset
                                          query.pageSize //paginationLimit
                                          )
                      .then(response => {
                        //check response
                        if (
                          response.data &&
                          response.data.data &&
                          response.data.data.roles) {
              
                          console.log("items: ", response.data.data.roles);

                          //check empty page
                          var p = query.page;
                          if( (t.cTotalItems === (query.page * query.pageSize)) && (query.page > 0) ) 
                          {
                            p = query.page - 1;
                          }

                          resolve({
                            data: response.data.data.roles,
                            page: p,
                            totalCount: t.cTotalItems
                          });
              
                          //done
                          return;
              
                        } else {
              
                          //error
                          console.log("error1");
              
                          //done
                          return;
                        }
                      })
                      .catch(err => {
              
                        //error
                        console.log("error2");
              
                        //done
                        return;
                      });

        
                    //done
                    return;
        
                  } else {
                    
                    //error
                    console.log("error3")
        
                    //done
                    return;
                  }
                })
                .catch(err => {
        
                  //error
                  console.log("error4")
        
                  //done
                  return;
                });
            }),
            //title
            title: "Roles",
            //actions
            actions: [
              {
                icon: Edit,
                tooltip: 'Edit Role',
                onClick: (event, rowData) => this.editItem(event, rowData)
              }, 
            ],
            editable: {
              onRowDelete: oldData => new Promise((resolve, reject) => {
                
                console.log("oldData: ", oldData);
                /*
                  Delete item on server
                */
                var t = this;
                Queries.Role.deleteRole({
                  url: this.baseUrl,
                  variables: { id: oldData.id }
                })
                  .then(function(response) {
                    
                    console.log("response: ", response);

                    //update table
                    let data = t.state.data;
                    const index = data.indexOf(oldData);
                    data.splice(index, 1);
                    t.setState({
                      data
                    });
          
                    resolve();
                    
                    //done
                    return;
                  })
                  .catch(function(err) {
                    //error
                    console.log("error5")
                  });
              })
            },
            //detail
            detailPanel: rowData => {
              return React.createElement(RoleDetailRow, rowData);
            },
            options: {
              actionsColumnIndex: -1
            }

          }),
          /*
            Dialog Alert
          */
          React.createElement(Dialog, {
            open: this.state.dialogOpen,
            onClose: this.closeDialog,
            "aria-labelledby": "alert-dialog-title",
            "aria-describedby": "alert-dialog-description"
          },
            //headline 
            React.createElement(DialogTitle, {
              id: "alert-dialog-title"
            }, this.state.dialogHeadline), 
            //content text
            React.createElement(DialogContent, null, 
              React.createElement(DialogContentText, {
                id: "alert-dialog-description"
              }, this.state.dialogText)), 
            //actions
            React.createElement(DialogActions, null, 
              //action.cancel
              React.createElement(Button, {
                onClick: () => this.onDialogCanceled(),
                color: "primary"
              }, this.state.dialogCancelText),
              //action.accept 
              React.createElement(Button, {
                onClick: () => this.onDialogAccepted(),
                color: "primary",
                autoFocus: true
              }, this.state.dialogAcceptText)
            )
          )//end: React.createElement: Dialog
        )}//end: React.createElement: div
      /*
        Methods
      */
      /*
        Dialog handlers
      */
      onDialogAccepted() {
        //close dialog (default)
        this.setState({
          dialogOpen: false 
        });
      }
  
      onDialogCanceled() {
        //close dialog (default)
        this.setState({
          dialogOpen: false 
        });
      }

      editItem(event, rowData) {
        //go edit
        let url = '/role/'+rowData.id;
        history.push(url);
        history.go(0);
      }

      /**
       * Shows confirmation-dialog before delete item.
       *
       * @param: {Object} item: item corresponding to the row that was clicked.
       */
      getDeleteConfirmation(event, rowData) {
  
        console.log("on: getDeleteConfirmation");
        console.log("@@rowData: ", rowData);

        //save current action item
        this.currentActionItem = rowData;
  
        //set handler: on delete-dialog accepted
        this.onDialogAccepted = function() {
          console.log("onDialogAccepted 2");

          //delete item:
          //this.deleteItem(this.currentActionItem);

          //close dialog
          this.setState({
            dialogOpen: false 
          });
        };

  
        //set handler: on delete-dialog canceled
        this.onDialogCanceled = function() {

          console.log("onDialogCanceled 2");

          //close dialog
          this.setState({
            dialogOpen: false 
          });
        };
  
        //show confirmation dialog
        //close dialog (default)
        this.setState({
          dialogHeadline: "Are you sure you want to delete this item?",
          dialogText: "Item ID: " + rowData.id,
          dialogAcceptText: "YES, DELETE",
          dialogCancelText: "DO NOT DELETE",
          dialogOpen: true 
        });
      }//end: getDeleteConfirmation()

    }//end: class Table

    /*
      Render
    */
    ReactDOM.render(
      React.createElement(Table, null, null),
      document.getElementById('react-material-table-div')
      );

    /*
      Original code
    */
    this.$events.$on('filter-set', eventData => this.onFilterSet(eventData))
    this.$events.$on('filter-reset', e => this.onFilterReset())
  },
  methods: {
    onPaginationData(paginationData) {
      this.$refs.pagination.setPaginationData(paginationData)
      this.$refs.paginationInfo.setPaginationData(paginationData)
    },
    onChangePage(page) {
      this.$refs.vuetable.changePage(page)
    },
    onCellClicked(data, field, event) {
      console.log('cellClicked: ', field.name)
      this.$refs.vuetable.toggleDetailRow(data.id)
    },
    onFilterSet(filterText) {
      this.moreParams [
        'filter'] = filterText.trim()
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onFilterReset() {
      this.moreParams = {
        query: Queries.Role.vueTable
      }
      Vue.nextTick(() => this.$refs.vuetable.refresh())
    },
    onCsvExport () {
      var t = this;
      var url = this.$baseUrl()() + '/roles/example_csv' + '?array=[' + this.$refs.vuetable.selectedTo.join(",") + ']'

      axios.get(url).then(function (response) {

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        var blob = new Blob([response.data], {type: "octet/stream"});
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'role' + '.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      }).catch(function (error) {
        t.error = error
      })
    },
    downloadExampleCsv: function() {
      Queries.Role.tableTemplate({url: this.$baseUrl()}).then(response =>{
        if(response.data && response.data.data && response.data.data.csvTableTemplateRole){
            let file = response.data.data.csvTableTemplateRole.join('\n');
            const url = window.URL.createObjectURL(new Blob([file]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'template_role.csv');
            document.body.appendChild(link);
            link.click();
        }else{
            this.$root.$emit('globalError', response)
        }
      }).catch( err =>{
        this.$root.$emit('globalError', err)
        this.$router.push('/')
      })
    },
    onError: function(res) {
      var err = (res && res.response && res.response.data && res.response.data.message ?
        res.response.data.message : res)
      this.$root.$emit('globalError', err)
      this.$router.push('/')
    }
  },
}
</script>
