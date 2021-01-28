import { blue } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { ErrorOutline as ErrorOutlineIcon } from '@material-ui/icons';
import { Box, Card, CardHeader } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { metrics } from '../configs';

const NotFoundSectionPage: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box
      width="100%"
      p={0}
      position="relative"
      top={metrics.appBar.height}
      left={0}
      zIndex="speedDial"
    >
      <Card className={classes.warningCard} square={true}>
        <CardHeader
          avatar={<ErrorOutlineIcon style={{ color: blue[500] }} />}
          title={t('modelPanels.messages.msg13', 'Page not found.')}
          subheader={t(
            'modelPanels.messages.msg12',
            'Are you sure it should be here?'
          )}
        />
      </Card>
    </Box>
  );
};

const useStyles = makeStyles({
  warningCard: {
    width: '100%',
    minHeight: metrics.warningCard.minHeight,
  },
});

export default NotFoundSectionPage;
