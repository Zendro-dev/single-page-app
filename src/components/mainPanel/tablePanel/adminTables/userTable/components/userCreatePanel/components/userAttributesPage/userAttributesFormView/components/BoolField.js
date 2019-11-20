import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
  },
  checkbox: {
    padding: theme.spacing(2),
  },
}));

export default function IntField(props) {
  const classes = useStyles();
  const {
    itemKey,
    name,
    label,
    text,
    valueOk,
    autoFocus,
    handleChange,
    handleBlur,
    handleReady,
    handleKeyDown,
  } = props;

  const [checked, setChecked] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const fieldRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if(text !== undefined && text !== null && (text === 'true' || text === 'false')) {
      if(text === 'true') {
        setChecked(true);
        setIndeterminate(false);
      } else if (text === 'false') {
        setChecked(false);
        setIndeterminate(false);
      } else {
        setChecked(false);
        setIndeterminate(true);
        if(handleChange !== undefined) {
          handleChange(null, null, itemKey);
        }
      }
    } 
    else {
      setChecked(false);
      setIndeterminate(true);
    }

    if(handleReady !== undefined) {
      handleReady(itemKey, fieldRef, inputRef);
    }

  }, []);

  return (
    <FormControl className={classes.root} ref={fieldRef} component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
        <FormControlLabel
          control={
            <Checkbox
              className={classes.checkbox}
              inputRef={inputRef}
              checked={checked} 
              color="primary"
              indeterminate={indeterminate}
              onChange={(event) => {
                setChecked(event.target.checked);
                setIndeterminate(false);
                
                if(event.target.checked) {
                  if(handleChange !== undefined) {
                    handleChange(event, 'true', itemKey);
                  }
                }
                else {
                  if(handleChange !== undefined) {
                    handleChange(event, 'false', itemKey);
                  }
                }
              }}
            />
          }
        />
    </FormControl>
  );
}
IntField.propTypes = {
  itemKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.string,
  valueOk: PropTypes.number.isRequired,
  autoFocus: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleReady: PropTypes.func.isRequired,
  handleKeyDown: PropTypes.func.isRequired
};