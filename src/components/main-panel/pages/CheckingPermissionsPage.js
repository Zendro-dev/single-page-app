import React from "react";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { metrics } from '../../../configs';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  warningCard: {
    width: '100%',
    minHeight: metrics.warningCard.minHeight,
  },
});

export default function CheckingPermissionsPage() {
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
          avatar={
            <CircularProgress disableShrink />
          }
          title={ t('modelPanels.messages.msg10', "Checking permissions...") }
        />
      </Card>
    </Box>
  );
}