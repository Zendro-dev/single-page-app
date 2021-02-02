import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import InputAdornment from "@material-ui/core/InputAdornment";


const useStyles = makeStyles((theme) => ({
  textField: {
    margin: "auto",
  },
}));

export default function StringField(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    itemKey,
    name,
    label,
    text,
    autoFocus,
    handleSetValue,
    errMsg,
    readOnly,
    StartIcon,
    EndIcon
  } = props;

  const defaultValue = useRef(
    text !== undefined && typeof text === "string" ? text : ""
  );
  const textValue = useRef(
    text !== undefined && typeof text === "string" ? text : null
  );


  const handleOnChange = (event) => {
    if (!readOnly){
      textValue.current = event.target.value;

      if (!textValue.current || typeof textValue.current !== "string") {
        handleSetValue(null, 0, itemKey);
      } else {
        //status is set to 1 only on blur or ctrl+Enter
        handleSetValue(textValue.current, 0, itemKey);
      }
    }
  };

  const handleOnBlur = (event) => {
    if (!readOnly){
      if (!textValue.current || typeof textValue.current !== "string") {
        handleSetValue(null, 0, itemKey);
      } else {
        handleSetValue(textValue.current, 1, itemKey);
      }
    }
  };

  const handleOnKeyDown = (event) => {
    if (!readOnly){
      if (event.ctrlKey && event.key === "Enter") {
        if (!textValue.current || typeof textValue.current !== "string") {
          handleSetValue(null, 0, itemKey);
        } else {
          handleSetValue(textValue.current, 1, itemKey);
        }
      }
    }
  }

  return (
    <Grid container justify="flex-start" alignItems= "center" spacing={0}>
      <Grid item xs={12}>
        <TextField multiline fullWidth    
        id={"StringField-" + name}
        label={label}
        rowsMax="4"
        className={classes.textField}
        margin= "normal"
        variant= "outlined"
        defaultValue= {readOnly? undefined: defaultValue.current}
        value= {readOnly? ((text !== undefined && text !== null && typeof text === "string")? text: ""):undefined}
        autoFocus= {autoFocus !== undefined && autoFocus === true ? true : false}
        error={errMsg !== undefined && errMsg !== ''} 
        helpertext= {errMsg}
        onChange = {handleOnChange}
        onBlur = {handleOnBlur}
        onKeyDown = {handleOnKeyDown}
        InputProps= {{
          readOnly: readOnly ? true : false,
          startAdornment: StartIcon? (
            <InputAdornment position="start">
              <StartIcon />
            </InputAdornment>
          ): undefined,
          endAdornment: EndIcon? (
            <InputAdornment position="end">
              <EndIcon />
            </InputAdornment>
          ): undefined
        }} 
        />
      </Grid>

    </Grid>
  );
}