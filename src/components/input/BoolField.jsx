import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";

export default function BoolField(props) {
  const {
    itemKey,
    name,
    label,
    text,
    autoFocus,
    handleSetValue,
    readOnly,
    errMsg,
  } = props;

  const useStyles = makeStyles((theme) => ({
    root: {
      paddingLeft: theme.spacing(0),
    },
    formControlLabel: {
      margin: theme.spacing(0),
    },
    checkbox: {
      padding: theme.spacing(2),
    },
  }));
  const classes = useStyles();
  const { t } = useTranslation();

  const [checked, setChecked] = useState(text || false);
  const [indeterminate, setIndeterminate] = useState(
    text !== undefined && text !== null ? false : true
  );

  const handleOnChange = (event) => {
    if (!readOnly) {
      if (event.target.checked && !indeterminate) {
        setChecked(true);
        handleSetValue(true, 1, itemKey);
        console.log("I am true");
      } else if (!event.target.checked && !indeterminate) {
        setIndeterminate(true);
        setChecked(false);
        handleSetValue(null, 0, itemKey);
        console.log("I am null");
      } else if (event.target.checked && indeterminate) {
        setChecked(false);
        setIndeterminate(false);
        handleSetValue(false, 1, itemKey);
        console.log("I am false");
      } else {
        console.log("should never go here");
      }
    }
  };

  const handleOnKeyDown = (event) => {
    if (!readOnly) {
      if (event.key === "Delete") {
        handleSetValue(null, 0, itemKey);
        setChecked(false);
      }
    }
  };

  return (
    <Grid container justify="flex-start" alignItems="center" spacing={0}>
      <Grid item>
        <FormControl className={classes.root} component="fieldset">
          <FormLabel component="legend">{label}</FormLabel>
          <FormControlLabel
            className={classes.formControlLabel}
            control={
              <Checkbox
                id={"BoolField-" + name}
                className={classes.checkbox}
                checked={checked}
                indeterminate={indeterminate}
                autoFocus={
                  autoFocus !== undefined && autoFocus === true ? true : false
                }
                color={
                  errMsg !== undefined && errMsg !== ""
                    ? "secondary"
                    : "primary"
                }
                error={errMsg !== undefined && errMsg !== "" ? true : undefined}
                helpertext={errMsg}
                onChange={handleOnChange}
                onKeyDown={handleOnKeyDown}
                inputProps={{ readOnly: readOnly ? true : false }}
              />
            }
          />
        </FormControl>
      </Grid>
    </Grid>
  );
}