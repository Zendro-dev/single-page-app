import React, { useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Plot from 'react-plotly.js';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import Snackbar from '../snackbar/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { loadApi } from '../../requests/requests.index'

// const appBarHeight = 72;
// const mainMargin = 48;
// const tableFooter = 80;
// const tableToolbar = 128;
// const secondMainMargin = 24;

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(2),
  },
  container: {
    height: `calc(100vh - 72px  - 48px - 128px + 24px)`,
    minWidth: 570,
    overflow: 'auto'
  },
  card: {
    maxWidth: 345,
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
  formControl: {
    width: '100%'
  },
  plotDiv: {
    minWidth: 454,
  },
  plot: {
    width: "100%",
    height: "100%",
  },
}));

export default function UserPlotly(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  //state
  const [data, setData] = useState([ {x: [], y: [], type: 'bar',} ]);
  const [layout, setLayout] = useState({title: '', autosize: true});
  const [frames, setFrames] = useState([]);
  const [config, setConfig] = useState({
    responsive: true, 
    displaylogo: false
  }); 
  const [selectedAttribute, setSelectedAttribute] = useState("");
  const [isOnApiRequest, setIsOnApiRequest] = useState(false);

  const plotRef = useRef(null);

  //model attributes
  const modelAttributes = getModelAttributes();

  //server url
  const graphqlServerUrl = useSelector(state => state.urls.graphqlServerUrl);

  //snackbar
  const variant = useRef('info');
  const errors = useRef([]);
  const content = useRef((key, message) => (
    <Snackbar id={key} message={message} errors={errors.current}
    variant={variant.current} />
  ));
  const actionText = useRef(t('modelPanels.gotIt', "Got it"));
  const action = useRef((key) => (
    <>
      <Button color='inherit' variant='text' size='small' 
      onClick={() => { closeSnackbar(key) }}>
        {actionText.current}
      </Button>
    </> 
  ));

  /**
   * Callbacks:
   */

   /**
    * showMessage
    * 
    * Show the given message in a notistack snackbar.
    * 
    */
   const showMessage = useCallback((message, withDetail) => {
    enqueueSnackbar( message, {
      variant: variant.current,
      preventDuplicate: false,
      persist: true,
      action: !withDetail ? action.current : undefined,
      content: withDetail ? content.current : undefined,
    });
  },[enqueueSnackbar]);

  /**
    * Handlers
    */
  const handleChangeSelectedAttribute = (event) => {
    setSelectedAttribute(event.target.value);
  }

  const handleClickOnGeneratePlot = (event) => {
    getBarchartData(selectedAttribute);
    if(plotRef.current) plotRef.current.resizeHandler();
  }

  /**
    * Utils functions
    */
  /**
  * getBarchartData
  * 
  * Gets data in the form: {x1:y1, x2:y2, ...} where @x is a value of 
  * the @attribute and @y is the total ocurrences of the value, calculated 
  * over all records in the model's table. 
  * 
  * @param {String} attribute Name of the attribute to be retrieved.
  * 
  */
  async function getBarchartData(attribute) {
    setIsOnApiRequest(true);
    
    /*
      API Request: api.user.getBarchartData
    */
    let api = await loadApi("user");
    if(!api) {
      let newError = {};
      let withDetails=true;
      variant.current='error';
      newError.message = t('modelPanels.messages.apiCouldNotLoaded', "API could not be loaded");
      newError.details = t('modelPanels.messages.seeConsoleError', "Please see console log for more details on this error");
      errors.current.push(newError);
      showMessage(newError.message, withDetails);
      setIsOnApiRequest(false);
      return;
    }

    await api.user.getBarchartData(graphqlServerUrl, attribute)
      .then(
      //resolved
      (response) => {
        //check: response
        if(response.message === 'ok') {
          //check: graphql errors
          if(response.graphqlErrors) {
            let newError = {};
            let withDetails=true;
            variant.current='info';
            newError.message = t('modelPanels.errors.data.e3', 'fetched with errors.');
            newError.locations=[{model: 'user', method: 'getBarchartData()', request: 'api.user.getBarchartData'}];
            newError.path=['Users', 'Plot'];
            newError.extensions = {graphQL:{data:response.data, errors:response.graphqlErrors}};
            errors.current.push(newError);
            console.log("Error: ", newError);

            showMessage(newError.message, withDetails);
          }
        } else { //not ok
          //show error
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t(`modelPanels.errors.data.${response.message}`, 'Error: '+response.message);
          newError.locations=[{model: 'user', method: 'getBarchartData()', request: 'api.user.getBarchartData'}];
          newError.path=['Users', 'Plot'];
          newError.extensions = {graphqlResponse:{data:response.data, errors:response.graphqlErrors}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          setIsOnApiRequest(false);
          return;
        }

        //ok
        //update title
        setLayout((current) => ({...current[0], title: attribute}));
        //update plot data
        setData((current) => ([{...current[0], x: [...Object.keys(response.value)], y: [...Object.values(response.value)]}]));

        setIsOnApiRequest(false);
        return;
      },
      //rejected
      (err) => {
        throw err
      })
      //error
      .catch((err) => { //error: on api.user.getBarchartData
        if(err.isCanceled) {
          return
        } else {
          let newError = {};
          let withDetails=true;
          variant.current='error';
          newError.message = t('modelPanels.errors.request.e1', 'Error in request made to server.');
          newError.locations=[{model: 'user', method: 'getBarchartData()', request: 'api.user.getBarchartData'}];
          newError.path=['Users', 'Plot'];
          newError.extensions = {error:{message:err.message, name:err.name, response:err.response}};
          errors.current.push(newError);
          console.log("Error: ", newError);

          showMessage(newError.message, withDetails);
          setIsOnApiRequest(false);
          return;
        }
      });
  }

  function getModelAttributes() {
    return [
      "email",
      "password",
    ];
  }

  return (
    <div className={classes.root}>
      <Grid container>
        {/*
          Selector 
        */}
        <Grid item xs={12}>
          <div className={classes.container}>
            <Grid container spacing={1}>
              <Grid item>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography gutterBottom variant="h4">
                      { t('modelPanels.plot1.title', 'Bar chart') }
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                      { t('modelPanels.plot1.description', "Select a model attribute and click on button 'generate plot' to generate a frequency distribution bar chart of the selected attribute.") }
                    </Typography>
                  </CardContent>
                  <CardContent>
                    <FormControl className={classes.formControl}>
                      <TextField 
                        id="select" 
                        label={t('modelPanels.plot1.label', 'Attributes')}
                        value={selectedAttribute}
                        variant="outlined" 
                        select
                        onChange={handleChangeSelectedAttribute}
                      >
                        <MenuItem value="">
                          <em>{t('modelPanels.plot1.none', 'None')}</em>
                        </MenuItem>

                        {modelAttributes.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </TextField>
                    </FormControl>
                  </CardContent>
                  <CardActions>
                    <Button 
                      color="primary"
                      disabled={(selectedAttribute===""||isOnApiRequest) ? true : false}
                      endIcon={(isOnApiRequest) ? <CircularProgress size={30} /> : null}
                      onClick={handleClickOnGeneratePlot}
                    >
                      {t('modelPanels.plot1.button', 'Generate plot')}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
              {/*
                Plot 
              */}
              <Grid item xs>
                <div className={classes.plotDiv}>
                  <Plot
                    ref={plotRef}
                    data={data}
                    layout={layout}
                    frames={frames}
                    config={config}
                    useResizeHandler={true}
                    className={classes.plot}

                    onInitialized={(figure) => {
                      setData(figure.data);
                      setLayout(figure.layout);
                      setFrames(figure.frames);
                      setConfig(figure.config);
                    }}
                    onUpdate={(figure) => {
                      setData(figure.data);
                      setLayout(figure.layout);
                      setFrames(figure.frames);
                      setConfig(figure.config);
                    }}
                  />
                </div>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </div>
  );
}
