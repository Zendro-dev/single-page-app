import React from 'react';
import { connect } from 'react-redux';
import { authRequest } from '../store/actions.js';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";

/*
  Material-UI components
*/
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

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
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}));

/*
    Component: LoginPage
*/
function LoginPage({ dispatch }) {
    const classes = useStyles();
    let history = useHistory();

    /*
      State 
    */
    const [values, setValues] = React.useState({
        user: '',
        password: '',
        showPassword: false,
    });

    /*
      Handlers
    */
    const handleChange = prop => event => {
        console.log("onHandleChange");
        setValues({ ...values, [prop]: event.target.value });
        console.log("values: ", values);
    };

    const handleClickShowPassword = () => {
        console.log("onHandleClickShowPassword");
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = event => {
        console.log("onHandleMouseDownPassword");
        event.preventDefault();
    };

    return (
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
                        <CardActionArea>
                            <CardContent>
                                {/* 
                                    Title
                                */}
                                <Typography gutterBottom variant="h5" component="h2">
                                    Cenzontle
                                </Typography>
                            </CardContent>
                        </CardActionArea>

                        <form className={classes.container} noValidate autoComplete="off">
                            {/* 
                                Field: Email 
                            */}
                            <TextField
                                id="outlined-email-input"
                                label="Email"
                                className={classes.textField}
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={values.user}
                                onChange={handleChange("user")}
                                margin="normal"
                                fullWidth
                                variant="outlined"
                            />
                            {/* 
                                Field: Password 
                            */}
                            <TextField
                                id="outlined-password-input"
                                label="Password"
                                className={classes.textField}
                                type={values.showPassword ? 'text' : 'password'}
                                value={values.password}
                                onChange={handleChange("password")}
                                InputProps={{
                                    endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                }}
                                autoComplete="current-password"
                                margin="normal"
                                fullWidth
                                variant="outlined"
                            />
                        </form>
                        <CardActions>
                            {/* 
                                Button: Login 
                            */}
                            <Button
                                size="small"
                                color="primary"
                                onClick={() => {
                                    console.log('onClick: login, values: ', values);
                                    dispatch(authRequest(values.user, values.password))
                                        .then(
                                            //dispatch ok
                                            authSuccess => {
                                                if (authSuccess === "loginSuccess") {
                                                    history.push("/main/home");
                                                }
                                                else {
                                                    //show err msg
                                                }
                                                console.log("authRequest: msg: ", authSuccess);
                                            },
                                            //dispatch failed
                                            err => {
                                                console.log("Error on: dispatch(authRequest): call failed: ", err);
                                            }
                                        );
                                }}
                            >
                                Login
                            </Button>
                        </CardActions>
                    </Card>
                </Fade>
            </Grid>
        </Grid>
    );
}

/*
  Make connection
*/
export default connect()(LoginPage)