import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  textField: {
    margin: "auto",
    width: "100%",
    maxWidth: 300,
    minWidth: 200,
  },
}));

export default function IntField(props) {
  const classes = useStyles();
  const { t } = useTranslation();
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

  const [value, setValue] = useState(
    text !== undefined && text !== null ? text.toString() : ""
  );
  const [errorText, setErrorText] = useState(errMsg ? errMsg : null);
  const [helperText, setHelperText] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const intValue = useRef(text !== undefined && text !== null ? text : null);
  const textValue = useRef(
    text !== undefined && text !== null ? text.toString() : null
  );
  const error = useRef(false);

  useEffect(() => {
    if (refresh) {
      setRefresh(false);
    }
  }, [refresh]);

  const handleOnChange = (event) => {
    if (!readOnly) {
      setValue(event.target.value);
      textValue.current = event.target.value;
      intValue.current = Math.round(parseFloat(event.target.value));

      if (
        textValue.current !== null &&
        textValue.current !== "" &&
        !isNaN(textValue.current) &&
        !isNaN(intValue.current)
      ) {
        error.current = false;
        setErrorText(null);
        handleSetValue(intValue.current, 0, itemKey);

        //check max int32-bit value
        if (intValue.current > 2147483647) {
          error.current = true;
          setErrorText(
            t(
              "modelPanels.intMaxErr",
              "This is an Int field, the maximum valid positive number is 2147483647. Entered value: "
            ) + `${intValue.current}`
          );
          setHelperText(null);
          handleSetValue(null, -1, itemKey);
          return;
        }

        //check min int32-bit value
        if (intValue.current < -2147483647) {
          error.current = true;
          setErrorText(
            t(
              "modelPanels.intMinErr",
              "This is an Int field, the minimum valid negative number is -2147483647. Entered value: "
            ) + `${intValue.current}`
          );
          setHelperText(null);
          handleSetValue(null, -1, itemKey);
          return;
        }

        //check decimal-notation
        if (event.target.value.includes(".")) {
          setHelperText(
            t(
              "modelPanels.intRoundedWarning",
              "This is an Int field, the decimals will be rounded. Value taken: "
            ) + `${intValue.current}`
          );
        } else {
          //check e-notation
          if (event.target.value.includes("e")) {
            setHelperText(
              t("modelPanels.valueTaken", "Value taken: ") +
                `${intValue.current}`
            );
          } else {
            setHelperText(null);
          }
        }
      } else {
        error.current = true;
        setHelperText(null);
        if (textValue.current === null || textValue.current === "") {
          setErrorText(
            t(
              "modelPanels.undefinedNumber",
              "Undefined number, no value will be sent for modification on this field"
            )
          );
          handleSetValue(null, 0, itemKey);
        } else {
          setErrorText(t("modelPanels.invalidNumber", "Invalid number"));
          handleSetValue(null, -1, itemKey);
        }
      }
    }
  };
  const handleOnBlur = (event) => {
    if (!readOnly) {
      if (!error.current) {
        setErrorText(null);
        if (
          textValue.current !== null &&
          textValue.current !== "" &&
          !isNaN(textValue.current) &&
          !isNaN(intValue.current)
        ) {
          //set completed ok
          handleSetValue(intValue.current, 1, itemKey);
        } else {
          //refresh
          setErrorText(null);
          setHelperText(null);
          setValue("");
          setRefresh(true);
        }
      } else {
        //refresh
        error.current = false;
        setErrorText(null);
        setHelperText(null);
        setValue("");
        setRefresh(true);
      }
    }
  };

  const handleOnKeyDown = (event) => {
    if (!readOnly) {
      if (event.key === "Enter") {
        if (!error.current) {
          if (
            textValue.current !== null &&
            textValue.current !== "" &&
            !isNaN(textValue.current) &&
            !isNaN(intValue.current)
          ) {
            handleSetValue(intValue.current, 1, itemKey);
          } else {
            error.current = true;
            setHelperText(null);
            if (textValue.current === null || textValue.current === "") {
              setErrorText(
                t(
                  "modelPanels.undefinedNumber",
                  "Undefined number, no value will be sent for modification on this field"
                )
              );
              handleSetValue(null, 0, itemKey);
            } else {
              setErrorText(t("modelPanels.invalidNumber", "Invalid number"));
              handleSetValue(null, -1, itemKey);
            }
          }
        }
        return;
      }

      if (event.ctrlKey) {
        return;
      }

      if (/^[+\-.e]{1}$/.test(event.key)) {
        return;
      }

      if (/^\D{1}$/.test(event.key)) {
        event.preventDefault();
        return;
      }
    }
  };
  return (
    <Grid container justify="flex-start" alignItems="center" spacing={0}>
      <Grid item>
        {!refresh && (
          <TextField
            id={"IntField-" + name}
            value={value}
            label={label}
            type="number"
            className={classes.textField}
            margin="normal"
            variant={readOnly ? "outlined" : "filled"}
            placeholder={readOnly ? "" : t("modelPanels.integer")}
            helperText={
              errorText !== null
                ? errorText
                : helperText !== null
                ? helperText
                : ""
            }
            error={errorText !== null ? true : undefined}
            autoFocus={
              autoFocus !== undefined && autoFocus === true ? true : false
            }
            InputProps={{ readOnly: readOnly ? true : false }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ spellCheck: "false" }}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            onKeyDown={handleOnKeyDown}
          />
        )}
      </Grid>
    </Grid>
  );
}
