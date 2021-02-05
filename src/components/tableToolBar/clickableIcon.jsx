import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';

export default function ClickableIcon(props) {
  const { tooltip, handleOnClick } = props;

  return (
    <Grid item>
      <Tooltip title={tooltip}>
        <IconButton color="inherit" onClick={handleOnClick}>
          {props.children}
        </IconButton>
      </Tooltip>
    </Grid>
  );
}
