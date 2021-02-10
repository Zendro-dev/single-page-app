import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import StringField from '../input/StringField';
import BoolField from '../input/BoolField';
import DateTimeField from '../input/DateTimeField';
import IntegerField from '../input/IntField';
import FloatField from '../input/FloatField';
import { IconButton, InputAdornment, Tooltip } from '@material-ui/core';
import { Clear as ClearIcon } from '@material-ui/icons';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Key from '@material-ui/icons/VpnKey';
import Attributes from '@material-ui/icons/HdrWeakTwoTone';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
  root: {
    margin: '0rem',
  },
  card: {
    margin: '0rem',
    maxHeight: '70vh',
    overflow: 'auto',
  },
  cardB: {
    margin: '0rem',
    padding: '0rem',
  },
  cardContent: {
    marginLeft: '5rem',
    marginRight: '5rem',
    minWidth: 200,
  },
}));

const field = {
  String: StringField,
  Boolean: BoolField,
  DateTime: DateTimeField,
  Integer: IntegerField,
  Float: FloatField,
};

export default function AttributeForm({ attributes, setAttributes, ...props }) {
  const classes = useStyles();
  const { t } = useTranslation();
  const handleSetValue = (attrName, value) => {
    setAttributes({ ...attributes, [attrName]: value });
  };
  const handleClearButton = (attrName) => {
    if (!props.readOnly) {
      setAttributes({ ...attributes, [attrName]: null });
    }
  };

  const completedAttr = () => {
    let number = 0;
    for (let attrName of Object.keys(attributes)) {
      if (attributes[attrName] !== null && attributes[attrName] !== undefined) {
        number += 1;
      }
    }
    return number;
  };

  const idAttrName = Object.keys(props.dataModel).filter(
    (attrName) => props.dataModel[attrName].isId
  );

  console.log('render:');
  console.log(attributes);
  return (
    <form id="AttributesForm-div-root" className={classes.root}>
      <Card className={classes.cardB} elevation={0}>
        {/* Header */}
        <CardHeader
          avatar={<Attributes color="primary" fontSize="small" />}
          title={
            <Typography variant="h6">
              {t('modelPanels.model') + ': ' + props.modelName}
            </Typography>
          }
          subheader={
            completedAttr() +
            ' / ' +
            Object.keys(attributes).length +
            ' ' +
            t('modelPanels.completed')
          }
        ></CardHeader>
      </Card>
      <Card className={classes.card}>
        <CardContent key={idAttrName} className={classes.cardContent}>
          <Grid
            container
            alignItems="center"
            alignContent="center"
            wrap="nowrap"
            spacing={1}
          >
            {props.readOnly || props.lockId ? (
              <Grid item>
                <Typography variant="h6" display="inline">
                  idField:
                </Typography>
                <Typography variant="h6" display="inline" color="textSecondary">
                  &nbsp;{attributes[idAttrName]}
                </Typography>
              </Grid>
            ) : (
              <Grid item>
                <StringField
                  label={idAttrName}
                  value={attributes[idAttrName]}
                  onChange={handleSetValue}
                  error={props.errMsg[idAttrName] ? true : false}
                  helperText={props.errMsg[idAttrName]}
                />
              </Grid>
            )}
            {/*Key icon*/}
            <Grid item>
              <Tooltip title={t('modelPanels.internalId', 'Unique Identifier')}>
                <Key
                  fontSize="small"
                  color="disabled"
                  style={{ marginTop: 8 }}
                />
              </Tooltip>
            </Grid>
          </Grid>
        </CardContent>

        {Object.keys(props.dataModel).flatMap((attrName) => {
          const attrType = props.dataModel[attrName].type;
          const InputField = field[attrType];
          let otherProp = {};
          const clearButton = (
            <InputAdornment position="end">
              <Tooltip title="Reset">
                <IconButton
                  onClick={() => {
                    handleClearButton(attrName);
                  }}
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          );

          if (['Integer', 'Float', 'String'].includes(attrType)) {
            otherProp.InputProps = {
              readOnly: props.readOnly ? true : false,
              endAdornment: clearButton,
            };
          } else if (['Boolean', 'DateTime'].includes(attrType)) {
            otherProp.disabled = props.readOnly ? true : false;
          }
          return props.dataModel[attrName].foreignKey ||
            props.dataModel[attrName].isId
            ? []
            : [
                <CardContent key={attrName} className={classes.cardContent}>
                  <InputField
                    {...otherProp}
                    id={attrName + '-' + attrType + 'Field'}
                    label={attrName}
                    value={attributes[attrName]}
                    onChange={handleSetValue}
                    error={props.errMsg[attrName] ? true : false}
                    helperText={props.errMsg[attrName]}
                  />
                </CardContent>,
              ];
        })}
      </Card>
    </form>
  );
}
