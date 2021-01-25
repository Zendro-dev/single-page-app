import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
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

export default function BoolField(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    itemKey,
    name,
    label,
    text,
    valueOk,
    valueAjv,
    autoFocus,
    handleSetValue,
  } = props;

  const [checked, setChecked] = useState(getInitialChecked());

  function getInitialChecked() {
    if(text !== undefined && text !== null) {

      if(typeof text === 'string' &&  (text === 'true' || text === 'false')) {
        if(text === 'true') {
          return true;
  
        } else if (text === 'false') {
          return false;
  
        } else {
          return false;

        }
      } else if(typeof text === 'boolean') {
        return text;

      } else {
        return false;

      }
    }else {
      return false;

    }
  }

  return (
    <Grid container justify='flex-start' alignItems='center' alignContent='center' spacing={0}>
      <Grid item>
        <FormControl className={classes.root} component="fieldset">
          <FormLabel component="legend">{label}</FormLabel>
            <FormControlLabel className={classes.formControlLabel}
              control={
                <Checkbox
                  id={'BoolField-Role-'+name}
                  className={classes.checkbox}
                  checked={checked}
                  color={(valueAjv !== undefined && valueAjv.errors.length > 0) ? "secondary" : "primary"}
                  indeterminate={(valueOk===0)}
                  autoFocus={autoFocus!==undefined&&autoFocus===true ? true : false}
                  onChange={(event) => {
                    setChecked(event.target.checked);
                    
                    if(event.target.checked) {
                      handleSetValue(true, 1, itemKey);
                    }
                    else {
                      handleSetValue(false, 1, itemKey);
                    }
                  }}
                  onKeyDown={(event) => {
                    if(event.key === 'Delete') {
                      handleSetValue(null, 0, itemKey);
                      setChecked(false);
                    }
                  }}
                />
              }
            />
        </FormControl>
      </Grid>
      <Grid item>
        {(valueOk!==undefined&&valueOk===1) 
          ? 
          <Tooltip title={ t('modelPanels.valueEntered', "Value entered") }>
            <Typography id={'BoolField-Role-exists-'+name} variant="caption" color="primary">
              &#8707;
            </Typography>
          </Tooltip>
          : 
          <Tooltip title={ t('modelPanels.valueNotEntered', "Value not entered") }>
            <Typography id={'BoolField-Role-notExists-'+name} variant="caption" color="textSecondary">
              &#8708;
            </Typography>
          </Tooltip>
        }
      </Grid>
      {(valueAjv !== undefined && valueAjv.errors.length > 0) && (
        <Grid id={'BoolField-Role-ajvError-'+name} item xs={12}>
          <Typography variant="caption" color='error'>
            {valueAjv.errors.join(' & ')}
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
BoolField.propTypes = {
  itemKey: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
  valueOk: PropTypes.number.isRequired,
  valueAjv: PropTypes.object.isRequired,
  autoFocus: PropTypes.bool,
  handleSetValue: PropTypes.func.isRequired,
};