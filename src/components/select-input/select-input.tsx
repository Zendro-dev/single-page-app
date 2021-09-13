import clsx from 'clsx';
import { ReactElement } from 'react';
import { Theme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import {
  Divider,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { SvgIconType } from '@/types/elements';

interface SelectItem {
  id: string;
  text: string;
  icon?: SvgIconType;
  withDivider?: boolean;
}

interface StyledSelectProps {
  className?: string;
  id?: string;
  items: SelectItem[];
  label?: string;
  onChange?: (itemId: string) => void;
  defaultValue?: string;
  selected: string;
}

export default function SelectInput(props: StyledSelectProps): ReactElement {
  const classes = useStyles();

  const handleOnChange = (event: SelectChangeEvent<string>): void => {
    if (props.onChange) props.onChange(event.target.value);
  };

  return (
    <FormControl className={clsx(classes.formControl, props.className ?? '')}>
      <InputLabel variant="outlined" id={`${props.id}-label`}>
        {props.label}
      </InputLabel>
      <Select
        className={classes.select}
        id={props.id}
        label={props.label}
        labelId={`${props.id}-label`}
        value={props.selected}
        onChange={handleOnChange}
        input={<OutlinedInput label={props.label} />}
        data-cy={`${props.id}`}
        MenuProps={{
          className: classes.menu,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
      >
        {props.items.map((item) => [
          <MenuItem
            className={classes.menuItem}
            key={item.id}
            value={item.id}
            disableRipple
            data-cy={`${props.id}-${item.id}`}
          >
            {item.icon && <item.icon />}
            {item.text}
          </MenuItem>,
          item.withDivider && (
            <Divider key={`${item.id}-divider`} sx={{ my: 0.5 }} />
          ),
        ])}
      </Select>
    </FormControl>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: theme.spacing(60),
    },
    select: {
      '& .MuiOutlinedInput-input': {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(3, 9, 3, 5),
        '& .MuiSvgIcon-root': {
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(4),
        },
      },
    },
    menu: {
      '& .MuiPaper-root': {
        marginTop: theme.spacing(1),
      },
      '& .MuiList-root': {
        maxHeight: theme.spacing(124),
        minWidth: theme.spacing(60),
      },
    },
    menuItem: {
      ...theme.typography.body1,
      '& .MuiSvgIcon-root': {
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(4),
      },
    },
  })
);
