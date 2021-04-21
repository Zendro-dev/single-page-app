import clsx from 'clsx';
import { ReactElement, useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Divider,
  OutlinedInput,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core';
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
  onChange?: (itemId: string, itemText: string) => void;
  defaultValue?: string;
}

export default function StyledSelect(props: StyledSelectProps): ReactElement {
  const [selected, setSelected] = useState<string>(
    props.defaultValue ?? props.items[0].id
  );
  const classes = useStyles();

  const handleOnChange = (
    event: React.ChangeEvent<{ value: string }>
  ): void => {
    setSelected(event.target.value);

    const { id, text } = props.items.find(
      (assoc) => assoc.id === event.target.value
    ) as SelectItem;

    if (props.onChange) props.onChange(id, text);
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
        value={selected}
        onChange={handleOnChange}
        input={<OutlinedInput label={props.label} />}
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
          getContentAnchorEl: null,
        }}
      >
        {props.items.map((item) => [
          <MenuItem
            className={classes.menuItem}
            key={item.id}
            value={item.id}
            disableRipple
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

const useStyles = makeStyles((theme) =>
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
