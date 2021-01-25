import React from "react";
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import SmsFailedIcon from '@material-ui/icons/SmsFailed';
import Tooltip from '@material-ui/core/Tooltip';
import { CardContent } from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    width: '100%',
    padding: 16
  },
});

export default function ErrorPage(props) {
  const classes = useStyles();
  const { showMessage } = props;
  const { t } = useTranslation();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container justify='center' alignContent='center'>
          <Grid item>
            <Card className={classes.card} square={true}>
              <CardContent>
                <Grid container justify='center' alignContent='center'>
                  <Grid item>
                    {/* Icon */}
                    {(showMessage) ? (
                      <SmsFailedIcon fontSize="large" color="disabled" />
                    ) :
                    (
                      <Tooltip title={t('modelPanels.messages.couldNotLoaded', "Component could not be loaded")} >
                        <SmsFailedIcon fontSize="medium" color="disabled" />
                      </Tooltip>
                    )}
                    
                    {/* Message */}
                    {(showMessage) && (
                      <div>
                        <Typography variant="h5" component="h2">
                          {t('modelPanels.messages.couldNotLoaded', "Component could not be loaded")}!                    
                        </Typography>
                        <Typography color="textSecondary">
                          {t('modelPanels.messages.goodConnection', "Please make sure you have a good network connection")}
                        </Typography>
                      </div>
                    )}
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}