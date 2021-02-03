import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import "moment/locale/es.js";
import "moment/locale/de.js";

const useStyles = makeStyles((theme) => ({
  input: {
    margin: theme.spacing(0),
  },
  formControl: {
    marginRight: theme.spacing(1),
  },
  ajvError: {
    color: "red",
  },
}));

export default function DateTimeField(props) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
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

  const [selectedDate, setSelectedDate] = useState(getInitialSelectedDate());
  const mdate = useRef(getInitialMdate());

  function getInitialSelectedDate() {
    moment.locale(i18n.language);

    if (
      text !== undefined &&
      text !== null &&
      typeof text === "string" &&
      text.trim() !== ""
    ) {
      let m = moment(text, "YYYY-MM-DDTHH:mm:ss.SSSZ");
      if (m.isValid()) {
        return m;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  function getInitialMdate() {
    moment.locale(i18n.language);

    if (
      text !== undefined &&
      text !== null &&
      typeof text === "string" &&
      text.trim() !== ""
    ) {
      let m = moment(text, "YYYY-MM-DDTHH:mm:ss.SSSZ");
      if (m.isValid()) {
        return m;
      } else {
        return moment.invalid();
      }
    } else {
      return moment.invalid();
    }
  }

  useEffect(() => {
    moment.locale(i18n.language);
  }, [i18n.language]);

  const handleOnChange = (date, value) => {
    if (!readOnly) {
      setSelectedDate(date);

      if (date !== null) {
        mdate.current = date;

        if (mdate.current.isValid()) {
          handleSetValue(
            mdate.current.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            1,
            itemKey
          );
        } else {
          handleSetValue(null, -1, itemKey);
        }
      } else {
        mdate.current = moment.invalid();
        handleSetValue(null, 0, itemKey);
      }
    }
  };

  const handleOnBlur = (event) => {
    if (!readOnly) {
      if (mdate.current.isValid()) {
        handleSetValue(
          mdate.current.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
          1,
          itemKey
        );
      }
    }
  };

  const handleOnKeyDown = (event) => {
    if (!readOnly) {
      if (event.key === "Enter") {
        if (mdate.current.isValid()) {
          handleSetValue(
            mdate.current.format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            1,
            itemKey
          );
        }
      }
    }
  };

  return (
    <Grid container justify="flex-start" alignItems="center" spacing={0}>
      <Grid item>
        <MuiPickersUtilsProvider
          libInstance={moment}
          utils={MomentUtils}
          locale={i18n.language}
        >
          <FormControl className={classes.formControl}>
            <KeyboardDateTimePicker
              id={"DateTimeField-" + name}
              className={classes.input}
              label={label}
              format={"YYYY-MM-DD HH:mm:ss.SSS"}
              value={selectedDate}
              margin={"normal"}
              autoFocus={autoFocus === true ? true : false}
              autoOk={readOnly ? true : false}
              error={errMsg !== undefined && errMsg !== "" ? true : undefined}
              helpertext={errMsg}
              variant={readOnly ? "inline" : undefined}
              inputVariant={readOnly ? "outlined" : "filled"}
              invalidDateMessage={t(
                "modelPanels.invalidDate",
                "Invalid date format"
              )}
              InputAdornmentProps={{
                id: "DateTimeField-input-inputAdornment-" + name,
              }}
              KeyboardButtonProps={{
                id: "DateTimeField-input-inputAdornment-button-" + name,
              }}
              InputProps={{
                className: classnames({
                  [classes.ajvError]: errMsg !== undefined && errMsg !== "",
                }),
                readOnly: readOnly ? true : false,
              }}
              onChange={handleOnChange}
              onBlur={handleOnBlur}
              onKeyDown={handleOnKeyDown}
            />
          </FormControl>
        </MuiPickersUtilsProvider>
      </Grid>
    </Grid>
  );
}