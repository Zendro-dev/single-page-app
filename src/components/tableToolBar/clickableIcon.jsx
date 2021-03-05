import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

export default function ClickableIcon(props) {
  const { tooltip, handleOnClick, disabled } = props;

  return (
    <Grid item>
      <Tooltip title={tooltip}>
        <span>
          <IconButton
            color="inherit"
            disabled={disabled}
            onClick={handleOnClick}
          >
            {props.children}
          </IconButton>
        </span>
      </Tooltip>
    </Grid>
  );
}
