import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import { SvgIconType } from '@/types/elements';

export interface ListLinkItemProps {
  Icon: SvgIconType;
  label: string;
  text: string;
}

export default function ListLinkItem({
  Icon,
  label,
  text,
}: ListLinkItemProps): React.ReactElement {
  return (
    <ListItem dense>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText
        primary={
          <Box display="flex" alignItems="center">
            <Typography variant="button" fontWeight="bold" color="GrayText">
              {label}
            </Typography>
            <Typography fontSize="large" fontWeight="bold" marginLeft={4}>
              {text}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
}
