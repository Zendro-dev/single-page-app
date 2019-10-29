import React from 'react'
import { connect } from 'react-redux';
import requestGraphql from '../../../../requests/request'

//import RoleDetailRow from './RoleDetailRow.js'

/*
  Material-UI components
*/
/*
  Table
*/
import MaterialTable from "material-table";

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
            title: 'Roles',
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
        //current item on active action
        this.currentActionItem = null;
        //current total items
        this.currentTotalItems = 0;
    }

    
    componentDidMount() {
        console.log("on: RoleTable!");
        console.log("@props: ", this.props);
        console.log("@props.history: ", this.props.history);
    }


    /*
      Render
    */
    render() {
        return (
            <div style={{ 
                maxWidth:"100%", 
                paddingTop:"50px" 
            }}>

                <MaterialTable
                    //title
                    title={this.state.title}

                    /*
                      @icons
                    */
                    icons={{
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
                    }}

                    /*
                    @headers
                    ID
                    Name
                    Description
                    */
                    columns={[
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
                    ]}
                    /*
                        @data
                        Retrieved by GraphQL API
                    */
                    data={
                        query => new Promise((resolve, reject) => {
                            /*
                              Get totalItems
                            */
                            var t = this;

                            console.log("@@props: ", this.props);

                            /*
                              @url: retreived from store
                              @searchText: retreived from internal table component state
                            */
                            this.getCount(this.props.graphqlServerUrl, query.search)
                                .then(response => {
                                    //Check response
                                    if (
                                        response.data &&
                                        response.data.data
                                    ) {
                                        //set totalItems
                                        t.currentTotalItems = response.data.data.countRoles;

                                        console.log("currentTotalItems: ", t.currentTotalItems);
                                        console.log("query: ", query);
                                        
                                        //check empty page
                                        var p = query.page;
                                        if ((t.currentTotalItems === (query.page * query.pageSize)) && (query.page > 0)) {
                                            p = query.page - 1;
                                        }
                                        /*
                                        Get items
                                        */
                                        this.getItems(t.props.graphqlServerUrl,
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
                                                    if ((t.currentTotalItems === (query.page * query.pageSize)) && (query.page > 0)) {
                                                        p = query.page - 1;
                                                    }
                                                    resolve({
                                                        data: response.data.data.roles,
                                                        page: p,
                                                        totalCount: t.currentTotalItems
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
                                    console.log("error4: ", err)

                                    //done
                                    return;
                                });
                        })
                    }

                    /*
                    @actions
                    */
                    actions={[
                        {
                            icon: Edit,
                            tooltip: 'Edit Role',
                            onClick: (event, rowData) => this.editItem(event, rowData)
                        },
                    ]}

                    editable={{
                        onRowDelete: oldData => new Promise((resolve, reject) => {

                            console.log("oldData: ", oldData);
                            /*
                            Delete item on server
                            */
                            var t = this;
                            this.deleteRole({
                                url: this.props.graphqlServerUrl,
                                variables: { id: oldData.id }
                            })
                                .then(function (response) {

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
                                .catch(function (err) {
                                    //error
                                    console.log("error5")
                                });
                        })
                    }}
                ></MaterialTable>
                
                {/*
                    Dialog Alert 
                */}
                <Dialog
                    open={this.state.dialogOpen}
                    onClose={this.closeDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    {/* Headline */}
                    <DialogTitle id="alert-dialog-title">
                        {this.state.dialogHeadline}
                    </DialogTitle>
                    
                    {/* Content */}
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            {this.state.dialogText}
                        </DialogContentText>
                    </DialogContent>

                    {/* Actions */}
                    <DialogActions>

                        {/* Cancel */}
                        <Button onClick={this.onDialogCanceled} color="primary">
                            {this.state.dialogCancelText}
                        </Button>
                        {/* Accept */}
                        <Button onClick={this.onDialogAccepted} color="primary" autoFocus>
                            {this.state.dialogAcceptText}
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        )
    }//end: render()

    /*
      Methods: GraphQL API requests
    */
    /**
     * getCount
     * 
     * Construct query to get count of item. Then do the query-request 
     * to GraphQL Server.
     * 
     * @param {String} url GraphQL Server url
     * @param {String} searchText Text string currently on search bar.
     */
    getCount (url, searchText){
        /*
          Set @search arg
        */
        var s = '';
        var query = '';

        if (searchText !== null && searchText !== '') {
            //make search argument
            s = `search: {operator:or, search: [ 
                            {field:name, value:{value:"%${searchText}%"}, operator:like}, 
                            {field:description, value:{value:"%${searchText}%"}, operator:like}, 
                        ]}`
            //make query with search argument
            query = `{ countRoles(${s}) }`;
        }
        else {
            //make query without search argument
            query = `{ countRoles }`;
        }

        //do request
        return requestGraphql({ url, query });
    }
    /**
     * getItems
     * 
     * Construct query to get items. Then do the query-request 
     * to GraphQL Server.
     * 
     * @param {String} url GraphQL Server url
     * @param {String} searchText Text string currently on search bar.
     * @param {Object} orderBy Object with order properties.
     * @param {String} orderDirection Text string: asc | desc.
     * @param {Number} paginationOffset Offset.
     * @param {Number} paginationLimit Max number of items to retreive.
     */
    getItems(url, searchText, orderBy, orderDirection, paginationOffset, paginationLimit) {
        /*
          Set search
        */
        var s = null;
        if (searchText !== null && searchText !== '') {
            s = `search: {
                    operator:or, search: [
                        {field:name, value:{value:"%${searchText}%"}, operator:like}, 
                        {field:description, value:{value:"%${searchText}%"}, operator:like}, 
                    ]
                }`
        }

        /*
          Set order
        */
        var o = null;
        if (typeof orderBy !== 'undefined') {
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
        if (s !== null) {
            //if has order
            if (o != null) {
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
            if (o != null) {
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

                //query string with pagination only
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

        //do request
        return requestGraphql({ url, query });
    }//end: getItems()

    deleteRole({url, variables, token}){
        //make query string
        let query = `mutation deleteRole($id:ID!) {
            deleteRole(id:$id)
        }`

        //do request
        return requestGraphql({url, query, variables, token});
    }

    /*
      Methods: Dialog Alert Handlers
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
        let url = '/role/' + rowData.id;
        this.props.history.push(url);
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
        this.onDialogAccepted = function () {
            console.log("onDialogAccepted 2");
            //delete item:
            //this.deleteItem(this.currentActionItem);
            //close dialog
            this.setState({
                dialogOpen: false
            });
        };

        //set handler: on delete-dialog canceled
        this.onDialogCanceled = function () {
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
  Make connection
*/
const mapStateToProps = state => ({
    graphqlServerUrl: state.urls.graphqlServerUrl,
});

export default connect(mapStateToProps)(Table)