import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { authRequest } from '../store/actions.js';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

/*
  Material-UI components
*/
import SnackbarContentWrapper from './SnackbarContentWrapper'
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AccountCircle from '@material-ui/icons/AccountCircleOutlined';
import Lock from '@material-ui/icons/LockOutlined';

/*
  Styles
*/
const useStyles = makeStyles(theme => ({
    card: {
        width: 400,
        height: 500
    },
    media: {
        height: 440,
    },
    grid: {
        height: '100vh',
        width: '100wh'
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        width: 310,
    },
    loginButtonDiv: {
        textAlign: 'center'
    },
    loginButton: {
        width: 200,
    },
}));

/*
    Component: LoginPage
*/
function LoginPage({ dispatch }) {
    /*
      Hooks
    */
    const classes = useStyles();
    let history = useHistory();
    const snackbarQueueRef = useRef([]);

    /*
      State Hooks
    */
    const [values, setValues] = useState({
        user: '',
        password: '',
        showPassword: false,
    });
    const [errorUser, setErrorUser] = useState({
        status: false,
        text: "",
    });
    const [errorPassword, setErrorPassword] = useState({
        status: false,
        text: "",
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessageInfo, setSnackbarMessageInfo] = useState(undefined);


    /*
      Handlers
    */
    const handleChangeOnTextField = prop => event => {
        //update values
        setValues({ ...values, [prop]: event.target.value });

        //reset errors
        switch(prop) {
            case "user":
                //reset errorUser
                setErrorUser({
                    status: false, 
                    text: ""
                })
                //reset errorPassword
                setErrorPassword({
                    status: false, 
                    text: ""
                })
                break;

            case "password":
                //reset errorPassword
                setErrorPassword({
                    status: false, 
                    text: ""
                })
                break;

            default:
                break;
        }
        
    };
    const handleClickShowPassword = () => {
        //update values
        setValues({ ...values, showPassword: !values.showPassword });
    };
    const handleKeyDownOnTextField = prop => event => {
        if(event.key === 'Enter')
        {
            switch(prop) {
                case 'user':
                    //check user
                    if(isUserValid(values.user))
                    {   
                        //check password
                        if(isPasswordValid(values.password))
                        {
                            //do login
                            doLoginRequest();
                        }
                        else {
                            //set focus on password
                            passRef.current.focus();
                        }
                    }
                    else {
                        //set error
                        setErrorUser({
                            status: true, 
                            text: "Please enter a valid e-mail. Example: myEmail@company.abc"
                        })
                    }
                    break;

                case 'password':
                    //check password
                    if(isPasswordValid(values.password))
                    {   
                        //check user
                        if(isUserValid(values.user))
                        {
                            //do login
                            doLoginRequest();
                        }
                        else {
                            if(values.user === '' || values.user == null)
                            {
                                //set focus on password
                                userRef.current.focus();
                            }
                            else {
                                //set focus on password
                                userRef.current.focus();

                                //ser error
                                setErrorUser({
                                    status: true, 
                                    text: "Please enter a valid e-mail. Example: myEmail@company.abc"
                                })
                            }
                        }
                    }
                    else {
                        //set error
                        setErrorPassword({
                            status: true,
                            text: "Password is required"
                        })
                    }
                    break;

                default:
                    break;
            }
        }
    }; //end: handleKeyDownOnTextField()

    /*
      Methods
    */
    function isUserValid(email)
    {
        //user format = email format: email@domain.abc
        return /.+@.+\..+/.test(email);
    }

    function isPasswordValid(pass)
    {
        return (pass !== null && pass !== '');
    }

    function doLoginRequest()
    {
        dispatch(authRequest(values.user, values.password))
            .then(
                //dispatch ok
                authStatus => {
                    console.log("authStatus: ", authStatus);

                    switch(authStatus) {
                        //login ok
                        case "loginSuccess":
                            history.push("/main/home");
                            break;
                        
                        //bad credentials
                        case "500":
                            console.log("on500");
                            handleNewSnackbarMessage({
                                message: 'The credentials you provided are not correct',
                                variant: 'error',
                            });
                            break;
                        
                        //other server error
                        default:
                            handleNewSnackbarMessage({
                                message: 'An error occurred while trying to contact the server. Please consult your network administrator.',
                                variant: 'info',
                            });
                            break;
                        
                    }
                },
                //dispatch failed
                err => {
                    handleNewSnackbarMessage({
                        message: 'An error occurred while trying to contact the server. Please consult your network administrator.',
                        variant: 'info',
                    });
                }
            );
    }
    /**
     * validateFields
     * 
     * Validates that email and password fields have the correct sintax.
     * This function should be invoked whenever the user 
     * accepts the fields (both not-empty) or when login
     * button is clicked.
     */
    function validateAndLogin() {
       /*
          Logic:
          1. Validate user:
            if ok: next; else: show error
          2. Validate password:
            if ok: next; else: show error
          3. login()
        */
       //check user
       if(isUserValid(values.user))
       {   
           //check password
           if(isPasswordValid(values.password))
           {
               //do login
               doLoginRequest();
           }
           else {
               //set focus on password
               passRef.current.focus();

               //set error
               setErrorPassword({
                status: true,
                text: "Password is required"
            })
           }
       }
       else {
           //set focus on user
           userRef.current.focus();

           //set error
           setErrorUser({
               status: true, 
               text: "Please enter a valid e-mail. Example: myEmail@company.abc"
           })
       }

     return true;
   }

   /*
     Snackbar handlers
   */
    /**
     * processSnackbarQueue
     * 
     * This handlers implements de logic described on section 
     * 'Consecutive Snackbars' on Material-UI documentation,
     * to handle multiple snackbar updates. See more on:
     * https://material-ui.com/es/components/snackbars/
     * 
     * Pop next snackbar from queue and show it.
     */
    const processSnackbarQueue = () => {

        console.log("onQueue: current: ", snackbarQueueRef.current);
        console.log("onQueue: current.lenght: ", snackbarQueueRef.current.length);

        if (snackbarQueueRef.current.length > 0) {
            setSnackbarMessageInfo(snackbarQueueRef.current.shift());
            setSnackbarOpen(true);
          }
    };
    const handleNewSnackbarMessage = ({ message, variant }) => {

        console.log("onhandleNewSnackbarMessage: message: ", message);
        
        snackbarQueueRef.current.push({
            message,
            variant,
            key: new Date().getTime(),
        });

        // immediately begin dismissing current message
        // to start showing new one
        if (snackbarOpen) {
            setSnackbarOpen(false);
        } else {
            processSnackbarQueue();
        }
    };

    const handleSnackbarClose = (event, reason) => {
        
        console.log("onClose: reason: ", reason);

        //discard click away
        if (reason === 'clickaway') {
        return;
        }

        //close
        setSnackbarOpen(false);
    };

    const handleSnackbarExited = () => {
        console.log("onExited ");

        processSnackbarQueue();
    };

   /*
     References
   */
   const passRef = React.createRef();
   const userRef = React.createRef();

    return (
        <div>
            <Grid className={classes.grid}
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid item xs={10}>
                    <Fade in={true} timeout={500}>
                        {/* 
                            Card: Login
                        */}
                        <Card className={classes.card}>
                            <CardContent>
                                {/* 
                                    Title
                                */}
                                <Typography gutterBottom variant="h4" component="h2">
                                    Cenzontle
                                </Typography>
                            </CardContent>

                            <form className={classes.container} noValidate autoComplete="off">
                                    {/* 
                                        Field: Email 
                                    */}
                                    <Grid container spacing={1} alignItems="center" justify="center">
                                        <Grid item>
                                            <AccountCircle />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="outlined-email-input"
                                                label="Email"
                                                inputRef={userRef}
                                                className={classes.textField}
                                                type="email"
                                                name="email"
                                                autoComplete="email"
                                                value={values.user}
                                                error={errorUser.status}
                                                helperText={errorUser.text}
                                                margin="normal"
                                                fullWidth
                                                variant="outlined"
                                                onChange={handleChangeOnTextField("user")}
                                                onKeyDown={handleKeyDownOnTextField("user")}
                                            />
                                        </Grid>
                                    </Grid>

                                    {/* 
                                        Field: Password 
                                    */}
                                    <Grid container spacing={1} alignItems="center" justify="center">
                                        <Grid item>
                                            <Lock />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                id="outlined-password-input"
                                                label="Password"
                                                inputRef = {passRef}
                                                className={classes.textField}
                                                type={values.showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                value={values.password}
                                                error={errorPassword.status}
                                                helperText={errorPassword.text}
                                                InputProps={{
                                                    endAdornment:
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                aria-label="toggle password visibility"
                                                                onClick={handleClickShowPassword}
                                                                //onMouseDown={handleMouseDownPassword}
                                                            >
                                                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                }}
                                                margin="normal"
                                                fullWidth
                                                variant="outlined"
                                                onChange={handleChangeOnTextField("password")}
                                                onKeyDown={handleKeyDownOnTextField("password")}
                                            />
                                        </Grid>
                                    </Grid>
                            </form>
                            {/* 
                                Button: Login 
                            */}
                            <div className={classes.loginButtonDiv}>
                                <Button className={classes.loginButton}
                                    size="small"
                                    color="primary"
                                    onClick={() => {validateAndLogin()}}
                                >
                                    Login
                                </Button>
                            </div>
                        </Card>
                    </Fade>
                </Grid>
            </Grid>

            <Snackbar
                key={snackbarMessageInfo ? snackbarMessageInfo.key : undefined}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                onExited={handleSnackbarExited}
            >
                <SnackbarContentWrapper
                    onClose={handleSnackbarClose}
                    variant={snackbarMessageInfo ? snackbarMessageInfo.variant : 'info'}
                    message={snackbarMessageInfo ? snackbarMessageInfo.message : ''}
                />
            </Snackbar>
      </div>
    );
}

/*
  Make connection
*/
export default connect()(LoginPage)