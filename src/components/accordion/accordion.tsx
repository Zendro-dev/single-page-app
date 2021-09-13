import { PropsWithChildren, useState } from 'react';
import { Box, Collapse, IconButton, Typography } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';

import {
  ExpandLess as CollapseIcon,
  ExpandMore as ExpandIcon,
} from '@mui/icons-material';

interface AccordionProps {
  label: string;
  text?: string;
}

export default function Accordion(
  props: PropsWithChildren<AccordionProps>
): React.ReactElement {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleOnToggle = (): void => {
    setOpen((state) => !state);
  };

  return (
    <Box className={classes.root}>
      <Box display="flex" alignItems="center">
        <IconButton className={classes.iconButton} onClick={handleOnToggle}>
          {open ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>

        <Box padding={4} width="100%">
          <Typography component="p" fontSize={15} fontWeight="bold">
            {props.label.toUpperCase()}
          </Typography>
          {props.text && (
            <Typography component="p" variant="subtitle1" color="GrayText">
              {props.text}
            </Typography>
          )}
        </Box>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {props.children}
      </Collapse>
    </Box>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      '&:not(:first-child)::before': {
        content: '""',
        // display: 'block',
        position: 'absolute',
        width: '100%',
        height: 1,
        top: 0,
        clear: 'both',
        backgroundColor: theme.palette.grey[300],
      },
    },
    iconButton: {
      backgroundColor: theme.palette.grey[200],
      '&:hover': {
        backgroundColor: theme.palette.grey[400],
      },
      marginRight: theme.spacing(2),
    },
  })
);
