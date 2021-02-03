import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  textField: {
    margin: "auto",
    width: "100%",
    maxWidth: 300,
    minWidth: 200,
  },
}));

export default function FloatField(props) {
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
  const floatValue = useRef(text !== undefined && text !== null ? text : null);
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
      floatValue.current = parseFloat(event.target.value);

      if (
        textValue.current !== null &&
        textValue.current !== "" &&
        !isNaN(textValue.current) &&
        !isNaN(floatValue.current)
      ) {
        error.current = false;
        setErrorText(null);
        handleSetValue(floatValue.current, 0, itemKey);

        //check max float number
        if (floatValue.current > 1.79769313486231e308) {
          error.current = true;
          setErrorText(
            t(
              "modelPanels.floatMaxErr",
              "This is a Float field, the maximum valid positive number is 1.79769313486231e+308. Entered value: "
            ) + `${floatValue.current}`
          );
          setHelperText(null);
          handleSetValue(null, -1, itemKey);
          return;
        }

        //check min float number
        if (floatValue.current < -1.79769313486231e308) {
          error.current = true;
          setErrorText(
            t(
              "modelPanels.floatMinErr",
              "This is a Float field, the minimum valid negative number is -1.79769313486231e+308. Entered value: "
            ) + `${floatValue.current}`
          );
          setHelperText(null);
          handleSetValue(null, -1, itemKey);
          return;
        }

        //check e-notation
        if (event.target.value.includes("e")) {
          setHelperText(
            t("modelPanels.valueTaken", "Value taken: ") +
              `${floatValue.current}`
          );
        } else {
          setHelperText(null);
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
          !isNaN(floatValue.current)
        ) {
          //set completed ok
          handleSetValue(floatValue.current, 1, itemKey);
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
            !isNaN(floatValue.current)
          ) {
            handleSetValue(floatValue.current, 1, itemKey);
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
    <Grid container justify="flex-start" alignItems="center">
      <Grid item>
        {!refresh && (
          <TextField
            id={"FloatField-" + name}
            value={value}
            label={label}
            type={"number"}
            className={classes.textField}
            margin={"normal"}
            variant={readOnly ? "outlined" : "filled"}
            placeholder={readOnly ? "" : t("modelPanels.number")}
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
