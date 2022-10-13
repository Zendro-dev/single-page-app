import React, { useState, forwardRef } from 'react';
import clsx from 'clsx';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  useSnackbar,
  SnackbarContent,
  SnackbarKey,
  VariantType,
  SnackbarMessage,
} from 'notistack';
import {
  Collapse,
  Paper,
  Typography,
  Card,
  CardActions,
  IconButton,
  Box,
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { green, red, blue, orange } from '@mui/material/colors';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export interface AlertToastProps {
  id: SnackbarKey;
  variant: VariantType;
  message: SnackbarMessage;
  details?: unknown;
}

const toast = forwardRef<HTMLDivElement, AlertToastProps>(
  ({ id, variant, message, details }, ref) => {
    const classes = useStyles();
    const { closeSnackbar } = useSnackbar();
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = (): void => {
      setExpanded(!expanded);
    };

    const handleDismiss = (): void => {
      closeSnackbar(id);
    };

    const backgroundColor = clsx(
      classes.card,
      { [classes.successBackgroundColor]: variant === 'success' },
      { [classes.errorBackgroundColor]: variant === 'error' },
      { [classes.warningBackgroundColor]: variant === 'warning' },
      { [classes.infoBackgroundColor]: variant === 'info' }
    );

    const textColor = clsx(
      { [classes.successContrastColor]: variant === 'success' },
      { [classes.errorContrastColor]: variant === 'error' },
      { [classes.warningContrastColor]: variant === 'warning' },
      { [classes.infoContrastColor]: variant === 'info' }
    );

    return (
      <SnackbarContent ref={ref} className={classes.root}>
        <Card className={backgroundColor}>
          <CardActions classes={{ root: classes.actionRoot }}>
            <Box display="flex" alignItems="center">
              {!!details && (
                <IconButton
                  aria-label="Show more"
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                  })}
                  onClick={handleExpandClick}
                >
                  <ExpandMoreIcon className={textColor} />
                </IconButton>
              )}
              <Typography
                fontWeight="bold"
                className={textColor}
                component="span"
              >
                {message}
              </Typography>
            </Box>
            <IconButton className={classes.expand} onClick={handleDismiss}>
              <CloseIcon className={textColor} />
            </IconButton>
          </CardActions>
          {!!details && (
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Paper className={classes.collapse}>
                <Typography variant="subtitle1" gutterBottom>
                  Error details:
                </Typography>
                {Array.isArray(details) &&
                Array.isArray(details[0]) &&
                details[0][0] == 'record_number' ? (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          {details[0].map((field_name: string) => (
                            <TableCell key={field_name + '_key'} align="left">
                              {field_name}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {details[1].map(
                          (row: Array<string>, row_index: number) => (
                            <TableRow
                              key={row[0] + '_key'}
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              {row.map((field, col_index) => (
                                <TableCell
                                  component="th"
                                  scope="row"
                                  key={`index_${row_index}_${col_index}`}
                                  align="left"
                                >
                                  {field}
                                </TableCell>
                              ))}
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography component="pre" variant="subtitle2" gutterBottom>
                    {JSON.stringify(details, null, 5)}
                  </Typography>
                )}
              </Paper>
            </Collapse>
          )}
        </Card>
      </SnackbarContent>
    );
  }
);

export default toast;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      [theme.breakpoints.up('sm')]: {
        minWidth: '344px !important',
      },
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      flexGrow: 1,
    },
    actionRoot: {
      padding: '8px 8px 8px 16px',
      justifyContent: 'space-between',
      display: 'flex',
      width: '100%',
    },
    expand: {
      padding: '8px 8px',
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: 'rotate(180deg)',
    },
    collapse: {
      padding: 16,
      maxWidth: '80vw',
      minWidth: 344,
      maxHeight: '80vh',
      minHeight: 344,
      overflow: 'auto',
    },
    successBackgroundColor: {
      backgroundColor: green[600],
    },
    errorBackgroundColor: {
      backgroundColor: red[700],
    },
    warningBackgroundColor: {
      backgroundColor: orange[500],
    },
    infoBackgroundColor: {
      backgroundColor: blue[500],
    },
    successContrastColor: {
      color: theme.palette.getContrastText(green[600]),
    },
    errorContrastColor: {
      color: theme.palette.getContrastText(red[700]),
    },
    warningContrastColor: {
      color: theme.palette.getContrastText(orange[500]),
    },
    infoContrastColor: {
      color: theme.palette.getContrastText(blue[500]),
    },
  })
);
