import React, { useState, useRef } from 'react';
import { connect } from 'react-redux';
import { authRequest } from '../../store/actions';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AccountCircle from '@material-ui/icons/AccountCircleOutlined';
import Lock from '@material-ui/icons/LockOutlined';

const useStyles = makeStyles(theme => ({
  card: {
    width: 450,
    height: 500,
  },
  media: {
    height: 440,
  },
  grid: {
    height: '100vh',
    width: '100vw',
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    width: 310,
  },
  loginButtonDiv: {
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  loginButton: {
    width: 200,
  },
}));

function LoginPage({ dispatch }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const history = useHistory();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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
  const passRef = useRef([]);
  const userRef = useRef([]);

  const handleChangeOnTextField = prop => event => {
    setValues({ ...values, [prop]: event.target.value });

    switch (prop) {
      case "user":
        setErrorUser({status: false, text: ""});
        setErrorPassword({status: false, text: ""});
        break;

      case "password":
        setErrorPassword({status: false,text: ""});
        break;

      default:
        break;
    }
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleKeyDownOnTextField = prop => event => {
    if (event.key === 'Enter') {
      switch (prop) {
        case 'user':
          //check user
          if (isUserValid(values.user)) {
            //check password
            if (isPasswordValid(values.password)) {
              //do login
              doLoginRequest();
            }
            else {
              passRef.current.focus();
            }
          }
          else {
            setErrorUser({
              status: true,
              text: t('login.errors.e1', "Please enter a valid e-mail. Example: myEmail@company.abc")
            })
          }
          break;

        case 'password':
          //check password
          if (isPasswordValid(values.password)) {
            //check user
            if (isUserValid(values.user)) {
              //do login
              doLoginRequest();
            } else {
              if (values.user === '' || values.user == null) {
                userRef.current.focus();
              } else {
                userRef.current.focus();
                setErrorUser({
                  status: true,
                  text: t('login.errors.e1', "Please enter a valid e-mail. Example: myEmail@company.abc")
                })
              }
            }
          } else {
            setErrorPassword({
              status: true,
              text: t('login.errors.e2', "Password is required")
            })
          }
          break;

        default:
          break;
      }
    }
  };

  function isUserValid(email) {
    //user format = email format: email@domain.abc
    return /.+@.+\..+/.test(email);
  }

  function isPasswordValid(pass) {
    return (pass !== null && pass !== '');
  }

  function doLoginRequest() {
    dispatch(authRequest(values.user, values.password))
      .then(
        authStatus => {
          console.log("auth status: ", authStatus)
          switch (authStatus) {
            //login ok
            case "loginSuccess":
              closeSnackbar();
              history.push("/main/home");
              break;

            //bad credentials
            case "500":
              enqueueSnackbar( t('login.errors.e3',"The credentials you provided are not correct."), {
                variant: 'error',
                preventDuplicate: true,
              });
              break;

            //bad token
            case "tokenError":
              enqueueSnackbar( t('login.errors.e4', "The token received by server could not be validated."), {
                variant: 'info',
                preventDuplicate: true,
              });
              break;

            //connection refused
            case "connectionRefused":
               enqueueSnackbar( t('login.errors.e5', "Could not connect to server. Please consult your network administrator."), {
                variant: 'info',
                preventDuplicate: true,
              });
              break;

            //other server error
            default:
              enqueueSnackbar( t('login.errors.e6', "An error occurred while trying to contact the server. Please contact your administrator."), {
                variant: 'info',
                preventDuplicate: true,
              });
              break;

          }
        },
        //dispatch failed
        err => {
          enqueueSnackbar( t('login.errors.e6', "An error occurred while trying to contact the server. Please contact your administrator."), {
            variant: 'info',
            preventDuplicate: true,
          });
          console.log(err);
        }
      );
  }
  /**
   * validateFields
   * 
   * Validates that email and password fields have the correct syntax.
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
    if (isUserValid(values.user)) {
      //check password
      if (isPasswordValid(values.password)) {
        //do login
        doLoginRequest();
      }
      else {
        passRef.current.focus();
        setErrorPassword({
          status: true,
          text: t('login.errors.e2', "Password is required")
        })
      }
    }
    else {
      userRef.current.focus();
      setErrorUser({
        status: true,
        text: t('login.errors.e1', "Please enter a valid e-mail. Example: myEmail@company.abc")
      })
    }

    return true;
  }

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
                      label={ t('login.email') }
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
                      label={ t('login.password') }
                      inputRef={passRef}
                      className={classes.textField}
                      type={values.showPassword ? 'text' : 'password'}
                      autoComplete="off"
                      value={values.password}
                      error={errorPassword.status}
                      helperText={errorPassword.text}
                      InputProps={{
                        endAdornment:
                          <InputAdornment position="end">
                            <Tooltip title={ t('login.showPassword') }>
                              <IconButton
                                onClick={handleClickShowPassword}
                              >
                                {values.showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </Tooltip>
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
                  size="medium"
                  color="primary"
                  onClick={() => { validateAndLogin(); }}
                >
                  { t('login.login') }
                </Button>
              </div>
            </Card>
          </Fade>
        </Grid>
      </Grid>

    </div>
  );
}

/*
  Make connection
*/
export default connect()(LoginPage)