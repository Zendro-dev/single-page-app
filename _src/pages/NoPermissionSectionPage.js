import React from "react";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { metrics } from '../../../configs';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Warning from '@material-ui/icons/ErrorOutline';
import { amber } from '@material-ui/core/colors';

const useStyles = makeStyles({
  warningCard: {
    width: '100%',
    minHeight: metrics.warningCard.minHeight,
  },
});

export default function NoPermissionSectionPage() {
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
            <Warning style={{ color: amber[700] }} />
          }
          title={ t('modelPanels.messages.msg8', "You need permissions to access this section.") }
          subheader={ t('modelPanels.messages.msg9', "Please request permissions.") }
        />
      </Card>
    </Box>
  );
}